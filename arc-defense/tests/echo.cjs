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
 enemy:(id,progress=400,extra={})=>({id,progress,type:2,spin:0,hp:100,maxHp:100,moveSpeed:1,spinSpeed:1,reward:20,armor:6,plates:Array(6).fill(true),...extra}),
 mark:beginEchoMark,can:canEchoMark,prepare:prepareEcho,advance:advanceEcho,cancel:cancelEchoForTower,marks:()=>echoMarks,
 monsters:()=>monsters,towers:()=>towers,route:()=>way,point:monsterPosition,center:ctr,
 hit:(m,damage=1,kind='heart')=>applyGeometricHit({m,kind,index:0,x:0,y:0},damage),
 beamThrough:m=>{const p=monsterPosition(m),x=(p.x-OX)/C-.5,y=(p.y-OY)/C-.5;towers.push({type:'elink',x:x-1,y,end:{x:x+1,y},lv:1,cool:0})},
  elinks:advanceELinks,boom:launchBoomSalve,advanceBoom:advanceBoomerangs,magnet:canMagnetCapture,grapple:canGrapple,
 protected:isMagnetProtected,spec:towerSpec,price:campaignUpgradeCost,drop:dropTower,free:()=>{const cells=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(freeConstructionCell(x,y))cells.push({x,y});return cells},
 energy:v=>energy=v,budget:()=>energy,available:()=>technologyAvailable('maw'),tech:()=>campaignProgress.unlocked,
 blocked:fn=>underTunnel=fn||realTunnel,
 step:()=>animate((last||1)+50),pause:v=>paused=v,speed:v=>$('speed').value=String(v),
 state:()=>({playing,paused,energy,kills,lives}),status:echoStatus,
 draw:()=>{draw=realDraw;try{draw()}finally{draw=()=>{}}},drawTower:paintEcho,drawMarks:paintEchoMarks,particles:()=>particles,
 upgrade:t=>{const p=campaignUpgradeCost(t);if(energy<p)return false;energy-=p;t.lv++;return true},
 rebuild:build
 };
 })();`;
 vm.runInContext(source.slice(start,end)+exports,c,{timeout:10000});return c.sim;
}
let checks=0;function check(name,fn){fn();checks++;console.log('PASS '+name)}
function fixture(){const s=game();s.reset();s.speed(1);return s}
function group(s,n=4){const t=s.tower(),c=s.center(t),p=s.route().filter(p=>p.dist>150).reduce((a,b)=>Math.hypot(a.x-c.x,a.y-c.y)<Math.hypot(b.x-c.x,b.y-c.y)?a:b);const ms=Array.from({length:n},(_,i)=>s.enemy(i+1,p.dist-i*10));s.setup(ms,[t]);return {t,ms}}
check('Echo reuses the old unlocked technology and costs 220 energy through legal placement',()=>{
 const s=fixture();assert(s.available());assert(s.tech().includes('maw'));const c=s.center(s.free()[0]),before=s.budget();assert(s.drop(c.x,c.y,'maw'));assert.equal(s.budget(),before-220);assert.equal(s.spec(s.towers()[0]).fraction,.3);
});
check('one mark uses target priority and two Echo towers cannot mark the same enemy',()=>{
 const s=fixture(),{t,ms}=group(s);assert(s.mark(t));assert.equal(s.marks()[0].id,ms[0].id);assert(!s.mark(t));const t2={...t,cool:0};s.towers().push(t2);assert(s.mark(t2));assert.equal(s.marks()[1].id,ms[1].id);
});
check('marking causes no damage, protection, capture, freeze or movement changes',()=>{
 const s=fixture(),{t,ms}=group(s),m=ms[0],progress=m.progress;assert(s.mark(t));assert.equal(m.hp,100);assert.equal(m.progress,progress);assert(!m.maw&&!m.grapple&&!m.magnetId);assert(!s.protected(m));assert(s.magnet(m));assert(s.grapple(m));assert(!m.frozen);s.advance();assert(ms.every(m=>m.hp===100));
});
check('ten HP of direct loss echoes three HP to exactly two neighbors',()=>{
 const s=fixture(),{t,ms}=group(s);s.mark(t);ms[0].hp-=10;s.advance();assert.equal(ms[0].hp,90);assert.equal(ms[1].hp,97);assert.equal(ms[2].hp,97);assert.equal(ms[3].hp,100);
});
check('heart hits include their actual heart multiplier in the echoed HP damage',()=>{
 const s=fixture(),{t,ms}=group(s);s.mark(t);s.hit(ms[0],5);s.advance();assert.equal(ms[0].hp,88);assert(Math.abs(ms[1].hp-96.4)<1e-8);assert(Math.abs(ms[2].hp-96.4)<1e-8);
});
check('armor-only hits do not create echoes and neighbor armor remains intact',()=>{
 const s=fixture(),{t,ms}=group(s);s.mark(t);s.hit(ms[0],5,'armor');s.advance();assert(ms.every(m=>m.hp===100));assert(ms[1].plates.every(Boolean));assert.equal(ms[1].armor,6);
});
check('Echo remains useful with only one neighbor and does not invent missing targets',()=>{
 const s=fixture(),{t,ms}=group(s,2);s.mark(t);ms[0].hp=80;s.advance();assert.equal(ms[1].hp,94);s.setup([ms[0]],[t]);ms[0].hp=70;assert.doesNotThrow(()=>s.advance());
});
check('overkill is capped to actual HP lost and a dying source still echoes its final hit',()=>{
 const s=fixture(),{t,ms}=group(s);ms[0].hp=5;s.mark(t);ms[0].hp=-100;s.advance();assert.equal(ms[1].hp,98.5);assert.equal(ms[2].hp,98.5);assert.equal(s.marks().length,0);
});
check('echo damage cannot recursively echo between marked neighbors now or next frame',()=>{
 const s=fixture(),{t,ms}=group(s);s.mark(t);const t2={...t,cool:0};s.towers().push(t2);s.mark(t2);ms[0].hp-=10;s.advance();assert.deepEqual(ms.map(m=>m.hp),[90,97,97,100]);const after=ms.map(m=>m.hp);s.advance();assert.deepEqual(ms.map(m=>m.hp),after);
});
check('simultaneous direct hits are collected before any echoes are applied',()=>{
 const s=fixture(),{t,ms}=group(s);s.mark(t);const t2={...t,cool:0};s.towers().push(t2);s.mark(t2);ms[0].hp-=10;ms[1].hp-=20;s.advance();assert.equal(ms[0].hp,84);assert.equal(ms[1].hp,77);assert.equal(ms[2].hp,91);assert.equal(ms[3].hp,100);const after=ms.map(m=>m.hp);s.advance();assert.deepEqual(ms.map(m=>m.hp),after);
});
check('protected, dead, escaped and tunnel-covered neighbors receive no echoed damage',()=>{
 for(const extra of [{magnetId:2},{hp:0},{escaped:true}]){
 const s=fixture(),{t,ms}=group(s);Object.assign(ms[1],extra);s.mark(t);const before=ms[1].hp;ms[0].hp-=10;s.advance();assert.equal(ms[1].hp,before)}
 const s=fixture(),{t,ms}=group(s);s.mark(t);const roof=s.point(ms[1]);s.blocked(p=>Math.hypot(p.x-roof.x,p.y-roof.y)<2);ms[0].hp-=10;s.advance();assert.equal(ms[1].hp,100);
});
check('damage received while the source is protected does not echo after protection ends',()=>{
 const s=fixture(),{t,ms}=group(s);s.mark(t);ms[0].magnetId=2;ms[0].hp-=10;s.advance();assert.equal(ms[1].hp,100);delete ms[0].magnetId;s.advance();assert.equal(ms[1].hp,100);
});
check('mark expiry and selling remove the effect without extra damage',()=>{
 const s=fixture(),{t,ms}=group(s);s.mark(t);s.prepare(4);assert.equal(s.marks().length,0);ms[0].hp-=10;s.advance();assert.equal(ms[1].hp,100);
 t.cool=0;s.mark(t);s.cancel(t);ms[0].hp-=10;s.advance();assert.equal(ms[1].hp,100);
});
check('each level extends duration and radius while keeping 30 percent and two neighbors',()=>{
 const s=fixture();for(let lv=1;lv<=5;lv++){const sp=s.spec(s.tower(lv));assert.equal(sp.duration,4+(lv-1)*.5);assert.equal(sp.neighbors,2);assert.equal(sp.fraction,.3);assert.equal(sp.rate,6)}
 const t=s.tower(5,{specialization:'power'});assert.equal(s.spec(t).fraction,.3);assert.equal(s.spec(t).neighbors,2);assert.equal(s.spec(t).rate,4.92);
});
check('upgrades do not alter the mark already active',()=>{
 const s=fixture(),{t}=group(s);s.mark(t);s.energy(1000);assert(s.upgrade(t));assert.equal(s.marks()[0].duration,4);assert.equal(s.marks()[0].radius,2);
});
check('normal frames move marked enemies and respect pause and speed',()=>{
 const s=fixture(),{t,ms}=group(s);s.step();assert.equal(s.marks().length,1);const m=ms[0],p=m.progress;s.step();assert(m.progress>p);const age=s.marks()[0].age;s.pause(true);for(let i=0;i<20;i++)s.step();assert.equal(s.marks()[0].age,age);s.pause(false);s.speed(2);s.step();assert(Math.abs(s.marks()[0].age-age-.1)<1e-8);
});
check('real frame processing gives kills and energy once for enemies eliminated by Echo',()=>{
 const s=fixture(),{t,ms}=group(s,3);s.mark(t);ms[1].hp=1;ms[2].hp=1;ms[0].hp-=10;const before=s.state();s.step();assert.equal(s.state().kills,before.kills+2);assert.equal(s.state().energy,before.energy+40);s.step();assert.equal(s.state().kills,before.kills+2);
});
check('Echo renderers do not mutate HP, armor, progress, marks or cooldown',()=>{
 const s=fixture(),{t,ms}=group(s);s.mark(t);ms[0].hp-=10;s.advance();const before=JSON.stringify({hp:ms.map(m=>m.hp),progress:ms.map(m=>m.progress),marks:s.marks(),cool:t.cool});for(let i=0;i<20;i++){s.drawTower(t);s.drawMarks()}assert.equal(JSON.stringify({hp:ms.map(m=>m.hp),progress:ms.map(m=>m.progress),marks:s.marks(),cool:t.cool}),before);s.draw();
});
check('restart clears every old mark and grants no delayed echo',()=>{
 const s=fixture(),{t,ms}=group(s);s.mark(t);s.rebuild();assert.equal(s.marks().length,0);assert.equal(s.monsters().length,0);
});

check('real E-Link damage feeds the same-frame echo without copying armor impacts',()=>{
 const s=fixture(),{t,ms}=group(s);s.mark(t);s.beamThrough(ms[0]);s.elinks(.5);const loss=100-ms[0].hp,before=ms[1].hp;assert(loss>0);s.advance();assert(Math.abs(ms[1].hp-(before-loss*.3))<1e-8);
});
check('Echo marking does not block Repulsor or freeze-style targeting',()=>{
 const s=fixture(),{t,ms}=group(s);s.mark(t);assert(!s.protected(ms[0]));assert(s.grapple(ms[0]));assert(s.magnet(ms[0]));assert.equal(ms[0].moveSpeed,1);
});
console.log(checks+' Echo checks passed');

