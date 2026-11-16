// Runs the actual game loop without rendering. No browser or extra dependencies.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const start=source.indexOf("<script>(()=>{'use strict';")+8,end=source.indexOf("$('recommend').onclick=",start);
function game(){
 const nodes=new Map(),saved=new Map();
 const gradient={addColorStop(){}};
 const g=new Proxy({createLinearGradient:()=>gradient,createRadialGradient:()=>gradient},{get:(t,k)=>t[k]||(()=>{})});
 function node(){return {value:'',textContent:'',disabled:false,hidden:false,style:{},dataset:{},children:[],classList:{add(){},remove(){},toggle(){},contains(){return false}},getContext:()=>g,appendChild(){},append(){},replaceChildren(){},setAttribute(){},querySelector(){return node()},querySelectorAll(){return []},addEventListener(){},focus(){},click(){}}}
 const get=id=>{if(!nodes.has(id))nodes.set(id,node());return nodes.get(id)};
 for(const [id,value] of Object.entries({level:'2',seed:'20261104',speed:'4',analysisType:'precision',analysisLevel:'2'}))get(id).value=value;
 const c=vm.createContext({console,Math,Set,Map,Uint16Array,URLSearchParams,location:{search:''},localStorage:{getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v)},document:{getElementById:get,createElement:node,querySelector:()=>node(),body:node(),addEventListener(){}},performance:{now:()=>1},window:{__arcLabManual:true,arcAudio:{mode(){},pause(){},effect(){}},matchMedia:()=>({matches:false})},setTimeout:()=>0,clearTimeout(){},requestAnimationFrame(){},arcWaveLocked:()=>false,towerPrices:{precision:80,rapid:90,pierce:125,elink:200,area:180,freeze:135,boom:175,grapple:155,maw:220,pusher:180}});


 const exports=`
 function validDrop(x,y,type){const cell=snapConstruction(x,y);return (type!=='pusher'||pusherBuildAvailable())&&!arcWaveLocked()&&technologyAvailable(type)&&!!cell&&energy>=towerPrices[type]&&(type!=='elink'||(eLinkPending?validELinkEnd(eLinkPending,cell):hasELinkEnd(cell)))}
 function dropTower(x,y,type){if(arcWaveLocked()||!technologyFeedback(type)||!validDrop(x,y,type))return false;let cell=snapConstruction(x,y);if(type==='elink')return placeELinkCell(cell);let {x:gx,y:gy}=cell;let t={x:gx,y:gy,angle:0,cool:0,lv:1,type};if(type==='boom')t.boomAngle=fixedBoomAngle(t);towers.push(t);energy-=towerPrices[type];selected={x:gx,y:gy};selectedRangeSince=performance.now();placing=false;placementHover=null;boomHover=null;modeButtons();update();draw();return true}
 const realDraw=draw,realTunnel=underTunnel;draw=()=>{};
 globalThis.sim={
 reset:()=>{campaignStageNumber=6;unlockCampaignTechnologies(8);build();playing=true;waveNumber=1;paused=false;waveSpawned=0;waveTotal=999;waveDelay=99999;autoWaveCountdown=-1;waveIntroStart=revealSweepStart=0;},
 setup:(ms,ts)=>{monsters=ms;towers=ts;},
 state:()=>({energy,kills,lives,wave:waveNumber,paused,playing,shots:pusherShots.length,count:pusherCount(),trace:[...traceVisits]}),
 enemy:(id,progress=300,extra={})=>({id,progress,type:2,spin:0,hp:100,maxHp:100,moveSpeed:1,spinSpeed:1,reward:20,armor:6,plates:Array(6).fill(true),...extra}),
 tower:(lv=1,extra={})=>({x:4,y:4,type:'pusher',lv,cool:0,angle:0,...extra}),
 count:pusherCount,allowed:pusherBuildAvailable,validDrop,drop:dropTower,feedback:technologyFeedback,refresh:refreshTechnologies,
 launch:launchPusher,prepare:preparePusher,advance:advancePusherShots,recoil:startPusherRecoil,motion:advancePusherMotion,destination:pusherDestination,can:canPusherTarget,
 shots:()=>pusherShots,targets:()=>monsters,defenses:()=>towers,
 point:monsterPosition,pathPoint:posAt,center:ctr,route:()=>way,
 spec:towerSpec,hit:(m)=>applyGeometricHit({m,kind:'heart',x:0,y:0},1),
 maw:canMawCapture,magnet:canMagnetCapture,grapple:canGrapple,
 blocked:fn=>underTunnel=fn||realTunnel,portals:pairs=>jumpPairs=pairs,
 sell:t=>{cancelPusherForTower(t);towers=towers.filter(v=>v!==t);energy+=108;refreshPusherLimit()},
 energy:v=>energy=v,price:campaignUpgradeCost,
 free:()=>{const cells=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(freeConstructionCell(x,y))cells.push({x,y});return cells},
 step:()=>animate((last||1)+50),speed:v=>$('speed').value=String(v),pause:v=>paused=v,
 draw:()=>{draw=realDraw;try{draw()}finally{draw=()=>{}}},
 drawEffects:paintPusherEffects,drawTower:paintPusher,
 original:()=>({disabled:$('pusherMode').disabled,text:$('pusherMode').textContent}),
 upgrade:t=>{const p=campaignUpgradeCost(t);if(energy<p)return false;energy-=p;t.lv++;return true}
 };
 })();`;
 vm.runInContext(source.slice(start,end)+exports,c,{timeout:10000});return c.sim;
}
let checks=0;function check(name,fn){fn();checks++;console.log('PASS '+name)}
function fixture(){const s=game();s.reset();s.speed(1);return s}
function adjacent(s,id=1,extra={}){const t=s.tower(),c=s.center(t),p=s.route().filter(p=>p.dist>150).reduce((a,b)=>Math.hypot(a.x-c.x,a.y-c.y)<Math.hypot(b.x-c.x,b.y-c.y)?a:b);return {t,m:s.enemy(id,p.dist,extra)}}
check('legal construction rejects the third Pusher and selling reopens a slot',()=>{
 const s=fixture();s.energy(1000);for(let i=0;i<2;i++){const c=s.center(s.free()[0]);assert(s.drop(c.x,c.y,'pusher'))}const before=s.state().energy,c=s.center(s.free()[0]);assert.equal(s.count(),2);assert(!s.validDrop(c.x,c.y,'pusher'));assert(!s.drop(c.x,c.y,'pusher'));assert.equal(s.state().energy,before);s.refresh();assert(s.original().disabled);assert(!s.feedback('pusher'));s.sell(s.defenses()[0]);assert(s.allowed());assert(!s.original().disabled);assert(s.drop(c.x,c.y,'pusher'));assert.equal(s.count(),2);
});
check('a white projectile reserves exactly one target and consumes the slow cooldown',()=>{
 const s=fixture(),{t,m}=adjacent(s),other={...m,id:2,progress:m.progress-3};s.setup([m,other],[t]);assert(s.launch(t));assert.equal(s.shots().length,1);assert.equal(s.shots()[0].target,m);assert(m.pusherPending);assert(!other.pusherPending);assert.equal(t.cool,10);
});
check('two towers choose distinct targets while their projectiles travel',()=>{
 const s=fixture(),{t,m}=adjacent(s),t2={...t},other={...m,id:2,progress:m.progress-3};s.setup([m,other],[t,t2]);assert(s.launch(t));assert(s.launch(t2));assert.notEqual(s.shots()[0].target,s.shots()[1].target);
});
check('a single projectile pushes one enemy without dealing damage or stripping armor',()=>{
 const s=fixture(),{t,m}=adjacent(s),other={...m,id:2,progress:m.progress-5};s.setup([m,other],[t]);const from=m.progress,hp=m.hp,plates=[...m.plates];s.launch(t);for(let i=0;i<30&&s.shots().length;i++)s.advance(.02);assert(m.pushMotion);assert(!other.pushMotion);for(let i=0;i<30;i++)s.motion(m,.02);assert.equal(m.progress,from-114);assert.equal(m.hp,hp);assert.deepEqual(m.plates,plates);assert.equal(other.progress,from-5);
});
check('rewind follows the curved route continuously and stays at or after the entrance',()=>{
 const s=fixture(),{t,m}=adjacent(s);s.setup([m],[t]);const initial=m.progress;s.recoil(m,s.spec(t));let last=m.progress;for(let i=0;i<25;i++){s.motion(m,.02);assert(m.progress<=last);assert(m.progress>=0);assert.deepEqual(s.point(m),s.pathPoint(m.progress));last=m.progress}
 m.progress=10;m.pushGuard=0;assert(s.recoil(m,s.spec(t)));s.motion(m,.5);assert.equal(m.progress,0);assert(initial>last);
});
check('enemies remain vulnerable during recoil, but capture towers wait for it to finish',()=>{
 const s=fixture(),{t,m}=adjacent(s);s.setup([m],[t]);s.recoil(m,s.spec(t));assert(s.hit(m));assert(m.hp<100);assert(!s.maw(m));assert(!s.magnet(m));assert(!s.grapple(m));
});
check('boss and miniboss recoil is reduced to 30% with six seconds of resistance',()=>{
 for(const key of ['boss','miniBoss']){const s=fixture(),{t,m}=adjacent(s,1,{[key]:true});s.setup([m],[t]);const p=m.progress;assert(s.recoil(m,s.spec(t)));s.motion(m,.42);assert(Math.abs(p-m.progress-34.2)<1e-8);assert.equal(m.pushGuard,6);assert(!s.recoil(m,s.spec(t)));s.motion(m,6);assert(s.recoil(m,s.spec(t)))}
});
check('ordinary enemies resist another push for four seconds after recoil',()=>{
 const s=fixture(),{t,m}=adjacent(s);s.setup([m],[t]);s.recoil(m,s.spec(t));s.motion(m,.42);assert.equal(m.pushGuard,4);assert(!s.recoil(m,s.spec(t)));s.motion(m,3.99);assert(!s.recoil(m,s.spec(t)));s.motion(m,.02);assert(s.recoil(m,s.spec(t)));
});
check('dead, escaped, protected, grappled and tunnel-covered targets are ineligible',()=>{
 for(const extra of [{hp:0},{escaped:true},{magnetId:2},{maw:{}},{grapple:{}},{pushGuard:2},{pushMotion:{}}]){const s=fixture(),{t,m}=adjacent(s,1,extra);s.setup([m],[t]);assert(!s.launch(t))}
 const s=fixture(),{t,m}=adjacent(s);s.setup([m],[t]);s.blocked(()=>true);assert(!s.launch(t));
});
check('a missed, dead or newly protected target clears its projectile reservation',()=>{
 for(const change of [m=>m.hp=0,m=>m.escaped=true,m=>m.magnetId=2]){
  const s=fixture(),{t,m}=adjacent(s);s.setup([m],[t]);s.launch(t);change(m);s.advance(.01);assert(!m.pusherPending);assert.equal(s.shots().length,0);assert(!m.pushMotion);
 }
 const s=fixture(),{t,m}=adjacent(s);s.setup([m],[t]);s.launch(t);s.sell(t);assert(!m.pusherPending);assert.equal(s.shots().length,0);
});
check('recoil never crosses a portal or enters a tunnel',()=>{
 const s=fixture(),{t,m}=adjacent(s);s.setup([m],[t]);m.progress=500;s.portals([{at:440,kind:'edge'}]);assert(s.destination(m,s.spec(t))>=495);s.portals([]);const roof=s.pathPoint(450);s.blocked(p=>Math.hypot(p.x-roof.x,p.y-roof.y)<9);const stop=s.destination(m,s.spec(t));assert(stop>450);assert(stop<=500);
});
check('levels retain 10-to-8-second recharge and specializations do not bypass it',()=>{
 const s=fixture();for(let lv=1;lv<=5;lv++){const sp=s.spec(s.tower(lv));assert.equal(sp.rate,10-(lv-1)*.5);assert.equal(sp.push,2+(lv-1)*.25)}
 const t=s.tower(5,{specialization:'power'});assert.equal(s.spec(t).rate,8);assert.equal(s.spec(t).push,3.6);
});
check('an upgrade leaves the projectile already in flight on its original level snapshot',()=>{
 const s=fixture(),{t,m}=adjacent(s);s.setup([m],[t]);s.energy(1000);s.launch(t);assert(s.upgrade(t));assert.equal(s.shots()[0].spec.push,2);assert.equal(t.lv,2);
});
check('real frames honor pause and speed for projectile, recoil, resistance and recharge',()=>{
 const s=fixture(),{t,m}=adjacent(s);s.setup([m],[t]);s.step();assert(m.pusherPending||m.pushMotion);const before=JSON.stringify({p:m.progress,cool:t.cool,shots:s.shots().map(p=>({x:p.x,y:p.y,life:p.life})),motion:m.pushMotion});s.pause(true);for(let i=0;i<10;i++)s.step();assert.equal(JSON.stringify({p:m.progress,cool:t.cool,shots:s.shots().map(p=>({x:p.x,y:p.y,life:p.life})),motion:m.pushMotion}),before);
 s.pause(false);const cool=t.cool;s.speed(2);s.step();assert(Math.abs(cool-t.cool-.1)<1e-8);s.speed(1);for(let i=0;i<50;i++)s.step();assert(m.progress<s.route().at(-1).dist);assert.equal(m.hp,100);assert.equal(s.state().kills,0);
});
check('Pusher rendering runs in idle, flight and recoil without mutating combat',()=>{
 const s=fixture(),{t,m}=adjacent(s);s.setup([m],[t]);s.drawTower(t);s.launch(t);s.advance(.02);s.draw();s.advance(.5);s.motion(m,.1);const before=JSON.stringify({progress:m.progress,hp:m.hp,guard:m.pushGuard,cool:t.cool});for(let i=0;i<10;i++){s.drawTower(t);s.drawEffects()}assert.equal(JSON.stringify({progress:m.progress,hp:m.hp,guard:m.pushGuard,cool:t.cool}),before);
});

check('rewinding does not grant a second exploration visit on already reached sections',()=>{
 const s=fixture(),{t,m}=adjacent(s);t.cool=1000;s.setup([m],[t]);s.step();const before=s.state().trace;s.recoil(m,s.spec(t));for(let i=0;i<20;i++)s.step();assert.deepEqual(s.state().trace,before);
});
console.log(checks+' Pusher checks passed');

