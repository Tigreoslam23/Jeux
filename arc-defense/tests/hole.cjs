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
 const c=vm.createContext({console,Math,Set,Map,Uint16Array,URLSearchParams,location:{search:''},localStorage:{getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v)},document:{getElementById:get,createElement:node,querySelector:()=>node(),body:node(),addEventListener(){}},performance:{now:()=>1},window:{__arcLabManual:true,arcAudio:{mode(){},pause(){},effect(){}},matchMedia:()=>({matches:false})},setTimeout:()=>0,clearTimeout(){},requestAnimationFrame(){},arcWaveLocked:()=>false,towerPrices:{precision:80,rapid:90,pierce:125,elink:200,area:180,freeze:135,boom:175,grapple:155,maw:900}});



 const exports=`
 function validDrop(x,y,type){const cell=snapConstruction(x,y);return (type!=='pusher'||pusherBuildAvailable())&&!arcWaveLocked()&&technologyAvailable(type)&&!!cell&&energy>=towerPrices[type]&&(type!=='elink'||(eLinkPending?validELinkEnd(eLinkPending,cell):hasELinkEnd(cell)))}
 function dropTower(x,y,type){if(arcWaveLocked()||!technologyFeedback(type)||!validDrop(x,y,type))return false;let cell=snapConstruction(x,y);if(type==='elink')return placeELinkCell(cell);let {x:gx,y:gy}=cell;let t={x:gx,y:gy,angle:0,cool:0,lv:1,type};if(type==='boom')t.boomAngle=fixedBoomAngle(t);towers.push(t);energy-=towerPrices[type];selected={x:gx,y:gy};selectedRangeSince=performance.now();placing=false;placementHover=null;boomHover=null;modeButtons();update();draw();return true}
 const realDraw=draw,realTunnel=underTunnel;draw=()=>{};
 globalThis.sim={
 mines:()=>holeMines,injectMine:(extra={})=>{const t=towers[0]||{x:4,y:4,type:'maw',lv:1,cool:0};const m={...posAt(400),progress:400,id:1,age:0,opened:false,lastBeep:-1,tower:t,sp:{...towerSpec(t)},...extra};holeMines.push(m);return m},
 paintFields:paintHoleFields,paintCaptives:paintHoleCaptives,scale:holeCaptureScale,
 hold:t=>window.arcAppState(),removeTower:t=>{cancelHoleForTower(t);towers=towers.filter(q=>q!==t)},

 loadFree:id=>{freeMapNumber=id;playMode='free';build();},loadStage:id=>{campaignStageNumber=id;playMode='campaign';build();},
 config:()=>freeMap(),liveText:()=>$('wave').textContent,launch:()=>{launchWave(true);waveIntroStart=revealSweepStart=0;last=1;},
 frame:()=>animate((last||1)+50),data:()=>({waveSpawned,waveTotal,waveNumber,lives,kills,energy,playing,paused,titanEncounter,freePathRevealed,boostPads,jumpPairs,way,mode:playMode}),
 killAll:()=>monsters.forEach(m=>m.hp=0),setPaused:v=>paused=v,setSpeed:v=>$('speed').value=String(v),
 reveal:()=>{revealSweepStart=1;last=950;animate(1001)},best:()=>freeBest(freeMapNumber),campaignSave:()=>JSON.stringify(campaignProgress),
 fx:paintLoopCircuitEffects,start:startFreeMap,rows:()=>nodes.get('endSummary')?.children,render:()=>{draw=realDraw;try{draw()}finally{draw=()=>{}}},
 scenic:buildExoticRoute,featurePads:scenicBoostPads,

 reset:()=>{campaignStageNumber=6;unlockCampaignTechnologies(8);build();playing=true;waveNumber=1;paused=false;waveSpawned=0;waveTotal=999;waveDelay=99999;autoWaveCountdown=-1;waveIntroStart=revealSweepStart=0;},
 setup:(ms,ts)=>{monsters=ms;towers=ts;},
 tower:(lv=1,extra={})=>({x:4,y:4,type:'maw',lv,cool:0,angle:0,...extra}),
 enemy:(id,progress=500,extra={})=>({id,progress,type:2,spin:0,hp:100,maxHp:100,moveSpeed:1,spinSpeed:1,reward:20,armor:6,plates:Array(6).fill(true),...extra}),
 route:points=>{way=[];let d=0;for(let i=0;i<points.length;i++){if(i===0){way.push({...points[i],dist:0});continue}const a=points[i-1],b=points[i],n=Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/20),length=Math.hypot(b.x-a.x,b.y-a.y);for(let k=1;k<=n;k++)way.push({x:a.x+(b.x-a.x)*k/n,y:a.y+(b.y-a.y)*k/n,dist:d+length*k/n});d+=length}jumpPairs=[];underTunnel=()=>false;holeSiteCache.clear()},
 setRawRoute:points=>{way=points;holeSiteCache.clear()},portals:p=>jumpPairs=p,
 capture:beginHoleMine,prepare:prepareHole,advance:advanceHole,cancel:cancelHoleForTower,dropPoint:findHoleSite,can:canHoleCapture,
 monsters:()=>monsters,towers:()=>towers,path:()=>way,point:monsterPosition,center:ctr,spec:towerSpec,preview:findHoleSite,
 protected:isMagnetProtected,hit:(m)=>applyGeometricHit({m,kind:'heart',x:0,y:0},100),magnet:canMagnetCapture,grapple:canGrapple,push:canPusherTarget,
 blocked:fn=>underTunnel=fn||realTunnel,
 step:()=>animate((last||1)+50),pause:v=>paused=v,speed:v=>$('speed').value=String(v),
 state:()=>({playing,paused,energy,kills,lives,escaped}),status:holeStatus,
 draw:()=>{draw=realDraw;try{draw()}finally{draw=()=>{}}},drawTower:paintHole,drawTransfers:paintHoleCaptives,
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
function fixture(){const s=game();s.reset();s.speed(1);const t=s.tower(),c=s.center(t);s.route([{x:0,y:c.y+100},{x:1000,y:c.y+100}]);s.setup([],[t]);return {s,t,c}}
check('Hole replaces Hook at 900 energy using the preserved technology slot',()=>{const s=game();s.loadFree(1);assert(s.available());s.energy(899);const c=s.center(s.free()[0]);assert(!s.drop(c.x,c.y,'maw'));s.energy(900);assert(s.drop(c.x,c.y,'maw'));assert.equal(s.budget(),0);assert.equal(s.spec(s.towers()[0]).rate,28)});
check('all five durations follow 2 × 1.2^(level−1), with long cooldown and growing radius',()=>{const {s}=fixture();for(let lv=1;lv<=5;lv++){const sp=s.spec(s.tower(lv));assert.equal(sp.duration,2*1.2**(lv-1));assert.equal(sp.rate,28);assert(Math.abs(sp.radius-(1.65+.2*(lv-1)))<1e-9)}assert(Math.abs(s.spec(s.tower(5)).duration-4.1472)<1e-9)});
check('the retractable arm deposits one mine on the actual path in range',()=>{const {s,t}=fixture(),m=s.enemy(1,350);s.setup([m],[t]);assert(s.capture(t));const mine=s.mines()[0],c=s.center(t);assert(Math.abs(s.point({progress:mine.progress}).y-mine.y)<1e-6);assert(Math.hypot(c.x-mine.x,c.y-mine.y)<=s.spec(t).range*57);assert.equal(t.cool,28);assert(!s.capture(t))});
check('no eligible target or reachable route consumes a mine or cooldown',()=>{const {s,t}=fixture();assert(!s.capture(t));assert.equal(t.cool,0);s.route([{x:0,y:0},{x:1000,y:0}]);s.setup([s.enemy(1,350)],[t]);assert(!s.capture(t));assert.equal(s.mines().length,0)});
check('mines cannot be dropped at a portal mouth or over a tunnel',()=>{const {s,t}=fixture();s.blocked(()=>true);assert.equal(s.dropPoint(t),null);s.blocked(()=>false);s.portals([{at:400,kind:'edge'}]);const site=s.dropPoint(t);assert(!site||Math.abs(site.progress-400)>=s.spec(t).radius*57+40)});
check('deployment and countdown cannot damage or immobilize passing enemies',()=>{const {s,t}=fixture(),m=s.enemy(1,400);s.setup([m],[t]);const mine=s.injectMine();s.advance(mine.sp.deploy+mine.sp.fuse-.001);assert.equal(m.hp,100);assert(!m.holeCapture);s.advance(.002);assert(m.holeCapture);assert.equal(m.hp,100)});
check('the explosion pulls upstream and downstream enemies but excludes units outside the radius',()=>{const {s,t}=fixture(),ms=[320,400,480,600].map((p,i)=>s.enemy(i+1,p));s.setup(ms,[t]);s.injectMine({age:3.15});s.advance(.05);assert(ms.slice(0,3).every(m=>m.holeCapture));assert(!ms[3].holeCapture);s.advance(.61);assert(ms.slice(0,3).every(m=>m.hp===0));assert.equal(ms[3].hp,100)});
check('captives spiral toward the center and shrink before their lethal collapse',()=>{const {s,t}=fixture(),m=s.enemy(1,480);s.setup([m],[t]);const mine=s.injectMine({age:3.15});s.advance(.1);const a=s.point(m),scale=s.scale(m.holeCapture);s.advance(.2);const b=s.point(m);assert(Math.hypot(b.x-mine.x,b.y-mine.y)<Math.hypot(a.x-mine.x,a.y-mine.y));assert(s.scale(m.holeCapture)<scale);assert.equal(m.progress,480);assert(m.hp>0);s.advance(.4);assert.equal(m.hp,0)});
check('magnetic protection is respected and suction protects targets from all other damage',()=>{const {s,t}=fixture(),shielded=s.enemy(1,400,{magnetId:1}),m=s.enemy(2,420);s.setup([shielded,m],[t]);s.injectMine({age:3.15});s.advance(.1);assert(!shielded.holeCapture);assert(m.holeCapture);assert(s.protected(m));assert.equal(s.hit(m),false);assert(!s.grapple(m));assert(!s.push(m));assert(!s.magnet(m));assert.equal(s.geometry({x:0,y:0},{x:1000,y:1000},m,s.point(m)).length,0)});
check('the vortex lifetime ends exactly at the configured cutoff; captured units still finish',()=>{const {s,t}=fixture(),a=s.enemy(1,400);s.setup([a],[t]);const mine=s.injectMine({age:5.14});s.advance(.005);assert(a.holeCapture);const b=s.enemy(2,420);s.setup([a,b],[t]);s.advance(.01);assert(!b.holeCapture);s.advance(.65);assert.equal(a.hp,0);assert.equal(b.hp,100)});
check('fully armored bosses are swallowed by the same lethal rule',()=>{const {s,t}=fixture(),boss=s.enemy(1,400,{boss:true,hp:560,maxHp:560,plateHp:Array(6).fill(100)});s.setup([boss],[t]);s.injectMine({age:3.15});s.advance(.05);assert(boss.holeCapture);s.advance(.65);assert.equal(boss.hp,0);assert.equal(boss.armor,6)});
check('overlapping vortices claim a monster once and preserve one kill and reward',()=>{const {s,t}=fixture(),m=s.enemy(1,400);s.setup([m],[t]);const a=s.injectMine({age:3.15}),b=s.injectMine({id:2,age:3.15});s.advance(.01);assert.equal(m.holeCapture.mine,a);assert.notEqual(m.holeCapture.mine,b);const before=s.state();for(let i=0;i<20;i++)s.step();assert.equal(s.state().kills,before.kills+1);assert.equal(s.state().energy,before.energy+20);assert.equal(s.monsters().length,0)});
check('a portal jump never creates a false swept hit through the intervening board',()=>{const {s,t}=fixture(),m=s.enemy(1,700,{eLinkPrevious:{x:100,y:s.center(t).y+100},eLinkPreviousProgress:100});s.setup([m],[t]);s.portals([{at:600,kind:'edge'}]);s.injectMine({age:3.15});s.advance(.05);assert(!m.holeCapture)});
check('selling cancels unexploded mines while an active vortex finishes independently',()=>{let {s,t}=fixture();s.injectMine({age:2});s.removeTower(t);assert.equal(s.mines().length,0);({s,t}=fixture());const m=s.enemy(1,400);s.setup([m],[t]);s.injectMine({age:3.15});s.advance(.1);s.removeTower(t);s.advance(.6);assert.equal(m.hp,0);assert.equal(s.mines()[0].tower,null)});
check('upgrading cannot change a deployed mine’s snapshotted duration or radius',()=>{const {s,t}=fixture(),mine=s.injectMine({age:1});const duration=mine.sp.duration,radius=mine.sp.radius;t.lv=5;assert.equal(mine.sp.duration,duration);assert.equal(mine.sp.radius,radius);assert(s.spec(t).duration>duration)});
check('real frames freeze mines, cooldowns and captures while paused and scale at 4x',()=>{const {s,t}=fixture(),m=s.enemy(1,400);s.setup([m],[t]);const mine=s.injectMine({age:3.15});t.cool=28;s.step();const age=mine.age,cool=t.cool,p=s.point(m);s.pause(true);for(let i=0;i<20;i++)s.step();assert.equal(mine.age,age);assert.equal(t.cool,cool);assert.deepEqual(s.point(m),p);s.pause(false);s.speed(4);s.step();assert(Math.abs(mine.age-age-.2)<1e-6)});
check('real-frame capture precedes escapes at the exit and preserves the core',()=>{const {s,t}=fixture(),m=s.enemy(1,999,{moveSpeed:10});s.setup([m],[t]);s.injectMine({x:999,progress:999,age:3.15});const before=s.state();s.step();assert(m.holeCapture);assert.equal(s.state().lives,before.lives);assert.equal(s.state().escaped,before.escaped)});
check('renderer calls do not change combat and reset removes mines and ownership',()=>{const {s,t}=fixture(),m=s.enemy(1,400);s.setup([m],[t]);s.injectMine({age:3.15});s.advance(.1);const before=JSON.stringify({mines:s.mines(),monsters:s.monsters()});s.drawTower(t);s.paintFields();s.paintCaptives();s.draw();assert.equal(JSON.stringify({mines:s.mines(),monsters:s.monsters()}),before);s.rebuild();assert.equal(s.mines().length,0);assert.equal(s.monsters().length,0)});
console.log(checks+' Hole checks passed');
