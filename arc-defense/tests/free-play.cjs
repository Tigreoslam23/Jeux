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
 loadFree:id=>{freeMapNumber=id;playMode='free';build();},loadStage:id=>{campaignStageNumber=id;playMode='campaign';build();},
 config:()=>freeMap(),liveText:()=>$('wave').textContent,launch:()=>{launchWave(true);waveIntroStart=revealSweepStart=0;last=1;},
 frame:()=>animate((last||1)+50),data:()=>({waveSpawned,waveTotal,waveNumber,lives,kills,energy,playing,paused,titanEncounter,freePathRevealed,fissionSpawned,boostPads,jumpPairs,way,mode:playMode}),
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
check('ten authored circuits have valid dense samples, real discontinuities and construction space',()=>{
 const s=game();const lengths=[];
 for(let id=1;id<=10;id++){s.loadFree(id);const a=s.data(),cfg=s.config();assert.equal(a.mode,'free');assert.equal(a.energy,cfg.budget);assert(s.free().length>=12,'construction cells '+id+': '+s.free().length);assert(a.way.length>300);assert(a.way.every(p=>Number.isFinite(p.dist)&&p.x>=0&&p.x<=1120&&p.y>=0&&p.y<=675));
  for(let i=1;i<a.way.length;i++){const p=a.way[i],q=a.way[i-1],d=p.dist-q.dist;assert(d>=0);if(d>.05)assert(Math.hypot(p.x-q.x,p.y-q.y)<=10)}
  for(const j of a.jumpPairs){assert(a.way.some(p=>Math.abs(p.dist-j.at)<1e-6));if(j.kind==='edge'){assert(Math.abs(j.from.x-j.to.x)<1e-6);assert(j.from.y<=8&&j.to.y>=667)}}
  assert.equal(a.boostPads.length,cfg.boosts,'advertised boosts '+id);assert(a.boostPads.every(p=>p.d>100&&p.d<a.way.at(-1).dist-100));lengths.push(Math.round(a.way.at(-1).dist));
 }
 assert.equal(new Set(lengths).size,10);
});
check('all technologies are open in Free Play without writing campaign unlocks',()=>{const s=game(),before=s.campaignSave();for(let id=1;id<=10;id++){s.loadFree(id);assert(s.available());assert.equal(s.campaignSave(),before)}});
check('each stream launches its full advertised count and never queues Titan',()=>{const s=game();for(let id=1;id<=10;id++){s.loadFree(id);s.launch();const a=s.data();assert.equal(a.waveTotal,s.config().count);assert.equal(a.titanEncounter,'idle');assert(a.playing)}});
check('identical regular convoys retain one type and constant movement speed',()=>{const s=game();for(let id=1;id<=4;id++){s.loadFree(id);s.launch();for(let i=0;i<100;i++)s.frame();const ms=s.monsters();assert(ms.length>=10);assert.equal(new Set(ms.map(m=>m.type)).size,1);assert.equal(new Set(ms.map(m=>m.moveSpeed)).size,1)}});
check('spawn accumulation emits the correct number at 1x and 4x without discarding debt',()=>{const s=game();for(const speed of [1,4]){s.loadFree(5);s.launch();s.setSpeed(speed);for(let i=0;i<100;i++)s.frame();assert.equal(s.data().waveSpawned,Math.floor(5*speed/s.config().gap+1e-7));assert(s.liveText().includes(s.data().waveSpawned+' / '+s.config().count))}});
check('regular streams preserve physical spawn spacing at 1x and 4x',()=>{const s=game();for(const speed of [1,4]){s.loadFree(2);s.launch();s.setSpeed(speed);for(let i=0;i<70;i++)s.frame();const ms=s.monsters(),a=ms.at(-2),b=ms.at(-1);assert(Math.abs(a.progress-b.progress-57*s.config().speed*s.config().gap)<1e-6)}});
check('pause freezes stream release and all monster progress',()=>{const s=game();s.loadFree(1);s.launch();for(let i=0;i<50;i++)s.frame();const before=s.data().waveSpawned,progress=s.monsters().map(m=>m.progress);s.setPaused(true);for(let i=0;i<50;i++)s.frame();assert.equal(s.data().waveSpawned,before);assert.deepEqual(s.monsters().map(m=>m.progress),progress)});
check('route reveal latches permanently and lights every turbo strip',()=>{const s=game();s.loadFree(1);s.launch();s.reveal();assert(s.data().freePathRevealed);assert(s.data().boostPads.every(p=>p.discovered));for(let i=0;i<50;i++)s.frame();assert(s.data().freePathRevealed);s.render();s.loadFree(2);assert(!s.data().freePathRevealed)});
check('the real loop completes every full stream once and saves only separate circuit records',()=>{const s=game(),campaign=s.campaignSave();for(let id=1;id<=10;id++){s.loadFree(id);s.launch();s.setSpeed(4);let frames=0;while(s.data().playing&&frames++<2500){s.killAll();s.frame()}assert(!s.data().playing,'finished '+id);const a=s.data();assert.equal(a.waveSpawned,s.config().count);assert.equal(a.kills,s.config().count+a.fissionSpawned);assert.equal(a.lives,20);assert.equal(a.titanEncounter,'idle');assert(s.best().won);assert.equal(s.campaignSave(),campaign)}});
check('campaign terrain introduces boost, edge warp and black holes progressively',()=>{const s=game();for(let n=1;n<=10;n++){s.loadStage(n);const a=s.data();assert.equal(a.mode,'campaign');assert.equal(a.boostPads.length,[0,0,1,2,2,3,3,4,4,5][n-1]);assert.equal(a.jumpPairs.some(j=>j.kind==='edge'),[5,8,10].includes(n));assert.equal(a.jumpPairs.some(j=>j.kind==='wormhole'),[7,9,10].includes(n));assert(s.free().length>=12)}});

check('new circuit effects render without changing combat and obey the shared simulation clock',()=>{const s=game();for(let id=6;id<=10;id++){s.loadFree(id);s.launch();s.reveal();for(let i=0;i<20;i++)s.frame();const before=JSON.stringify(s.data());s.fx();s.render();assert.equal(JSON.stringify(s.data()),before);s.setPaused(true);const pausedState=JSON.stringify(s.data());for(let i=0;i<10;i++)s.frame();assert.equal(JSON.stringify(s.data()),pausedState)}});
check('all ten menu launches validate their identifiers',()=>{const s=game();for(let id=1;id<=10;id++)assert(s.start(id));for(const id of [0,11,6.5,NaN])assert.equal(s.start(id),false)});
check('every new circuit contains substantial continuous turning and distinct geometry',()=>{const s=game();for(let id=6;id<=10;id++){s.loadFree(id);const way=s.path();let turning=0;for(let i=2;i<way.length;i++){const a=way[i-2],b=way[i-1],c=way[i];if(c.dist-b.dist<.05||b.dist-a.dist<.05)continue;const u=Math.atan2(b.y-a.y,b.x-a.x),v=Math.atan2(c.y-b.y,c.x-b.x);turning+=Math.abs(Math.atan2(Math.sin(v-u),Math.cos(v-u)))}assert(turning>Math.PI*4,'loop turns '+id+': '+turning)}});
console.log(checks+' Free Play checks passed');



