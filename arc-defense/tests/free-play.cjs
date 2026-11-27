// Runs the actual game loop without rendering. No browser or extra dependencies.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const start=source.indexOf("<script>(()=>{'use strict';")+8,end=source.indexOf("$('recommend').onclick=",start);
function game(search=''){
 const nodes=new Map(),saved=new Map();
 const gradient={addColorStop(){}},strokes=[];
 const g=new Proxy({stroke(){strokes.push(this.strokeStyle)},createLinearGradient:()=>gradient,createRadialGradient:()=>gradient},{get:(t,k)=>t[k]||(()=>{})});
 function node(){return {value:'',textContent:'',disabled:false,hidden:false,style:{},dataset:{},children:[],classList:{add(){},remove(){},toggle(){},contains(){return false}},getContext:()=>g,appendChild(){},append(){},replaceChildren(){},setAttribute(){},querySelector(){return node()},querySelectorAll(){return []},addEventListener(){},focus(){},click(){}}}
 const get=id=>{if(!nodes.has(id))nodes.set(id,node());return nodes.get(id)};
 for(const [id,value] of Object.entries({level:'2',seed:'20261104',speed:'4',analysisType:'precision',analysisLevel:'2'}))get(id).value=value;
 const c=vm.createContext({console,strokes,Math,Set,Map,Uint16Array,URLSearchParams,location:{search},localStorage:{getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v)},document:{getElementById:get,createElement:node,querySelector:()=>node(),body:node(),addEventListener(){}},performance:{now:()=>1},window:{__arcLabManual:true,arcAudio:{mode(){},pause(){},effect(){}},matchMedia:()=>({matches:false})},setTimeout:()=>0,clearTimeout(){},requestAnimationFrame(){},arcWaveLocked:()=>false,syncDock:()=>{},towerPrices:{precision:80,rapid:90,pierce:125,elink:200,area:180,freeze:135,boom:175,grapple:155,maw:220}});



 const exports=`
 function validDrop(x,y,type){const cell=snapConstruction(x,y);return (type!=='pusher'||pusherBuildAvailable())&&!arcWaveLocked()&&technologyAvailable(type)&&!!cell&&energy>=towerPrices[type]&&(type!=='elink'||(eLinkPending?validELinkEnd(eLinkPending,cell):hasELinkEnd(cell)))}
 function dropTower(x,y,type){if(arcWaveLocked()||!technologyFeedback(type)||!validDrop(x,y,type))return false;let cell=snapConstruction(x,y);if(type==='elink')return placeELinkCell(cell);let {x:gx,y:gy}=cell;let t={x:gx,y:gy,angle:0,cool:0,lv:1,type};if(type==='boom')t.boomAngle=fixedBoomAngle(t);towers.push(t);energy-=towerPrices[type];selected={x:gx,y:gy};selectedRangeSince=performance.now();placing=false;placementHover=null;boomHover=null;modeButtons();update();draw();return true}
 const realDraw=draw,realTunnel=underTunnel;draw=()=>{};
 globalThis.sim={
 loadFree:id=>{freeMapNumber=id;playMode='free';build();},loadStage:id=>{campaignStageNumber=id;playMode='campaign';build();},
 title:()=>$('endTitle').textContent,deathEffects:()=>particles.filter(p=>p.effect==='vfx91death'),config:()=>freeMap(),liveText:()=>$('wave').textContent,launch:(wave=1)=>{waveNumber=wave;launchWave(true);waveIntroStart=revealSweepStart=0;last=1;},
 frame:()=>animate((last||1)+50),data:()=>({waveSpawned,waveTotal,waveNumber,lives,kills,energy,playing,paused,titanEncounter,scoutActive,scoutProgress,scoutIntroProgress,fissionSpawned,boostPads,jumpPairs,way,mode:playMode}),
 killAll:()=>monsters.forEach(m=>m.hp=0),setPaused:v=>paused=v,setSpeed:v=>$('speed').value=String(v),
 reveal:(age=1000)=>{revealSweepStart=1;last=age-49;animate(age+1)},exploration:discoveredPercent,
 revealByMonsters:()=>traceVisits.fill(TRACE_REQUIRED),shots:()=>shots,best:()=>freeBest(freeMapNumber),campaignSave:()=>JSON.stringify(campaignProgress),
 fx:paintLoopCircuitEffects,start:startFreeMap,rows:()=>nodes.get('endSummary')?.children,render:()=>{draw=realDraw;try{draw()}finally{draw=()=>{}}},
 scenic:buildExoticRoute,featurePads:scenicBoostPads,

 reset:()=>{campaignStageNumber=6;unlockCampaignTechnologies(8);build();playing=true;waveNumber=1;paused=false;waveSpawned=0;waveTotal=999;waveDelay=99999;autoWaveCountdown=-1;waveIntroStart=revealSweepStart=0;},
 setup:(ms,ts)=>{monsters=ms;towers=ts;},
 tower:(lv=1,extra={})=>({x:4,y:4,type:'maw',lv,cool:0,angle:0,...extra}),
 enemy:(id,progress=500,extra={})=>({id,progress,type:2,spin:0,hp:100,maxHp:100,moveSpeed:1,spinSpeed:1,reward:20,armor:6,plates:Array(6).fill(true),...extra}),
 route:points=>{way=[];let d=0;for(let i=0;i<points.length;i++){if(i===0){way.push({...points[i],dist:0});continue}const a=points[i-1],b=points[i],n=Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/20),length=Math.hypot(b.x-a.x,b.y-a.y);for(let k=1;k<=n;k++)way.push({x:a.x+(b.x-a.x)*k/n,y:a.y+(b.y-a.y)*k/n,dist:d+length*k/n});d+=length}jumpPairs=[];underTunnel=()=>false;},
 setRawRoute:points=>{way=points;},portals:p=>jumpPairs=p,
 capture:beginMawCapture,prepare:prepareMaw,advance:advanceMaw,cancel:cancelMawForTower,can:canMawCapture,
 monsters:()=>monsters,towers:()=>towers,path:()=>way,point:monsterPosition,center:ctr,spec:towerSpec,
 protected:isMagnetProtected,hit:(m)=>applyGeometricHit({m,kind:'heart',x:0,y:0},100),magnet:canMagnetCapture,grapple:canGrapple,push:canPusherTarget,
 blocked:fn=>underTunnel=fn||realTunnel,
 step:()=>animate((last||1)+50),pause:v=>paused=v,speed:v=>$('speed').value=String(v),
 state:()=>({playing,paused,energy,kills,lives,escaped}),status:mawStatus,
 draw:()=>{draw=realDraw;try{draw()}finally{draw=()=>{}}},drawTower:paintMaw,drawTransfers:paintMawCaptives,
 energy:v=>energy=v,budget:()=>energy,available:()=>technologyAvailable('maw'),tech:()=>campaignProgress.unlocked,
 drop:dropTower,free:()=>{const cells=[];for(let y=GRID_MIN;y<=GRID_MAX_Y;y++)for(let x=GRID_MIN;x<=GRID_MAX_X;x++)if(freeConstructionCell(x,y))cells.push({x,y});return cells},
 upgrade:t=>{const p=campaignUpgradeCost(t);if(energy<p)return false;energy-=p;t.lv++;return true},
 elinks:advanceELinks,geometry:geometricHits,boomerang:launchBoomSalve,rebuild:build,
 escapes:resolveEscapes,
 routeLink:()=>routeLink.links[0],linkCycle:()=>routeLink,linkOpening:routeLinkOpening,pathPoint:posAt,clock:()=>terrainClock,
 setClock:t=>{terrainClock=t},directDamage:damageEnemy,
 suppressSpawns:()=>{waveDelay=99999},
 paintLink:()=>{strokes.length=0;paintRouteLink();return strokes.slice()},
 composition:waveComposition,waveSpecs:campaignWaveSpecs,freeEnemy:createFreeEnemy,stageEnemy:createStageOneEnemy,
 routeClearance:(c)=>Math.min(...way.map((p,i)=>segmentClosest(i&&p.dist-way[i-1].dist>=.05?way[i-1]:p,p,c,c).dist)),
 snap:snapConstruction,validEnd:validELinkEnd,occupied:(x,y)=>occupied.has(key(x,y))
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
check('the fast Scout preview leaves exploration for the slow Scout and the stream',()=>{
 const s=game();s.loadFree(1);s.setSpeed(1);s.launch();
 s.reveal(1500);
 assert.equal(s.data().scoutIntroProgress,s.path().at(-1).dist);
 assert.equal(s.exploration(),0);
 assert(s.data().boostPads.every(p=>!p.discovered));
 s.reveal(1700);assert.equal(s.data().scoutIntroProgress,0);
 for(let i=0;i<20;i++)s.frame();
 assert(Math.abs(s.data().scoutProgress-57*.35)<1e-6);
 assert(s.exploration()>0&&s.exploration()<10);
 assert(!s.monsters().some(m=>m.scout));
 const before=s.data().scoutProgress;
 s.setPaused(true);s.frame();assert.equal(s.data().scoutProgress,before);
 s.setPaused(false);s.revealByMonsters();s.frame();
 assert.equal(s.exploration(),100);
 assert(!s.data().scoutActive);
 assert.equal(s.deathEffects().filter(p=>p.color==='#78fff1').length,1);
 s.frame();assert.equal(s.deathEffects().filter(p=>p.color==='#78fff1').length,1);
 s.render();s.loadFree(2);assert.equal(s.exploration(),0);
});
check('all three projectile towers aim along the real line to a grappled target',()=>{
 for(const type of ['precision','rapid','pierce']){
  const s=game();s.loadFree(1);s.launch();s.setSpeed(1);
  s.route([{x:0,y:300},{x:5000,y:300}]);
  const tower=s.tower(1,{x:4,y:4,type});
  const grapple=s.tower(1,{x:4,y:3,type:'grapple'});
  const m=s.enemy(1,260,{grapple:{tower:grapple,progress:260,age:.5,travel:.1,hold:3,returnTime:.5}});
  s.setup([m],[tower]);s.frame();
  const hit=s.shots()[0],center=s.center(tower),target=s.point(m);
  assert(hit,type);
  const angle=Math.atan2(target.y-center.y,target.x-center.x);
  assert(Math.abs(Math.atan2(hit.vy,hit.vx)-angle)<1e-8,type);
  assert(Math.abs(target.y-300)>10);
 }
});
check('level 3 Magnetar binds and strips four armored monsters in the real wave loop',()=>{
 const s=game();s.loadFree(1);s.launch();s.setSpeed(1);
 s.route([{x:0,y:330},{x:5000,y:330}]);
 const tower=s.tower(3,{type:'area'});
 const targets=Array.from({length:5},(_,i)=>s.enemy(i+1,300+i*15));
 s.setup(targets.slice(),[tower]);
 s.frame();
 const captured=targets.filter(m=>m.magnetId);
 assert.equal(captured.length,4);
 for(let frame=0;frame<19;frame++)s.frame();
 assert(captured.every(m=>m.armor===0&&m.hp===100&&!m.magnetId));
 assert.equal(targets.filter(m=>m.armor===6).length,1);
 assert.equal(tower.cool,2);
});
check('the real loop completes every full stream once and saves only separate circuit records',()=>{const s=game(),campaign=s.campaignSave();for(let id=1;id<=10;id++){s.loadFree(id);s.launch();s.setSpeed(4);let frames=0;while(s.data().playing&&frames++<2500){s.killAll();s.frame()}assert(!s.data().playing,'finished '+id);const a=s.data();assert.equal(a.waveSpawned,s.config().count);assert.equal(a.kills,s.config().count+a.fissionSpawned);assert.equal(a.lives,20);assert.equal(a.titanEncounter,'idle');assert(s.best().won);assert.equal(s.campaignSave(),campaign)}});
check('campaign terrain introduces boost, edge warp and black holes progressively',()=>{const s=game();for(let n=1;n<=10;n++){s.loadStage(n);const a=s.data();assert.equal(a.mode,'campaign');assert.equal(a.boostPads.length,[0,0,1,2,2,3,3,4,4,5][n-1]);assert.equal(a.jumpPairs.some(j=>j.kind==='edge'),[5,8,10].includes(n));assert.equal(a.jumpPairs.some(j=>j.kind==='wormhole'),[7,9,10].includes(n));assert(s.free().length>=12)}});

check('new circuit effects render without changing combat and obey the shared simulation clock',()=>{const s=game();for(let id=6;id<=10;id++){s.loadFree(id);s.launch();s.reveal();for(let i=0;i<20;i++)s.frame();const before=JSON.stringify(s.data());s.fx();s.render();assert.equal(JSON.stringify(s.data()),before);s.setPaused(true);const pausedState=JSON.stringify(s.data());for(let i=0;i<10;i++)s.frame();assert.equal(JSON.stringify(s.data()),pausedState)}});
check('all ten menu launches validate their identifiers',()=>{const s=game();for(let id=1;id<=10;id++)assert(s.start(id));for(const id of [0,11,6.5,NaN])assert.equal(s.start(id),false)});
check('every new circuit contains substantial continuous turning and distinct geometry',()=>{const s=game();for(let id=6;id<=10;id++){s.loadFree(id);const way=s.path();let turning=0;for(let i=2;i<way.length;i++){const a=way[i-2],b=way[i-1],c=way[i];if(c.dist-b.dist<.05||b.dist-a.dist<.05)continue;const u=Math.atan2(b.y-a.y,b.x-a.x),v=Math.atan2(c.y-b.y,c.x-b.x);turning+=Math.abs(Math.atan2(Math.sin(v-u),Math.cos(v-u)))}assert(turning>Math.PI*4,'loop turns '+id+': '+turning)}});
check('a former Trion trial link opens the regular game mode',()=>{
 const campaign=game('?trion-armor=arcs');campaign.rebuild();
 assert.equal(campaign.data().mode,'campaign');
 assert.equal(campaign.data().energy,340);
 const challenge=game('?trion-armor=arcs&mode=challenge');challenge.rebuild();
 assert.equal(challenge.data().mode,'challenge');
});
check('every campaign and Free Play circuit has a red shortcut toward the core within a continuous path section',()=>{
 const s=game();
 for(const load of [s.loadStage,s.loadFree]){
  for(let id=1;id<=10;id++){
   load(id);const link=s.routeLink(),data=s.data();
   assert(link,'missing Link on '+data.mode+' '+id);
   assert(link.entry<link.exit);
   assert(data.jumpPairs.every(p=>p.at<link.entry||p.at>link.exit));
   assert.deepEqual(link.a,s.pathPoint(link.entry));
   assert.deepEqual(link.b,s.pathPoint(link.exit));
   assert(link.length>Math.hypot(link.b.x-link.a.x,link.b.y-link.a.y));
  }
 }
 for(const search of ['?mode=challenge','?trion-armor=arcs']){
  const variant=game(search);variant.rebuild();assert(variant.routeLink(),search);
 }
});
check('five monsters take the red arc at 150% speed and ignore the whole tower arsenal',()=>{
 const s=game();s.loadFree(1);s.setSpeed(1);s.launch();s.suppressSpawns();
 const link=s.routeLink();
 const targets=Array.from({length:6},(_,i)=>s.enemy(i+1,link.entry-1));
 s.setup(targets,[]);
 s.frame();
 assert.equal(s.linkCycle().used,5);
 assert(Math.abs(s.linkCycle().firstOpenedAt-1/57)<1e-8);
 assert(targets.slice(0,5).every(m=>m.routeLinkTransit&&s.protected(m)));
 assert(!targets[5].routeLinkTransit&&targets[5].progress>link.entry);
 const m=targets[0],d=m.routeLinkTransit.distance;
 const towerTypes=['precision','rapid','pierce','area','freeze','boom','grapple','maw','pusher','elink'];
 const towers=towerTypes.map(type=>s.tower(5,{type,end:{x:7,y:4}}));
 s.setup([m],towers);
 s.frame();
 assert(Math.abs(m.routeLinkTransit.distance-d-57*1.5*.05)<1e-8);
 assert.equal(s.directDamage(m,100,'elink'),0);
 assert.equal(s.hit(m),false);
 assert.equal(s.geometry(link.a,link.b,m,s.point(m)).length,0);
 assert(!s.can(m)&&!s.grapple(m)&&!s.magnet(m)&&!s.push(m));
 assert.equal(m.hp,100);
 assert.equal(m.armor,6);
 assert(!m.frozen);
 assert.equal(s.shots().length,0);
 s.render();
 const before=m.routeLinkTransit.distance;
 s.setPaused(true);s.frame();
 assert.equal(m.routeLinkTransit.distance,before);
 s.setPaused(false);
});
check('Link closes after five seconds, lets travelers finish and resets its capacity after forty seconds',()=>{
 const s=game();s.loadFree(1);s.setSpeed(1);s.launch();s.suppressSpawns();
 const link=s.routeLink(),m=s.enemy(1,link.entry-1);
 s.setup([m],[]);s.frame();
 const first=s.linkCycle().firstOpenedAt;
 assert.equal(s.linkOpening(first+4.99),0);
 assert.equal(s.linkOpening(first+5),-1);
 assert.equal(s.linkOpening(first+44.99),-1);
 assert.equal(s.linkOpening(first+45),1);
 s.setClock(first+4.96);
 const late=s.enemy(2,link.entry-1);s.setup([late],[]);s.frame();
 assert(late.routeLinkTransit&&s.linkOpening(s.clock())===-1);
 const closed=s.enemy(3,link.entry-1);s.setup([late,closed],[]);s.frame();
 assert(!closed.routeLinkTransit&&closed.progress>link.entry);
 assert.equal(late.progress,link.entry);
 for(let i=0;i<100&&late.routeLinkTransit;i++)s.frame();
 assert(!late.routeLinkTransit&&!s.protected(late));
 assert(late.progress>=link.exit&&late.progress<=link.exit+57*.05);
 const landedProgress=late.progress;
 assert.equal(late.eLinkPreviousProgress,link.exit);
 s.frame();assert(late.progress>landedProgress);
 assert.equal(s.directDamage(late,1),1);
 late.progress=link.entry-1;
 s.setClock(first+45);
 const next=s.enemy(4,link.entry-1);s.setup([late,next],[]);s.frame();
 assert(late.progress>link.entry&&!late.routeLinkTransit);
 assert(next.routeLinkTransit);assert.equal(s.linkCycle().used,1);
 s.rebuild();assert.equal(s.linkCycle().firstOpenedAt,null);
});
check('Stage 02 connects the first two portrait lanes and only displays the red arc for three seconds',()=>{
 const s=game();s.loadStage(2);s.setSpeed(1);s.launch();s.suppressSpawns();
 const link=s.routeLink();
 assert.equal(link.a.y,100);
 assert.equal(link.b.y,245);
 assert(Math.abs(link.b.x-link.a.x)<9);
 assert(link.exit-link.entry>4*link.length);
 assert.equal(s.linkCycle().openDuration,3);
 assert.equal(s.paintLink().length,0);
 const group=Array.from({length:6},(_,i)=>s.enemy(i+1,link.entry-1));
 s.setup(group,[]);s.frame();
 assert.equal(group.filter(m=>m.routeLinkTransit).length,5);
 assert(s.paintLink().includes('#aa4657'));
 const first=s.linkCycle().firstOpenedAt;
 assert.equal(s.linkOpening(first+2.99),0);
 assert.equal(s.linkOpening(first+3.01),-1);
 assert.equal(s.linkOpening(first+42.99),-1);
 assert.equal(s.linkOpening(first+43.01),1);
 s.setClock(first+3.01);
 assert.equal(s.paintLink().length,0);
 assert(group.slice(0,5).every(m=>m.routeLinkTransit&&s.protected(m)));
 s.setClock(first+43.01);
 assert(s.paintLink().includes('#ff5268'));
 s.loadStage(1);assert.equal(s.linkCycle().openDuration,5);
});
check('Stage 09 and Free Play 04 separate every black-hole mouth by at least two halo radii',()=>{
 const s=game();
 for(const [load,id,expected] of [[s.loadStage,9,2],[s.loadFree,4,3]]){
  load(id);
  const wormholes=s.data().jumpPairs.filter(p=>p.kind==='wormhole');
  assert.equal(wormholes.length,expected);
  const mouths=wormholes.flatMap(({from,to})=>[from,to]);
  for(const [i,a] of mouths.entries()){
   for(const b of mouths.slice(i+1))assert(Math.hypot(a.x-b.x,a.y-b.y)>=130);
  }
  s.render();
 }
});
check('First Contact introduces one arc before alternating two shortcuts on stages 03–05',()=>{
 const s=game();
 for(const [id,count,duration] of [[1,1,5],[2,1,3],[3,2,4],[4,2,4],[5,2,3],[6,1,5]]){
  s.loadStage(id);const cycle=s.linkCycle();
  assert.equal(cycle.links.length,count,'stage '+id);
  assert.equal(cycle.openDuration,duration);
  for(const link of cycle.links){
   assert(link.entry<link.exit&&link.exit<s.path().at(-1).dist);
   assert(s.data().jumpPairs.every(p=>p.at<link.entry||p.at>link.exit));
   if(id>=2&&id<=5)assert(link.exit-link.entry>link.length);
   assert(s.data().boostPads.every(p=>Math.abs(p.d-link.entry)>30&&Math.abs(p.d-link.exit)>30));
  }
 }
 s.loadStage(5);
 const [before,after]=s.linkCycle().links,warp=s.data().jumpPairs[0];
 assert(before.exit<warp.at&&warp.at<after.entry);
});
check('the next opening moves to the other arc and leaves earlier travelers on their original route',()=>{
 const s=game();s.loadStage(4);s.setSpeed(1);s.launch();s.suppressSpawns();
 const cycle=s.linkCycle(),[first,second]=cycle.links;
 const traveler=s.enemy(1,first.entry-1);
 const premature=s.enemy(2,second.entry-1);
 s.setup([traveler,premature],[]);s.frame();
 assert.equal(traveler.routeLinkTransit.link,first);
 assert(!premature.routeLinkTransit&&premature.progress>second.entry);
 const t=cycle.firstOpenedAt,period=cycle.openDuration+40;
 s.setClock(t+period+.01);
 const group=Array.from({length:6},(_,i)=>s.enemy(i+3,second.entry-1));
 const originalAnchor=s.enemy(9,first.entry-1);
 s.setup([traveler,originalAnchor,...group],[]);s.frame();
 assert(!originalAnchor.routeLinkTransit&&originalAnchor.progress>first.entry);
 assert(group.slice(0,5).every(m=>m.routeLinkTransit?.link===second&&s.protected(m)));
 assert(!group[5].routeLinkTransit);
 assert.equal(traveler.routeLinkTransit.link,first);
 s.setup([traveler],[]);
 for(let i=0;i<120&&traveler.routeLinkTransit;i++)s.frame();
 assert(!traveler.routeLinkTransit);
 assert(traveler.progress>=first.exit&&traveler.progress<first.exit+5);
 const repeat=s.enemy(10,first.entry-1);
 s.setClock(t+period*2+.01);s.setup([repeat],[]);s.frame();
 assert.equal(repeat.routeLinkTransit.link,first);
});
check('all twenty boards allow safe construction along both portrait sides and at the top and bottom',()=>{
 const s=game();
 for(const load of [s.loadStage,s.loadFree]){
  for(let id=1;id<=10;id++){
   load(id);
   const cells=s.free();
   for(const edge of [c=>c.y===-1,c=>c.y===9,c=>c.x===-1,c=>c.x===16]){
    const row=cells.filter(edge);
    assert(row.length>=4,'too little border space on '+s.data().mode+' '+id);
    for(const cell of row){
     const center=s.center(cell);
     assert(s.routeClearance(center)>=57*.61-1e-7);
     assert.deepEqual(s.snap(center.x,center.y),cell);
    }
   }
   const candidates=cells.filter(c=>c.y===-1);
   const a=candidates.find(a=>candidates.some(b=>s.validEnd(a,b)));
   assert(a);
   const {x,y}=s.center(a);assert(s.drop(x,y,'precision'));
   assert(!s.free().some(c=>c.x===a.x&&c.y===a.y));
  }
 }
 s.loadFree(1);
 const side=s.free().filter(c=>c.y===9);
 const a=side.find(a=>side.some(b=>s.validEnd(a,b)));
 const b=side.find(b=>s.validEnd(a,b));
 for(const cell of [a,b]){
  const {x,y}=s.center(cell);
  assert(s.drop(x,y,'elink'));
 }
 assert.equal(s.towers().length,1);
 assert.equal(s.towers()[0].y,9);
 assert.equal(s.towers()[0].end.y,9);
});
check('each campaign stage has a double-strength surge and monsters hatch fully armored in every mode',()=>{
 const s=game(),surges=[[7,52],[9,56],[10,88],[11,92],[10,92],[10,88],[13,106],[10,94],[14,100],[10,94]];
 const full=m=>{assert.equal(m.armor,[4,3,6][m.type]);assert.equal(m.plates.length,m.armor);assert(m.plates.every(Boolean))};
 for(const [stage,[wave,count]] of surges.entries()){
  s.loadStage(stage+1);
  const waves=s.waveSpecs(),spec=waves[wave-1];
  assert(spec.surge&&waves.filter(w=>w.surge).length===1);
  assert.equal(s.composition(wave).total,count);
  for(let i=0;i<count;i++)full(s.stageEnemy(wave,i));
  full(s.stageEnemy(1,0));
 }
 for(let id=1;id<=10;id++){
  s.loadFree(id);
  for(let i=0;i<s.config().count;i+=19)full(s.freeEnemy(i));
 }
 const c=game('?mode=challenge');c.rebuild();c.launch(10);
 assert.equal(c.data().waveTotal,52);
 for(let i=0;i<40;i++)c.frame();
 assert(c.monsters().length>0);c.monsters().forEach(full);
});
console.log(checks+' Free Play checks passed');



