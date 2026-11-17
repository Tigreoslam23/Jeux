// Runs the actual game loop without rendering. No browser or extra dependencies.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const start=source.indexOf("<script>(()=>{'use strict';")+8,end=source.indexOf("$('recommend').onclick=",start);
function game(){
 const nodes=new Map(),saved=new Map();
 const gradient={addColorStop(){}};
 const arcCalls=[];
 const g=new Proxy({arc:(...args)=>arcCalls.push(args),createLinearGradient:()=>gradient,createRadialGradient:()=>gradient},{get:(t,k)=>t[k]||(()=>{})});
 function node(){return {value:'',textContent:'',disabled:false,hidden:false,style:{},dataset:{},children:[],classList:{add(){},remove(){},toggle(){},contains(){return false}},getContext:()=>g,appendChild(){},append(){},replaceChildren(){},setAttribute(){},querySelector(){return node()},querySelectorAll(){return []},addEventListener(){},focus(){},click(){}}}
 const get=id=>{if(!nodes.has(id))nodes.set(id,node());return nodes.get(id)};
 for(const [id,value] of Object.entries({level:'2',seed:'20261104',speed:'4',analysisType:'precision',analysisLevel:'2'}))get(id).value=value;
 const c=vm.createContext({console,Math,Set,Map,Uint16Array,URLSearchParams,location:{search:''},localStorage:{getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v)},document:{getElementById:get,createElement:node,querySelector:()=>node(),body:node(),addEventListener(){}},performance:{now:()=>1},window:{__arcLabManual:true,arcAudio:{mode(){},pause(){},effect(){}},matchMedia:()=>({matches:false})},setTimeout:()=>0,clearTimeout(){},requestAnimationFrame(){},arcWaveLocked:()=>false,towerPrices:{precision:80,rapid:90,pierce:125,elink:200,area:180,freeze:135,boom:175,grapple:155,maw:220,pusher:180}});


 c.arcCalls=arcCalls;
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
 echo:canEchoMark,magnet:canMagnetCapture,grapple:canGrapple,
 blocked:fn=>underTunnel=fn||realTunnel,portals:pairs=>jumpPairs=pairs,
 sell:t=>{cancelPusherForTower(t);towers=towers.filter(v=>v!==t);energy+=108;refreshPusherLimit()},
 energy:v=>energy=v,price:campaignUpgradeCost,
 free:()=>{const cells=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(freeConstructionCell(x,y))cells.push({x,y});return cells},
 step:()=>animate((last||1)+50),speed:v=>$('speed').value=String(v),pause:v=>paused=v,
 draw:()=>{draw=realDraw;try{draw()}finally{draw=()=>{}}},
 arcs:()=>arcCalls,directions:pusherArcDirections,drawEffects:paintPusherEffects,drawTower:paintPusher,
 original:()=>({disabled:$('pusherMode').disabled,text:$('pusherMode').textContent}),
 upgrade:t=>{const p=campaignUpgradeCost(t);if(energy<p)return false;energy-=p;t.lv++;return true}
 };
 })();`;
 vm.runInContext(source.slice(start,end)+exports,c,{timeout:10000});return c.sim;
}
let checks=0;function check(name,fn){fn();checks++;console.log('PASS '+name)}
function fixture(){const s=game();s.reset();s.speed(1);return s}
function adjacent(s,id=1,extra={}){const t=s.tower(),c=s.center(t),p=s.route().filter(p=>p.dist>150).reduce((a,b)=>Math.hypot(a.x-c.x,a.y-c.y)<Math.hypot(b.x-c.x,b.y-c.y)?a:b);return {t,m:s.enemy(id,p.dist,extra)}}

check('two-tower construction limit and sale still work',()=>{
 const s=fixture();s.energy(1000);for(let i=0;i<2;i++){const c=s.center(s.free()[0]);assert(s.drop(c.x,c.y,'pusher'))}
 const c=s.center(s.free()[0]),before=s.state().energy;assert(!s.drop(c.x,c.y,'pusher'));assert.equal(s.state().energy,before);s.sell(s.defenses()[0]);assert(s.drop(c.x,c.y,'pusher'));
});
function group(s,n=8,extra={}){const {t,m}=adjacent(s);const ms=Array.from({length:n},(_,i)=>({...s.enemy(i+1,m.progress-i*2,extra)}));s.setup(ms,[t]);return {t,ms}}
check('one pressure wave reserves at most five enemies in target-priority order',()=>{
 const s=fixture(),{t,ms}=group(s);assert(s.launch(t));assert.equal(s.shots().length,1);assert.deepEqual(s.shots()[0].targets.map(m=>m.id),[1,2,3,4,5]);assert(ms.slice(0,5).every(m=>m.pusherPending));assert(ms.slice(5).every(m=>!m.pusherPending));assert.equal(t.cool,5);
});
check('two Repulsors reserve separate groups instead of duplicating the same wave targets',()=>{
 const s=fixture(),{t,ms}=group(s,8),other={...t};s.defenses().push(other);s.launch(t);s.launch(other);assert.equal(s.shots()[0].targets.length,5);assert.equal(s.shots()[1].targets.length,3);assert.equal(new Set(s.shots().flatMap(w=>w.targets.map(m=>m.id))).size,8);
});
check('the expanding front pushes five enemies once and leaves the rest untouched',()=>{
 const s=fixture(),{t,ms}=group(s),initial=ms.map(m=>m.progress);s.launch(t);for(let i=0;i<60;i++)s.advance(.02);
 assert(ms.slice(0,5).every(m=>m.pushMotion));assert(ms.slice(5).every(m=>!m.pushMotion));
 for(const m of ms)for(let i=0;i<40;i++)s.motion(m,.02);
 for(let i=0;i<8;i++){assert.equal(ms[i].progress,initial[i]-(i<5?228:0));assert.equal(ms[i].hp,100);assert.equal(ms[i].armor,6);assert(!ms[i].pusherPending)}
});
check('waves still fire with fewer than five available monsters',()=>{
 const s=fixture(),{t,ms}=group(s,1);assert(s.launch(t));assert.equal(s.shots()[0].targets.length,1);s.advance(.5);assert(ms[0].pushMotion);
});
check('wave radius expands with simulation time rather than applying instant damage',()=>{
 const s=fixture(),{t,ms}=group(s,1);s.launch(t);const w=s.shots()[0];assert.equal(w.radius,0);assert(!ms[0].pushMotion);s.advance(.01);assert(w.radius>0&&w.radius<w.maxRadius);for(let i=0;i<50;i++)s.advance(.02);assert(ms[0].pushMotion);assert.equal(ms[0].hp,100);
});
check('front echoes cannot apply another push to the same monster',()=>{
 const s=fixture(),{t,ms}=group(s,1);s.launch(t);s.advance(.5);const from=ms[0].pushMotion.from;s.motion(ms[0],.75);const end=ms[0].progress;for(let i=0;i<50;i++)s.advance(.02);assert.equal(ms[0].progress,end);assert(!ms[0].pushMotion);assert.equal(from-end,228);
});
check('all five levels have double recoil and five-second recharge',()=>{
 const s=fixture();for(let lv=1;lv<=5;lv++){const sp=s.spec(s.tower(lv));assert.equal(sp.capacity,5);assert.equal(sp.rate,5);assert.equal(sp.push,4+(lv-1)*.5)}
 const t=s.tower(5,{specialization:'power'});assert.equal(s.spec(t).rate,5);assert.equal(s.spec(t).push,7.2);
});
check('boss recoil remains 30 percent and applies an eight-second guard',()=>{
 for(const key of ['boss','miniBoss']){const s=fixture(),{t,ms}=group(s,1,{[key]:true}),m=ms[0],p=m.progress;s.recoil(m,s.spec(t));assert.equal(m.pushMotion.duration,.75);s.motion(m,.75);assert(Math.abs(p-m.progress-68.4)<1e-8);assert.equal(m.pushGuard,8);assert(!s.recoil(m,s.spec(t)))}
});
check('ordinary enemies remain damageable while rewinding and resist repeats for six seconds',()=>{
 const s=fixture(),{t,ms}=group(s,1),m=ms[0];s.recoil(m,s.spec(t));assert(s.hit(m));assert(s.echo(m));assert(!s.grapple(m));s.motion(m,.75);assert.equal(m.pushGuard,6);assert(!s.recoil(m,s.spec(t)));s.motion(m,6);assert(s.recoil(m,s.spec(t)));
});
check('dead, bound, grappled and tunnel-covered enemies are excluded from wave selection',()=>{
 for(const extra of [{hp:0},{escaped:true},{magnetId:2},{grapple:{}},{pushGuard:2}]){const s=fixture(),{t}=group(s,1,extra);assert(!s.launch(t))}
 const s=fixture(),{t}=group(s,1);s.blocked(()=>true);assert(!s.launch(t));
});
check('invalid or out-of-range targets are freed without being replaced by a sixth enemy',()=>{
 const s=fixture(),{t,ms}=group(s);s.launch(t);ms[0].hp=0;ms[1].progress=0;s.advance(.5);assert(!ms[0].pusherPending);assert(!ms[1].pusherPending);assert(ms.slice(2,5).every(m=>m.pushMotion));assert(ms.slice(5).every(m=>!m.pushMotion));
});
check('selling a tower releases every outstanding wave reservation',()=>{
 const s=fixture(),{t,ms}=group(s);s.launch(t);s.sell(t);assert.equal(s.shots().length,0);assert(ms.every(m=>!m.pusherPending));
});
check('an upgraded tower does not change an existing wave snapshot',()=>{
 const s=fixture(),{t}=group(s);s.energy(1000);s.launch(t);assert(s.upgrade(t));assert.equal(s.shots()[0].spec.push,4);assert.equal(s.shots()[0].spec.rate,5);
});
check('real frames freeze wave propagation, recoil and recharge during pause',()=>{
 const s=fixture(),{t,ms}=group(s);s.step();const snapshot=()=>JSON.stringify({waves:s.shots().map(w=>({age:w.age,r:w.radius,life:w.life})),positions:ms.map(m=>m.progress),cool:t.cool});const before=snapshot();s.pause(true);for(let i=0;i<20;i++)s.step();assert.equal(snapshot(),before);s.pause(false);s.speed(2);const cool=t.cool;s.step();assert(Math.abs(cool-t.cool-.1)<1e-8);
});
check('recoil follows the path and cannot go before the entrance or through a portal',()=>{
 const s=fixture(),{t,ms}=group(s,1),m=ms[0];s.recoil(m,s.spec(t));let previous=m.progress;for(let i=0;i<40;i++){s.motion(m,.02);assert(m.progress<=previous);assert(m.progress>=0);assert.deepEqual(s.point(m),s.pathPoint(m.progress));previous=m.progress}
 m.pushGuard=0;m.progress=10;s.recoil(m,s.spec(t));s.motion(m,.75);assert.equal(m.progress,0);m.progress=500;s.portals([{at:440,kind:'edge'}]);assert(s.destination(m,s.spec(t))>=495);
});
check('wave and recoil renderers leave combat state unchanged',()=>{
 const s=fixture(),{t,ms}=group(s);s.launch(t);s.advance(.1);const snapshot=()=>JSON.stringify({age:s.shots()[0]?.age,r:s.shots()[0]?.radius,positions:ms.map(m=>m.progress),hp:ms.map(m=>m.hp),cool:t.cool});const before=snapshot();for(let i=0;i<20;i++){s.drawTower(t);s.drawEffects()}assert.equal(snapshot(),before);s.advance(.5);s.draw();
});

check('repulsive fronts are open Wi-Fi arcs and never full rings',()=>{
 const s=fixture(),{t}=group(s);s.launch(t);s.advance(.35);s.arcs().length=0;s.drawEffects();
 assert(s.arcs().length>=6);for(const a of s.arcs()){assert(Math.abs(a[4]-a[3])<Math.PI*2);assert(Math.abs(a[4]-a[3]-Math.PI*2/3)<1e-8)}
});
check('open fans cover selected target groups without reducing the five-target capacity',()=>{
 const s=fixture(),{t,ms}=group(s);s.launch(t);const w=s.shots()[0];assert.equal(w.targets.length,5);assert(w.directions.length>=1&&w.directions.length<=5);
 for(const m of w.targets){const p=s.point(m),angle=Math.atan2(p.y-w.y,p.x-w.x);assert(w.directions.some(d=>Math.abs(Math.atan2(Math.sin(angle-d),Math.cos(angle-d)))<=Math.PI/3))}
});
console.log(checks+' Repulsor arc checks passed');

