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
 families:()=>ENEMY_FAMILIES,setFamily:setEnemyFamily,familySpeed,damage:damageEnemy,regen:advanceEnemyFamily,children:fissionChildren,colors:colorPlan,freeEnemy:createFreeEnemy,stageEnemy:createStageOneEnemy,sequence:stageOneSequence,
 advanceBoostMovement,boostPhase,boostKind,activateBoost,decoratePads:decorateBoostPads,paintPads:paintBoostPads,paintFamily:paintEnemyFamily,guide:evolutionGuideHTML,
 completeArrivals:()=>{waveSpawned=waveTotal=freeMap().count;},
 clock:(v)=>v===undefined?terrainClock:(terrainClock=v),pads:(v)=>v===undefined?boostPads:(boostPads=v),fissionCount:()=>fissionSpawned,
 recoilPoint:pusherDestination,partGeometry:enemyGeometry,freezeResistance,
 
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
const close=(a,b)=>assert(Math.abs(a-b)<1e-7,`${a} != ${b}`);
function fixture(){const s=game();s.reset();s.speed(1);s.route([{x:0,y:300},{x:5000,y:300}]);s.setup([],[]);s.step();return s}
check('seven abilities can decorate every shape without changing its category',()=>{const s=fixture();for(const color of ['white','blue','orange','green','red','yellow','violet'])for(let type=0;type<3;type++){const m=s.enemy(1,100,{type});s.setFamily(m,color);assert.equal(m.type,type);assert.equal(m.family,color);const hp=m.hp;s.setFamily(m,color);assert.equal(m.hp,hp)}});
check('White is fragile and fast; Orange is tougher, slower and resists recoil',()=>{const s=fixture(),white=s.setFamily(s.enemy(1),'white'),heavy=s.setFamily(s.enemy(2),'orange');close(white.hp,78);close(white.moveSpeed,1.2);close(heavy.hp,130);close(heavy.moveSpeed,.88);const ordinary=s.enemy(3,500);const sp={push:4};close(500-s.recoilPoint(heavy,sp),57*.88*4*.55);close(500-s.recoilPoint(ordinary,sp),57*4)});
check('Blue takes 40 percent less E-Link damage while other hits retain full power',()=>{const s=fixture(),m=s.setFamily(s.enemy(1),'blue');close(s.damage(m,10,'elink'),6);close(m.hp,94);close(s.damage(m,10,'precision'),10);close(m.hp,84);m.damageQuiet=2;s.hit(m);assert.equal(m.damageQuiet,0)});
check('real E-Link contact uses blue resistance and remains lethal',()=>{const s=fixture(),m=s.setFamily(s.enemy(1,100),'blue'),t={x:0,y:4,end:{x:4,y:4},type:'elink',lv:1};s.route([{x:150,y:330.5},{x:2000,y:330.5}]);m.progress=0;s.setup([m],[t]);s.elinks(1);close(m.hp,100-2.4*.6);m.hp=.1;s.elinks(1);assert(m.hp<=0)});
check('Green heals only after three damage-free seconds, caps HP and never restores armor',()=>{const s=fixture(),m=s.setFamily(s.enemy(1,100),'green');m.hp=50;m.plates[0]=false;s.regen(m,3);close(m.hp,50);s.regen(m,2);close(m.hp,55);s.damage(m,1);s.regen(m,3);close(m.hp,54);s.regen(m,100);close(m.hp,100);assert(!m.plates[0]);m.hp=0;s.regen(m,100);assert.equal(m.hp,0)});
check('captures and tunnels cannot be used to regenerate invulnerably',()=>{const s=fixture(),m=s.setFamily(s.enemy(1),'green');m.hp=50;m.damageQuiet=10;m.magnetId=1;s.regen(m,2);assert.equal(m.hp,50);delete m.magnetId;m.holeCapture={};s.regen(m,2);assert.equal(m.hp,50);delete m.holeCapture;s.blocked(()=>true);s.regen(m,2);assert.equal(m.hp,50)});
check('Red fury is health-dependent and affects actual forward movement only',()=>{const s=fixture(),m=s.setFamily(s.enemy(1,100),'red');assert.equal(s.familySpeed(m),1);m.hp=49;assert.equal(s.familySpeed(m),1.3);s.setup([m],[]);s.step();assert(m.progress>103);m.grapple={tower:{x:0,y:0},age:0,travel:1,hold:1,returnTime:1};const p=m.progress;s.step();assert.equal(m.progress,p)});
check('Yellow extends every boost by 60 percent without increasing its multiplier',()=>{const s=fixture();for(const kind of ['yellow','orange','red','hyperPulse']){const m=s.setFamily(s.enemy(1),'yellow'),pad={kind,d:100};assert(s.activateBoost(m,pad,1));close(m.boostLeft,s.boostKind(pad).duration*1.6);assert.equal(m.boostMult,s.boostKind(pad).mult)}});
check('Orange pulses switch exactly at 10-second boundaries and support opposite phases',()=>{const s=fixture(),p={kind:'orange'};for(const [t,active] of [[0,true],[9.999,true],[10,false],[19.999,false],[20,true],[30,false]])assert.equal(s.boostPhase(p,t).active,active);assert.equal(s.boostPhase({kind:'orange',offset:10},0).active,false);assert(s.boostPhase({kind:'orange',offset:10},10).active);const m=s.enemy(1);assert(!s.activateBoost(m,p,10));assert(!m.boostLeft)});
check('hyperboost is 50 percent stronger and shorter than the classic boost',()=>{const s=fixture(),a=s.boostKind({kind:'yellow'}),b=s.boostKind({kind:'red'});close(b.mult/a.mult,1.5);assert(b.duration<a.duration);assert(s.boostPhase({kind:'red'},15).active);assert(!s.boostPhase({kind:'hyperPulse'},15).active)});
check('real crossing of a dark pad does not boost; an active hyper pad boosts normally',()=>{const s=fixture(),m=s.enemy(1,95);s.setup([m],[]);s.pads([{id:0,d:96,kind:'orange',offset:0}]);s.clock(10);s.step();assert(!m.boostLeft);m.progress=95;s.pads([{id:0,d:96,kind:'red'}]);s.step();assert(m.boostLeft>0);close(m.boostMult,3.75);assert(s.pads()[0].discovered)});
check('pulse clocks preserve phase between waves and freeze on pause at all speeds',()=>{const s=fixture();s.clock(9);s.speed(4);s.step();close(s.clock(),9.2);s.pause(true);for(let i=0;i<20;i++)s.step();close(s.clock(),9.2);s.pause(false);s.speed(1);s.step();close(s.clock(),9.25);s.rebuild();assert.equal(s.clock(),0)});
check('Violet creates two fragile same-shape offspring with no armor, energy or second division',()=>{const s=fixture();for(let type=0;type<3;type++){const m=s.setFamily(s.enemy(1,100,{type}),'violet');m.hp=0;const kids=s.children(m);assert.equal(kids.length,2);for(const k of kids){assert.equal(k.type,type);assert.equal(k.family,'violet');assert(k.visualScale<1);assert(k.hp<m.maxHp/4);assert.equal(k.armor,0);assert.equal(k.reward,0);assert(k.progress<=m.progress);k.hp=0;assert.equal(s.children(k).length,0)}assert.equal(s.children(m).length,0)}});
check('fission never places offspring across a warp or resurrects consumed/escaped units',()=>{const s=fixture();s.portals([{at:99,kind:'edge'}]);const m=s.setFamily(s.enemy(1,100),'violet');m.hp=0;assert(s.children(m).every(k=>k.progress>99));for(const extra of [{holeConsumed:true},{escaped:true}]){const v=s.setFamily(s.enemy(2,100,extra),'violet');v.hp=0;assert.equal(s.children(v).length,0)}});
check('the real death loop awards one parent reward, waits for offspring and counts each kill once',()=>{const s=fixture(),m=s.setFamily(s.enemy(1,100),'violet');s.setup([m],[]);const before=s.state();m.hp=0;s.step();assert.equal(s.monsters().length,2);assert.equal(s.fissionCount(),2);assert.equal(s.state().kills,before.kills+1);assert.equal(s.state().energy,before.energy+20);s.killAll();s.step();assert.equal(s.monsters().length,0);assert.equal(s.state().kills,before.kills+3);assert.equal(s.state().energy,before.energy+20);s.step();assert.equal(s.state().kills,before.kills+3)});
check('bosses and established elite anchors keep their original profile and no color ability',()=>{const s=fixture();for(const extra of [{boss:true},{miniBoss:true},{trait:'bulwark'}]){const m=s.enemy(1,100,extra);s.setFamily(m,'orange');assert(!m.family);assert.equal(m.hp,100);assert.equal(m.moveSpeed,1)}});
check('campaigns introduce one family at a time; free circuits include uniform and mixed convoys',()=>{const s=fixture(),first={};for(let n=1;n<=10;n++){s.loadStage(n);for(let w=1;w<=16;w++)for(const c of s.colors(n,w))if(!first[c])first[c]=n}assert.equal(first.white,1);assert.equal(first.blue,2);assert.equal(first.orange,2);assert.equal(first.green,3);assert.equal(first.red,4);assert.equal(first.yellow,5);assert.equal(first.violet,6);s.loadFree(2);assert.equal(new Set(Array.from({length:40},(_,i)=>s.freeEnemy(i).family)).size,1);s.loadFree(10);assert.equal(new Set(Array.from({length:112},(_,i)=>s.freeEnemy(i).family)).size,7)});
check('campaign pad variants and advanced alternating hyper pulses follow the stage progression',()=>{const s=fixture();const expected={3:['yellow'],4:['yellow','orange'],5:['yellow','red'],6:['yellow','orange','red'],8:['yellow','orange','red','hyperPulse']};for(const [n,kinds] of Object.entries(expected)){s.loadStage(+n);assert.equal(s.pads().map(p=>p.kind).join(),kinds.join())}s.loadFree(8);assert(s.pads().some(p=>p.kind==='hyperPulse'));assert(s.pads().some(p=>p.offset===10))});
check('family and boost rendering is read-only and the guide explains all seven abilities',()=>{const s=fixture(),m=s.setFamily(s.enemy(1),'green');s.setup([m],[]);s.pads([{id:0,d:200,kind:'orange',discovered:true}]);const before=JSON.stringify({m,p:s.pads(),clock:s.clock()});s.paintFamily(m);s.paintPads();s.render();assert.equal(JSON.stringify({m,p:s.pads(),clock:s.clock()}),before);for(const key of Object.keys(s.families()).filter(k=>k!=='neutral'))assert(s.guide().includes(s.families()[key].name));assert(s.guide().includes('10 s ON / 10 s OFF'))});
const progress=require('../progress.js');
check('old backups and valid fission records round-trip while impossible offspring counts are rejected',()=>{const old={won:true,kills:100,count:100,lives:20},newer={...old,kills:160,offspring:60};assert(progress.valid('arc_free_v1_1',old));assert(progress.valid('arc_free_v1_1',newer));assert(!progress.valid('arc_free_v1_1',{...newer,offspring:201}));assert(!progress.valid('arc_free_v1_1',{...newer,kills:161}));const text=JSON.stringify({app:'arc-defense',schema:1,data:{arc_free_v1_1:newer}});assert.deepEqual(progress.parse(text).arc_free_v1_1,newer)});
check('boost crossings and expiry give matching distances for 1x and 4x frame sizes',()=>{const run=step=>{const s=fixture(),m=s.enemy(1,0);s.pads([{d:20,kind:'yellow'},{d:100,kind:'orange'},{d:300,kind:'red'},{d:600,kind:'hyperPulse',offset:10}]);for(let i=0;i<Math.round(4/step);i++){s.clock(8+(i+1)*step);s.advanceBoostMovement(m,step,step,100)}return m};const a=run(.05),b=run(.2);close(a.progress,b.progress);close(a.boostLeft,b.boostLeft)});
check('a pulse crossing samples its exact crossing time, not the end of a 4x frame',()=>{const s=fixture(),m=s.enemy(1,95);s.pads([{d:100,kind:'orange'}]);s.clock(10.1);s.advanceBoostMovement(m,.2,.2,100);assert(m.boostLeft>0);assert(m.progress>115);const n=s.enemy(2,80);s.advanceBoostMovement(n,.2,.2,100);assert(!n.boostLeft)});
check('Hole consumes Violet without releasing fission offspring in the actual combat loop',()=>{const s=fixture(),t=s.tower(),m=s.setFamily(s.enemy(1,400),'violet');s.setup([m],[t]);s.injectMine({age:3.15});for(let i=0;i<20;i++)s.step();assert(m.holeConsumed);assert.equal(s.fissionCount(),0);assert.equal(s.monsters().length,0);assert.equal(s.state().kills,1)});
check('a stream cannot finish until its fission offspring are removed and its record retains them',()=>{const s=game();s.loadFree(7);s.launch();s.speed(1);s.completeArrivals();const m=s.setFamily(s.enemy(1,100),'violet');s.setup([m],[]);m.hp=0;s.frame();assert(s.data().playing);assert.equal(s.monsters().length,2);s.killAll();s.frame();assert(!s.data().playing);assert.equal(s.best().offspring,2);assert(progress.valid('arc_free_v1_7',s.best()))});
console.log(checks+' chromatic families and boost checks passed');
