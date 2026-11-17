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
 const c=vm.createContext({console,Math,Set,Map,Uint16Array,URLSearchParams,location:{search:''},localStorage:{getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v)},document:{getElementById:get,createElement:node,querySelector:()=>node(),body:node(),addEventListener(){}},performance:{now:()=>1},window:{__arcLabManual:true,arcAudio:{mode(){},pause(){},effect(){}},matchMedia:()=>({matches:false})},setTimeout:()=>0,clearTimeout(){},requestAnimationFrame(){},arcWaveLocked:()=>false,towerPrices:{precision:80,rapid:90,pierce:125,elink:200,area:180,freeze:135,boom:175,grapple:155,maw:220}});



 const exports=`
 function validDrop(x,y,type){const cell=snapConstruction(x,y);return (type!=='pusher'||pusherBuildAvailable())&&!arcWaveLocked()&&technologyAvailable(type)&&!!cell&&energy>=towerPrices[type]&&(type!=='elink'||(eLinkPending?validELinkEnd(eLinkPending,cell):hasELinkEnd(cell)))}
 function dropTower(x,y,type){if(arcWaveLocked()||!technologyFeedback(type)||!validDrop(x,y,type))return false;let cell=snapConstruction(x,y);if(type==='elink')return placeELinkCell(cell);let {x:gx,y:gy}=cell;let t={x:gx,y:gy,angle:0,cool:0,lv:1,type};if(type==='boom')t.boomAngle=fixedBoomAngle(t);towers.push(t);energy-=towerPrices[type];selected={x:gx,y:gy};selectedRangeSince=performance.now();placing=false;placementHover=null;boomHover=null;modeButtons();update();draw();return true}
 const realDraw=draw,realTunnel=underTunnel;draw=()=>{};
 globalThis.sim={
 reset:()=>{campaignStageNumber=6;unlockCampaignTechnologies(8);build();playing=true;waveNumber=1;paused=false;waveSpawned=0;waveTotal=999;waveDelay=99999;autoWaveCountdown=-1;waveIntroStart=revealSweepStart=0;},
 setup:(ms,ts)=>{monsters=ms;towers=ts;},
 tower:(lv=1,extra={})=>({x:4,y:4,type:'maw',lv,cool:0,angle:0,...extra}),
 enemy:(id,progress=500,extra={})=>({id,progress,type:2,spin:0,hp:100,maxHp:100,moveSpeed:1,spinSpeed:1,reward:20,armor:6,plates:Array(6).fill(true),...extra}),
 route:points=>{way=[];let d=0;for(let i=0;i<points.length;i++){if(i===0){way.push({...points[i],dist:0});continue}const a=points[i-1],b=points[i],n=Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/20),length=Math.hypot(b.x-a.x,b.y-a.y);for(let k=1;k<=n;k++)way.push({x:a.x+(b.x-a.x)*k/n,y:a.y+(b.y-a.y)*k/n,dist:d+length*k/n});d+=length}jumpPairs=[];underTunnel=()=>false;hookPreviewCache.clear()},
 setRawRoute:points=>{way=points;hookPreviewCache.clear()},portals:p=>jumpPairs=p,
 capture:beginHookCapture,end:endHookCapture,prepare:prepareHook,advance:advanceHook,cancel:cancelHookForTower,dropPoint:findHookDrop,can:canHookCapture,
 monsters:()=>monsters,towers:()=>towers,path:()=>way,point:monsterPosition,center:ctr,spec:towerSpec,preview:hookPlacementExample,
 protected:isMagnetProtected,hit:(m)=>applyGeometricHit({m,kind:'heart',x:0,y:0},100),magnet:canMagnetCapture,grapple:canGrapple,push:canPusherTarget,
 blocked:fn=>underTunnel=fn||realTunnel,
 step:()=>animate((last||1)+50),pause:v=>paused=v,speed:v=>$('speed').value=String(v),
 state:()=>({playing,paused,energy,kills,lives,escaped}),status:hookStatus,
 draw:()=>{draw=realDraw;try{draw()}finally{draw=()=>{}}},drawTower:paintHook,drawTransfers:paintHookTransfers,
 energy:v=>energy=v,budget:()=>energy,available:()=>technologyAvailable('maw'),tech:()=>campaignProgress.unlocked,
 drop:dropTower,free:()=>{const cells=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(freeConstructionCell(x,y))cells.push({x,y});return cells},
 upgrade:t=>{const p=campaignUpgradeCost(t);if(energy<p)return false;energy-=p;t.lv++;return true},
 elinks:advanceELinks,geometry:geometricHits,boomerang:launchBoomSalve,rebuild:build,
 escapes:resolveEscapes
 };
 })();`;
 vm.runInContext(source.slice(start,end)+exports,c,{timeout:10000});return c.sim;
}
let checks=0;function check(name,fn){fn();checks++;console.log('PASS '+name)}
function fixture(){const s=game();s.reset();s.speed(1);return s}
function bend(s,left=100){const t=s.tower(),c=s.center(t);s.route([{x:c.x-left,y:c.y-100},{x:c.x-left,y:c.y+100},{x:c.x+100,y:c.y+100},{x:c.x+100,y:c.y-100}]);const m=s.enemy(1,200+left+100+100);s.setup([m],[t]);return {t,m,c}}
check('Hook replaces the old technology at the same 220-energy construction price',()=>{
 const s=fixture();assert(s.available());assert(s.tech().includes('maw'));const c=s.center(s.free()[0]),before=s.budget();assert(s.drop(c.x,c.y,'maw'));assert.equal(s.budget(),before-220);assert.equal(s.spec(s.towers()[0]).loss,.1);
});
check('drop geometry is exactly opposite and earlier on the same path',()=>{
 const s=fixture(),{t,m,c}=bend(s),from=s.point(m),drop=s.dropPoint(t,m);assert(drop);assert.equal(drop.progress,100);assert(drop.progress<m.progress);const a={x:from.x-c.x,y:from.y-c.y},b={x:drop.x-c.x,y:drop.y-c.y};assert(Math.abs(a.x*b.y-a.y*b.x)<1e-7);assert(a.x*b.x+a.y*b.y<0);
});
check('Hook refuses capture when the only opposite path lies downstream',()=>{
 const s=fixture(),{t,m}=bend(s);m.progress=100;assert.equal(s.dropPoint(t,m),null);assert(!s.capture(t));assert(!m.hook);
});
check('Hook refuses a straight path with no valid opposite return point',()=>{
 const s=fixture(),t=s.tower(),c=s.center(t);s.route([{x:c.x+100,y:c.y-200},{x:c.x+100,y:c.y+200}]);const m=s.enemy(1,200);s.setup([m],[t]);assert(!s.capture(t));
});
check('longer arms at higher levels unlock a more distant opposite portion',()=>{
 const s=fixture(),{t,m}=bend(s,200);assert.equal(s.dropPoint(t,m),null);t.lv=3;const drop=s.dropPoint(t,m);assert(drop);assert.equal(drop.radius,200);assert.equal(drop.progress,100);
});
check('one retractable arm captures only one monster at a time',()=>{
 const s=fixture(),{t,m}=bend(s),other={...m,id:2,progress:m.progress-10};s.setup([m,other],[t]);assert(s.capture(t));assert(m.hook);assert(!other.hook);assert(!s.capture(t));
});
check('the captive retracts toward the tower then reaches the exact opposite endpoint',()=>{
 const s=fixture(),{t,m,c}=bend(s);s.capture(t);const original=s.point(m);s.advance(1.5);const middle=s.point(m);assert(Math.hypot(middle.x-c.x,middle.y-c.y)<Math.hypot(original.x-c.x,original.y-c.y));s.advance(1.15);const end=s.point(m);assert(Math.abs(end.x-m.hook.drop.x)<1e-6);assert(Math.abs(end.y-m.hook.drop.y)<1e-6);
});
check('three seconds cause exactly 30 percent max-HP loss and an upstream release',()=>{
 const s=fixture(),{t,m}=bend(s);s.capture(t);s.advance(1);assert.equal(m.hp,90);assert(m.hook);s.advance(1);assert.equal(m.hp,80);s.advance(1);assert.equal(m.hp,70);assert(!m.hook);assert.equal(m.progress,100);assert.equal(t.cool,8);assert.equal(m.hookGuard,4);
});
check('levels preserve the three-second pivot while increasing damage from 10 to 14 percent/s',()=>{
 for(let lv=1;lv<=5;lv++){const s=fixture(),{t,m}=bend(s);t.lv=lv;assert.equal(s.spec(t).duration,3);assert(s.capture(t));s.advance(3);assert(Math.abs(m.hp-(100-3*(9+lv)))<1e-8)}
});
check('captives are immune to every shared damage and capture path, including shots in flight',()=>{
 const s=fixture(),{t,m,c}=bend(s);s.capture(t);assert(s.protected(m));assert(!s.hit(m));assert.equal(m.hp,100);assert(!s.magnet(m));assert(!s.grapple(m));assert(!s.push(m));assert.equal(s.geometry(c,s.point(m),m,s.point(m)).length,0);
 const link={x:t.x-2,y:t.y,end:{x:t.x+2,y:t.y},type:'elink',lv:5};s.towers().push(link);s.elinks(1);assert.equal(m.hp,100);
 const boom={...t,type:'boom'};s.towers().push(boom);assert(!s.boomerang(boom,c,s.spec(boom)));
});
check('dead, escaped, bound, grappled or pushed enemies cannot be captured',()=>{
 for(const extra of [{hp:0},{escaped:true},{magnetId:2},{grapple:{}},{pushMotion:{}},{pusherPending:{}},{hookGuard:2}]){
 const s=fixture(),{t,m}=bend(s);Object.assign(m,extra);assert(!s.capture(t))}
});
check('tunnel and portal endpoints are rejected before the monster is captured',()=>{
 const s=fixture(),{t,m,c}=bend(s);s.blocked(p=>p.x<c.x);assert(!s.capture(t));s.blocked(()=>false);s.portals([{at:100,kind:'edge'}]);assert(!s.capture(t));
});
check('selling mid-transfer keeps only elapsed damage and restores the original path position',()=>{
 const s=fixture(),{t,m}=bend(s),progress=m.progress;s.capture(t);s.advance(1);s.cancel(t);assert.equal(m.hp,90);assert.equal(m.progress,progress);assert(!s.protected(m));assert(!m.hook);s.advance(3);assert.equal(m.hp,90);
});
check('removing an owning tower cancels safely without further damage',()=>{
 const s=fixture(),{t,m}=bend(s);s.capture(t);s.advance(.5);s.setup([m],[]);s.advance(1);assert(!m.hook);assert.equal(m.hp,95);
});
check('bosses use the same percentage damage and receive an eight-second recapture guard',()=>{
 const s=fixture(),{t,m}=bend(s);m.boss=true;m.hp=m.maxHp=600;s.capture(t);s.advance(3);assert.equal(m.hp,420);assert.equal(m.hookGuard,8);t.cool=0;assert(!s.capture(t));
});
check('an upgrade cannot change the damage or destination of an active transfer',()=>{
 const s=fixture(),{t,m}=bend(s);s.capture(t);s.energy(1000);assert(s.upgrade(t));assert.equal(m.hook.loss,.1);assert.equal(m.hook.recovery,8);s.advance(3);assert.equal(m.hp,70);assert.equal(t.cool,8);
});
check('a lethal transfer awards one kill and one reward through the real frame loop',()=>{
 const s=fixture(),{t,m}=bend(s);m.hp=5;const before=s.state();s.step();assert(m.hook);for(let i=0;i<20;i++)s.step();assert.equal(s.state().kills,before.kills+1);assert.equal(s.state().energy,before.energy+20);for(let i=0;i<10;i++)s.step();assert.equal(s.state().kills,before.kills+1);
});
check('real frames freeze path progress during capture and obey pause and speed',()=>{
 const s=fixture(),{t,m}=bend(s),progress=m.progress;s.step();assert(m.hook);assert.equal(m.progress,progress);const hp=m.hp,age=m.hook.age;s.pause(true);for(let i=0;i<20;i++)s.step();assert.equal(m.hp,hp);assert.equal(m.hook.age,age);s.pause(false);s.speed(2);s.step();assert(Math.abs(m.hook.age-age-.1)<1e-8);assert.equal(m.progress,progress);
});
check('captured monsters cannot escape before their upstream release',()=>{
 const s=fixture(),{t,m}=bend(s);s.capture(t);assert.equal(s.escapes(),0);s.advance(3);assert.equal(s.escapes(),0);assert.equal(s.state().lives,20);
});
check('placement preview exposes a valid transfer and matches the selected arm reach',()=>{
 const s=fixture(),{t}=bend(s),preview=s.preview(t);assert(preview);assert(preview.drop.progress<preview.progress);assert(preview.drop.radius<=s.spec(t).returnRange*57);
});
check('rendering the arm, claw and destination does not mutate combat state',()=>{
 const s=fixture(),{t,m}=bend(s);s.capture(t);s.advance(1.2);const before=JSON.stringify({hp:m.hp,progress:m.progress,hook:m.hook,cool:t.cool});for(let i=0;i<20;i++){s.drawTower(t);s.drawTransfers()}assert.equal(JSON.stringify({hp:m.hp,progress:m.progress,hook:m.hook,cool:t.cool}),before);s.draw();
});
check('restart removes old captive ownership and preserves original run reset behavior',()=>{
 const s=fixture(),{t}=bend(s);s.capture(t);s.rebuild();assert.equal(s.monsters().length,0);assert.equal(s.towers().length,0);
});
console.log(checks+' Hook checks passed');

