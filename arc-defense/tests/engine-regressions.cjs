// Run with: node arc-defense/tests/engine-regressions.cjs
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const source=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');

function extract(name){
 const start=source.indexOf('function '+name+'(');assert(start>=0,name+' exists');
 const open=source.indexOf('{',start);let depth=0,quote=null,line=false,block=false;
 for(let i=open;i<source.length;i++){
  const c=source[i],next=source[i+1];
  if(line){if(c==='\n')line=false;continue}
  if(block){if(c==='*'&&next==='/'){block=false;i++}continue}
  if(quote){if(c==='\\'){i++;continue}if(c===quote)quote=null;continue}
  if(c==='/'&&next==='/'){line=true;i++;continue}
  if(c==='/'&&next==='*'){block=true;i++;continue}
  if(c==='"'||c==="'"||c==='`'){quote=c;continue}
  if(c==='{')depth++;
  if(c==='}'&&--depth===0)return source.slice(start,i+1);
 }
 throw Error('Unclosed function '+name);
}
function context(){
 const ctx=vm.createContext({C:1,monsters:[],boomShots:[],particles:[],way:[{dist:100}],lives:20,escaped:0,updates:0,hits:[],window:{arcAudio:{effect(){}}}});
 ctx.update=()=>ctx.updates++;ctx.isStageCampaign=()=>false;
 ctx.monsterPosition=m=>({x:m.x,y:m.y,hidden:m.hidden});
 ctx.posAt=p=>({x:p,y:0});ctx.ctr=t=>({x:t.x,y:t.y});ctx.underTunnel=p=>!!p.hidden;
 ctx.enemyGeometry=()=>[];
 ctx.applyGeometricHit=(hit,damage)=>{ctx.hits.push({id:hit.m.id,damage});hit.m.hp-=damage;return true};
 for(const name of ['isMagnetProtected','segmentClosest','geometricHits','sortTargets','boomPoint','boomSegments','launchBoomSalve','advanceBoomerangs','resolveEscapes'])vm.runInContext(extract(name),ctx);
 return ctx;
}
function enemy(id,x,progress=0){return {id,x,y:0,hp:100,maxHp:100,progress}}
function projectile(overrides={}){return {cx:0,cy:0,angle:0,range:100,u:0,velocity:200,damage:1,hitIds:new Set(),...overrides}}
let count=0;
function test(name,fn){fn();count++;console.log('PASS '+name)}

test('first escape immediately removes exactly one of the 20 visible lives',()=>{
 assert.match(source,/const CORE_LIVES=20;/);
 const c=context();c.monsters=[enemy(1,0,100)];assert.equal(c.resolveEscapes(),1);
 assert.equal(c.lives,19);assert.equal(c.escaped,1);assert.equal(c.updates,1);assert.equal(c.monsters.length,0);
});
test('successive exits update the counter without a kill or wave completion',()=>{
 const c=context();c.monsters=[enemy(1,0,100),enemy(2,0,99)];c.resolveEscapes();assert.equal(c.lives,19);
 c.monsters[0].progress=101;c.resolveEscapes();assert.equal(c.lives,18);assert.equal(c.escaped,2);assert.equal(c.updates,2);
});
test('warp positions and dead enemies do not consume a life',()=>{
 const c=context();c.monsters=[enemy(1,-1000,50),{...enemy(2,0,101),hp:0}];
 assert.equal(c.resolveEscapes(),0);assert.equal(c.lives,20);assert.equal(c.updates,0);
});
test('fast crossings count once and core integrity never becomes negative',()=>{
 const c=context();c.lives=1;const a=enemy(1,0,1000);c.monsters=[a,enemy(2,0,1100)];
 assert.equal(c.resolveEscapes(),2);assert.equal(c.lives,0);c.monsters=[a];assert.equal(c.resolveEscapes(),0);assert.equal(c.escaped,2);
});
test('exited enemies are removed before projectile combat',()=>{
 const c=context();c.monsters=[enemy(1,20,100)];c.resolveEscapes();c.boomShots=[projectile()];c.advanceBoomerangs(.5);
 assert.equal(c.hits.length,0);assert(source.indexOf('if(resolveEscapes()')<source.indexOf('// Tower: target the current red center'));
});
test('boomerang reaches maximum range and returns on exactly the same line',()=>{
 const c=context(),b=projectile({angle:Math.PI/3,cx:4,cy:8});
 for(const u of [0,.1,.25,.5,.75,.9,1]){const p=c.boomPoint(b,u);assert(Math.abs((p.x-b.cx)*Math.sin(b.angle)-(p.y-b.cy)*Math.cos(b.angle))<1e-10)}
 const tip=c.boomPoint(b,.5),end=c.boomPoint(b,1);assert(Math.abs(Math.hypot(tip.x-4,tip.y-8)-100)<1e-9);assert.equal(end.x,4);assert.equal(end.y,8);
});
test('one boomerang pierces two enemies on both legs',()=>{
 const c=context();c.monsters=[enemy(1,20),enemy(2,70)];c.boomShots=[projectile()];
 c.advanceBoomerangs(.5);assert.equal(c.hits.length,2);c.advanceBoomerangs(.5);assert.equal(c.hits.length,4);
 assert.equal(c.monsters[0].hp,98);assert.equal(c.monsters[1].hp,98);assert.equal(c.boomShots.length,0);
});
test('no repeated damage while overlapping an enemy on the same leg',()=>{
 const c=context();c.monsters=[enemy(1,50)];c.boomShots=[projectile()];for(let i=0;i<100;i++)c.advanceBoomerangs(.01);
 assert.equal(c.hits.length,2);
});
test('a fast frame crossing the turn checks both outbound and return segments',()=>{
 const c=context();c.monsters=[enemy(1,95)];c.boomShots=[projectile({u:.45})];c.advanceBoomerangs(.2);
 assert.equal(c.hits.length,2);
});
test('the final segment returning to the tower can still deal damage',()=>{
 const c=context();c.monsters=[enemy(1,5)];c.boomShots=[projectile({u:.95})];c.advanceBoomerangs(.1);
 assert.equal(c.hits.length,1);assert.equal(c.boomShots.length,0);
});
test('enemies inside tunnels remain protected',()=>{
 const c=context();c.monsters=[{...enemy(1,40),hidden:true},enemy(2,70)];c.boomShots=[projectile()];c.advanceBoomerangs(1);
 assert.equal(c.hits.length,2);assert(c.hits.every(hit=>hit.id===2));
});
test('one active projectile per tower, without retargeting during flight',()=>{
 const c=context(),tower={x:0,y:0};c.monsters=[enemy(1,40)];const spec={range:100,velocity:200,damage:1};
 assert.equal(c.launchBoomSalve(tower,{x:0,y:0},spec),true);assert.equal(c.launchBoomSalve(tower,{x:0,y:0},spec),false);
 c.monsters[0].y=90;assert.equal(c.boomShots[0].angle,0);assert.equal(c.boomShots.length,1);
});
function resultContext(old=null,storageFails=false){
 const c=context(),nodes=new Map(),saved=new Map(old?[['arc_defense_v1_best',JSON.stringify(old)]]:[]);
 function element(){const classes=new Set();return {textContent:'',hidden:false,children:[],classList:{add:x=>classes.add(x),contains:x=>classes.has(x)},append(...items){this.children.push(...items)},replaceChildren(){this.children=[]},focus(){this.focused=true}}}
 c.$=id=>{if(!nodes.has(id))nodes.set(id,element());return nodes.get(id)};
 c.document={createElement:element};c.localStorage={getItem:key=>{if(storageFails)throw Error('Storage unavailable');return saved.get(key)||null},setItem:(key,value)=>saved.set(key,value)};
 c.window.arcAudio.mode=()=>{};c.requestAnimationFrame=fn=>fn();c.discoveredPercent=()=>80;c.campaignUpgradeCost=()=>65;
 Object.assign(c,{waveNumber:16,CAMPAIGN_WAVES:20,CORE_LIVES:20,kills:362,lives:0,energy:120,towers:[{lv:2},{lv:5}]});c.$('level').value='2';
 vm.runInContext(extract('endCampaign'),c);return {c,nodes,saved};
}
test('defeat summary shows actual run values and 20-life core',()=>{
 const {c,nodes}=resultContext();c.endCampaign(false);
 assert.equal(nodes.get('endTitle').textContent,'CORE DESTROYED');
 const values=nodes.get('endSummary').children.map(item=>item.children[1].textContent);
 assert.deepEqual(values,['16 / 20','362','0 / 20','120 ⚡','2','80%']);
 assert(nodes.get('endTip').textContent.startsWith('1 tower upgrade was'));
 assert.equal(nodes.get('endRestart').focused,true);
});
test('a weaker result does not overwrite the previous device record',()=>{
 const previous={won:false,wave:18,lives:0,kills:430};const {c,saved}=resultContext(previous);c.endCampaign(false);
 assert.deepEqual(JSON.parse(saved.get('arc_defense_v1_best')),previous);
});
test('victory can replace a loss and unavailable storage never blocks the dialog',()=>{
 const {c,saved}=resultContext({won:false,wave:20,lives:0,kills:1000});c.waveNumber=20;c.lives=3;c.endCampaign(true);
 assert.equal(JSON.parse(saved.get('arc_defense_v1_best')).won,true);
 const fallback=resultContext(null,true);assert.doesNotThrow(()=>fallback.c.endCampaign(false));assert.equal(fallback.nodes.get('endRecord').hidden,true);
});
function linkContext(){
 const c=context();Object.assign(c,{C:57,ENEMY_R:18,W:16,H:9,ELINK_MIN_SPAN:1.5,eLinkPending:null,towers:[],occupied:new Set(),energy:340,placing:true,placingType:'elink',selected:null,placementHover:null,boomHover:null,selectedRangeSince:0,performance:{now:()=>100},towerPrices:{elink:200}});
 const raw=source.match(/const elinkSpecs=(\[null,.*?\]);/)[1];vm.runInContext('var elinkSpecs='+raw,c);
 c.key=(x,y)=>x+','+y;c.arcWaveLocked=()=>false;c.technologyAvailable=()=>true;c.modeButtons=()=>{};c.syncDock=()=>{};c.draw=()=>{};c.ctr=t=>({x:t.x*57,y:t.y*57});
 c.specList=()=>c.elinkSpecs;
 for(const name of ['towerAtCell','freeConstructionCell','validELinkEnd','hasELinkEnd','placeELinkCell','cancelELink','towerSpec','advanceELinks'])vm.runInContext(extract(name),c);
 return c;
}
test('E-Link first pylon is an unpaid draft and completing it buys one pair once',()=>{
 const c=linkContext();assert(c.placeELinkCell({x:2,y:2}));assert.equal(c.energy,340);assert.equal(c.towers.length,0);
 assert(c.placeELinkCell({x:5,y:2}));assert.equal(c.energy,140);assert.equal(c.towers.length,1);assert.equal(c.eLinkPending,null);
 assert.equal(c.placeELinkCell({x:5,y:2}),false);assert.equal(c.energy,140);
});
test('E-Link rejects path cells, occupied endpoints and invalid spans without charging',()=>{
 const c=linkContext();c.occupied.add('1,1');assert.equal(c.placeELinkCell({x:1,y:1}),false);
 c.placeELinkCell({x:2,y:2});for(const cell of [{x:2,y:2},{x:3,y:2},{x:9,y:2},{x:1,y:1}])assert.equal(c.placeELinkCell(cell),false);
 assert.equal(c.energy,340);assert.equal(c.towers.length,0);assert.equal(c.eLinkPending.x,2);
});
test('cancel releases the provisional pylon and costs no energy',()=>{
 const c=linkContext();c.placeELinkCell({x:2,y:2});assert.equal(c.freeConstructionCell(2,2),false);c.cancelELink();
 assert.equal(c.energy,340);assert.equal(c.towers.length,0);assert.equal(c.eLinkPending,null);assert(c.freeConstructionCell(2,2));
});
test('both pylons select the same upgrade and sale record and reserve both cells',()=>{
 const c=linkContext();c.placeELinkCell({x:2,y:2});c.placeELinkCell({x:5,y:2});const a=c.towerAtCell(2,2),b=c.towerAtCell(5,2);
 assert.equal(a,b);b.lv=4;assert.equal(a.lv,4);assert.equal(c.freeConstructionCell(5,2),false);
 c.towers=c.towers.filter(t=>t!==b);assert(c.freeConstructionCell(2,2));assert(c.freeConstructionCell(5,2));
});
test('pending pair cannot complete during wave announcements or without energy',()=>{
 const c=linkContext();c.placeELinkCell({x:2,y:2});c.arcWaveLocked=()=>true;assert.equal(c.placeELinkCell({x:5,y:2}),false);
 c.key=(x,y)=>x+','+y;c.arcWaveLocked=()=>false;c.energy=199;assert.equal(c.placeELinkCell({x:5,y:2}),false);assert.equal(c.towers.length,0);assert.equal(c.energy,199);
});
test('unavailable technology cannot start an E-Link draft',()=>{
 const c=linkContext();c.technologyAvailable=()=>false;assert.equal(c.placeELinkCell({x:2,y:2}),false);assert.equal(c.eLinkPending,null);
});
test('E-Link damages all touching enemies once per pair and never distant enemies',()=>{
 const c=linkContext();c.towers=[{type:'elink',x:0,y:2,end:{x:4,y:2},lv:1}];
 c.monsters=[{...enemy(1,57),y:114},{...enemy(2,171),y:114},{...enemy(3,171),y:200}];c.advanceELinks(1);
 assert(Math.abs(c.monsters[0].hp-97.6)<1e-9);assert(Math.abs(c.monsters[1].hp-97.6)<1e-9);assert.equal(c.monsters[2].hp,100);assert.equal(c.towers[0].linkActive,2);
});
test('E-Link ignores dead, escaped and tunnel-protected enemies',()=>{
 const c=linkContext();c.towers=[{type:'elink',x:0,y:2,end:{x:4,y:2},lv:1}];
 c.monsters=[{...enemy(1,57),y:114,hidden:true},{...enemy(2,57),y:114,escaped:true},{...enemy(3,57),y:114,hp:0}];
 c.advanceELinks(1);assert.equal(c.monsters[0].hp,100);assert.equal(c.monsters[1].hp,100);assert.equal(c.monsters[2].hp,0);
});
test('fast crossings damage only the fraction of time in the beam',()=>{
 const c=linkContext();c.towers=[{type:'elink',x:0,y:2,end:{x:4,y:2},lv:1}];c.posAt=p=>({x:114,y:p});
 c.monsters=[{...enemy(1,114),y:150,progress:150,eLinkPrevious:{x:114,y:78},eLinkPreviousProgress:78}];c.advanceELinks(.1);
 assert(c.monsters[0].hp<100);assert(c.monsters[0].hp>99.76);
});
test('warp jumps never create an electric hit across the intervening board',()=>{
 const c=linkContext();c.towers=[{type:'elink',x:0,y:2,end:{x:4,y:2},lv:1}];c.posAt=()=>({x:114,y:400});
 c.monsters=[{...enemy(1,114),y:400,progress:500,eLinkPrevious:{x:114,y:-100},eLinkPreviousProgress:0}];c.advanceELinks(.1);assert.equal(c.monsters[0].hp,100);
});
test('electric DPS is independent of frame rate and zero time never damages',()=>{
 const run=steps=>{const c=linkContext();c.towers=[{type:'elink',x:0,y:2,end:{x:4,y:2},lv:1}];c.monsters=[{...enemy(1,114),y:114}];for(let i=0;i<steps;i++)c.advanceELinks(1/steps);return c.monsters[0].hp};
 assert(Math.abs(run(10)-run(100))<1e-9);const c=linkContext();c.monsters=[enemy(1,0)];c.advanceELinks(0);assert.equal(c.monsters[0].hp,100);
});
test('E-Link specialization modifies shared DPS or contact width',()=>{
 const c=linkContext(),base=c.towerSpec({type:'elink',lv:5}),power=c.towerSpec({type:'elink',lv:5,specialization:'power'}),reach=c.towerSpec({type:'elink',lv:5,specialization:'reach'});
 assert.equal(power.damage,8.32);assert.equal(base.damage,6.4);assert.equal(reach.width,.297);assert.equal(base.width,.22);
});
function titanContext(){
 const c=context(),nodes=new Map(),modes=[];
 c.$=id=>{if(!nodes.has(id))nodes.set(id,{textContent:'',disabled:false,classList:{toggle(){},add(){},remove(){}},focus(){}});return nodes.get(id)};
 Object.assign(c,{level:2,monsterSerial:0,TITAN_RADIUS:43,titanEncounter:'idle',titanCountdown:0,titanAftermath:0,titanFightTime:0,titanPhaseReached:1,titanMaxHp:0,titanRemainingHp:0,eLinkPending:null,placing:false,placementHover:null,boomHover:null,waveSpawned:10,waveTotal:10,TAU:Math.PI*2,ENEMY_R:18});
 c.window.arcAudio.mode=m=>modes.push(m);c.modeButtons=()=>{};c.spawnVfx91=()=>{};c.monsterPosition=m=>({x:m.x||0,y:m.y||0});
 for(const name of ['resetTitanEncounter','titanBlocksCompletion','beginTitanWarning','createTitan','spawnTitan','stepTitanEncounter','updateTitanPhase','finishTitan','titanGeometry','armorCount','ensureArmor','enemyGeometry','applyGeometricHit','freezeResistance','canGrapple'])vm.runInContext(extract(name),c);
 return {c,nodes,modes};
}
test('final-wave escort must finish before Titan arrives',()=>{
 const {c,modes}=titanContext();c.titanEncounter='pending';c.monsters=[enemy(1,10)];c.stepTitanEncounter(1);
 assert.equal(c.titanEncounter,'pending');assert(c.titanBlocksCompletion());assert.equal(modes.length,0);
 c.monsters=[];c.stepTitanEncounter(.05);assert.equal(c.titanEncounter,'warning');assert.equal(c.monsters.length,0);assert.equal(modes[0],'bossIntro');
});
test('campaign launches normally through wave 19 and queues Titan only on wave 20',()=>{
 for(const wave of [1,19,20]){const {c}=titanContext();Object.assign(c,{kills:0,waveNumber:wave,CAMPAIGN_WAVES:20,playing:false,firstWaveStarted:false,autoWaveCountdown:-1,performance:{now:()=>100},pathRevealBanner:{classList:{toggle(){}}}});
  c.renderWaveCountdown=()=>{};c.discoveredPercent=()=>100;c.waveComposition=()=>({total:46});vm.runInContext(extract('launchWave'),c);c.launchWave();
  assert.equal(c.titanEncounter,wave===20?'pending':'idle');assert(c.playing);assert.equal(c.waveSpawned,0);assert.equal(c.monsters.length,0);
 }
});
test('Titan spawns once after its warning, with balanced spawn counters',()=>{
 const {c,modes}=titanContext();c.titanEncounter='pending';c.stepTitanEncounter(.05);c.stepTitanEncounter(2);assert.equal(c.monsters.length,0);
 c.stepTitanEncounter(.5);assert.equal(c.monsters.length,1);assert(c.monsters[0].boss);assert.equal(c.waveSpawned,11);assert.equal(c.waveTotal,11);assert.equal(modes.at(-1),'boss');
 c.stepTitanEncounter(5);assert.equal(c.monsters.length,1);assert(c.titanBlocksCompletion());
});
test('boss HP follows difficulty while preserving six independent armor plates',()=>{
 const {c}=titanContext();for(const [level,hp] of [[1,240],[2,340],[3,440]]){c.level=level;const m=c.createTitan();assert.equal(m.hp,hp);assert.equal(m.plates.length,6);assert.equal(m.plateHp.length,6);assert.equal(m.phase,1)}
});
test('phase II triggers exactly once at half HP without restoring health',()=>{
 const {c,modes}=titanContext(),m=c.createTitan();m.hp=171;assert.equal(c.updateTitanPhase(m),false);m.hp=170;m.plates.fill(false);
 assert(c.updateTitanPhase(m));assert.equal(m.hp,170);assert.equal(m.phase,2);assert.equal(m.spinSpeed,.86);assert(m.plates.every(Boolean));
 assert.equal(c.updateTitanPhase(m),false);assert.deepEqual(modes,['bossPhase2']);
});
test('lethal damage does not trigger a phantom second phase',()=>{
 const {c,modes}=titanContext(),m=c.createTitan();m.hp=0;assert.equal(c.updateTitanPhase(m),false);assert.equal(modes.length,0);
});
test('Titan uses enlarged collision geometry and spreads its plates in phase II',()=>{
 const {c}=titanContext(),m=c.createTitan();const radius=()=>Math.max(...c.enemyGeometry(m,{x:0,y:0}).filter(p=>p.kind==='armor').flatMap(p=>p.points.map(q=>Math.hypot(q.x,q.y))));
 const before=radius();assert(before>40);m.phase=2;assert(radius()>before+10);
 vm.runInContext(extract('geometricHits'),c);assert(c.geometricHits({x:9,y:0},{x:9,y:0},m,{x:0,y:0}).some(h=>h.kind==='heart'));
});
test('boss armor absorbs several hits and never deducts core HP on armor impacts',()=>{
 const {c}=titanContext(),m=c.createTitan(),hit={m,index:0,kind:'armor',x:0,y:0};c.applyGeometricHit(hit,1);assert(m.plates[0]);assert.equal(m.hp,340);
 c.applyGeometricHit(hit,3);assert.equal(m.plates[0],false);assert.equal(m.hp,340);assert.equal(c.applyGeometricHit(hit,2),false);
});
test('Titan resists freezing and grappling while ordinary enemies retain their rules',()=>{
 const {c}=titanContext(),m=c.createTitan();assert.equal(c.freezeResistance(m),.22);assert.equal(c.canGrapple(m),false);
 assert.equal(c.freezeResistance({trait:'sprinter'}),.8);assert.equal(c.freezeResistance({}),1);assert(c.canGrapple({}));assert.equal(c.canGrapple({grapple:{}}),false);
});
test('boss death blocks premature victory through the explosion and clears after it',()=>{
 const {c,modes}=titanContext(),m=c.createTitan();m.hp=0;m.phase=2;c.finishTitan(m);
 assert.equal(c.titanEncounter,'defeated');assert(c.titanBlocksCompletion());assert.equal(c.titanPhaseReached,2);assert.equal(modes.at(-1),'bossDefeated');
 const count=c.particles.length;c.finishTitan(m);assert.equal(c.particles.length,count);
 c.stepTitanEncounter(1);assert(c.titanBlocksCompletion());c.stepTitanEncounter(2);assert.equal(c.titanBlocksCompletion(),false);
});
test('Titan escape is counted once and defeats the core instead of granting victory',()=>{
 const {c}=titanContext(),m=c.createTitan();vm.runInContext(extract('resolveEscapes'),c);m.progress=100;c.monsters=[m];assert.equal(c.resolveEscapes(),1);assert.equal(c.lives,0);assert.equal(c.titanEncounter,'escaped');assert.equal(c.titanRemainingHp,340);
 c.resolveEscapes();assert.equal(c.escaped,1);
});
test('boss test results never read or overwrite campaign records',()=>{
 for(const won of [true,false]){const {c,saved}=resultContext({won:true,wave:20,lives:19,kills:700});let called=null;c.titanBossTest=true;c.endTitanTest=value=>called=value;
  const before=saved.get('arc_defense_v1_best');c.endCampaign(won);assert.equal(called,won);assert.equal(saved.get('arc_defense_v1_best'),before);
 }
});
test('Boss Test shows its own retry and return actions',()=>{
 const {c,nodes}=resultContext();Object.assign(c,{titanRemainingHp:0,titanPhaseReached:2,titanFightTime:42.2});vm.runInContext(extract('endTitanTest'),c);c.endTitanTest(true);
 assert.equal(nodes.get('endTitle').textContent,'TITAN DEFEATED');assert.equal(nodes.get('endRestart').textContent,'↺ Retry Boss');assert.equal(nodes.get('endNew').textContent,'Return to Campaign');assert.equal(nodes.get('endRecord').hidden,true);
});
test('Titan renderer runs in both phases with its caller-provided portal scale',()=>{
 const {c}=titanContext(),m=c.createTitan();c.g=new Proxy({},{get:(target,key)=>target[key]||(()=>{})});c.performance={now:()=>1000};vm.runInContext(extract('paintTitan'),c);
 assert.doesNotThrow(()=>c.paintTitan(m,{x:30,y:40},.6));m.phase=2;assert.doesNotThrow(()=>c.paintTitan(m,{x:30,y:40},1));
});
test('boss score has low bass and gains an additional musical layer in phase II',()=>{
 function score(mode){const tones=[],drums=[],c=vm.createContext({state:{mode},tone:(...a)=>tones.push(a),drum:(...a)=>drums.push(a),note:n=>440*Math.pow(2,(n-69)/12)});vm.runInContext(extract('scheduleTitan'),c);for(let i=0;i<16;i++)c.scheduleTitan(i,i*.13);return {tones,drums}}
 const a=score('boss'),b=score('bossPhase2');assert(a.tones.some(x=>x[0]<70));assert(b.tones.length>a.tones.length);assert(b.drums.length>a.drums.length);
});
test('boss music scheduling honors mute and pause',()=>{
 for(const state of [{mode:'boss',enabled:false,paused:false},{mode:'bossPhase2',enabled:true,paused:true},{mode:'boss',enabled:true,paused:false}]){
  let calls=0;const c=vm.createContext({state,ac:{state:'running',currentTime:1},nextTime:1,seq:0,STAGE_STEP:.11,schedule:()=>calls++});vm.runInContext(extract('tick'),c);c.tick();assert.equal(calls>0,state.enabled&&!state.paused);
 }
});
function campaignContext(raw=null){
 const {c,nodes}=titanContext(),saved=new Map(raw?[['arc_campaign_v1',JSON.stringify(raw)]]:[]);
 Object.assign(c,{geminiTwins:[],campaignStageNumber:1,playMode:'campaign',titanBossTest:false,CAMPAIGN_STORAGE_KEY:'arc_campaign_v1',CAMPAIGN_BASE_TECH:['precision','rapid','pierce','grapple'],CAMPAIGN_TECH_WAVES:{freeze:2,elink:4,area:6,boom:6},TECH_NAMES:{freeze:'FREEZER',elink:'E-LINK',area:'PULSE',boom:'BOOMERANG'},localStorage:{getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v)},techBanner:{textContent:'',classList:{add(){},remove(){}}},techBannerTimer:0,setTimeout:()=>0,clearTimeout(){},level:2,kills:157,energy:200,enemyProfiles:[{spin:1.3},{spin:2.3},{spin:1.05}]});
 const waves=source.match(/const STAGE_ONE_WAVES=(\[[\s\S]*?\n\]);/)[1];vm.runInContext('var STAGE_ONE_WAVES='+waves,c);
 const waves2=source.match(/const STAGE_TWO_WAVES=(\[[\s\S]*?\n\]);/)[1];vm.runInContext('var STAGE_TWO_WAVES='+waves2,c);
 const waves4=source.match(/const STAGE_FOUR_WAVES=(\[[\s\S]*?\n\]);/)[1];vm.runInContext('var STAGE_FOUR_WAVES='+waves4,c);
 const waves3=source.match(/const STAGE_THREE_WAVES=(\[[\s\S]*?\n\]);/)[1];vm.runInContext('var STAGE_THREE_WAVES='+waves3,c);
 for(const name of ['createGemini','updateGeminiEncounter','geminiStatus','nextCampaignSpawnDelay','buildStageFourRoute','campaignStageBudget','createNexus','updateNexusPhase','nexusGeometry','releaseGrapple','advanceGrappleGuard','buildStageThreeRoute','activeStage','campaignWaveSpecs','canPlayStage','createBastion','buildStageTwoRoute','sampledCampaignRoute','bastionGeometry','isStageCampaign','freshCampaignProgress','readCampaignProgress','saveCampaignProgress','technologyAvailable','unlockCampaignTechnologies','stageOneSequence','createStageOneEnemy','buildStageOneRoute','stageStars','recordStageOneVictory'])vm.runInContext(extract(name),c);
 c.campaignProgress=c.readCampaignProgress();return {c,nodes,saved};
}
test('Stage 01 contains exactly eight authored waves and 157 enemies',()=>{
 const {c}=campaignContext();let total=0;for(let w=1;w<=8;w++){const seq=c.stageOneSequence(w),spec=c.STAGE_ONE_WAVES[w-1];assert.equal(seq.length,spec.counts.reduce((a,b)=>a+b,0));for(let t=0;t<3;t++)assert.equal(seq.filter(x=>x===t).length,spec.counts[t]);total+=seq.length}assert.equal(total,157);
});
test('Stage 01 ends with exactly three reinforced Hexions and no Titan',()=>{
 const {c}=campaignContext(),seq=c.stageOneSequence(8);let elites=0;for(let i=0;i<seq.length;i++){const m=c.createStageOneEnemy(8,i);assert.equal(m.boss,undefined);if(m.trait==='bulwark'){elites++;assert.equal(m.type,2);assert.equal(m.armor,6);assert.equal(m.hp,10.5)}}assert.equal(elites,3);
});
test('authored route is deterministic, continuous and contained on the board',()=>{
 const {c}=campaignContext(),route=c.buildStageOneRoute(),again=c.buildStageOneRoute();assert.equal(JSON.stringify(route),JSON.stringify(again));assert.equal(route[0].x,8);assert.equal(route.at(-1).x,1112);
 for(let i=1;i<route.length;i++){assert(route[i].dist>route[i-1].dist);assert(Math.hypot(route[i].x-route[i-1].x,route[i].y-route[i-1].y)<20);assert(route[i].x>=8&&route[i].x<=1112);assert(route[i].y>80&&route[i].y<600)}
});
test('campaign technologies unlock at waves 2, 4 and 6, without duplicates',()=>{
 const {c}=campaignContext();assert.equal(c.technologyAvailable('freeze'),false);assert.equal(c.unlockCampaignTechnologies(1).length,0);assert.deepEqual(Array.from(c.unlockCampaignTechnologies(2)),['freeze']);assert(c.technologyAvailable('freeze'));assert.equal(c.technologyAvailable('elink'),false);
 c.unlockCampaignTechnologies(4);assert(c.technologyAvailable('elink'));c.unlockCampaignTechnologies(6);assert.equal(c.campaignProgress.unlocked.length,8);assert.equal(c.unlockCampaignTechnologies(8).length,0);
});
test('campaign unlocks survive retries and storage reloads without changing challenge records',()=>{
 const {c,saved}=campaignContext();saved.set('arc_defense_v1_best','original');c.unlockCampaignTechnologies(4);const reloaded=c.readCampaignProgress();assert(reloaded.unlocked.includes('freeze'));assert(reloaded.unlocked.includes('elink'));assert.equal(saved.get('arc_defense_v1_best'),'original');
});
test('stage results retain the best stars, and never regress after a weaker victory',()=>{
 const {c,saved}=campaignContext();c.lives=20;c.recordStageOneVictory();c.lives=5;c.recordStageOneVictory();assert.equal(c.campaignProgress.best['1'].stars,3);assert.equal(c.campaignProgress.best['1'].lives,20);assert.equal(JSON.parse(saved.get('arc_campaign_v1')).cleared['1'],true);
});
test('campaign progress rejects unknown technologies and invalid records',()=>{
 const {c}=campaignContext({version:1,unlocked:['freeze','imaginary'],cleared:{'1':'yes'},best:{'1':{stars:10,lives:100}}});assert(c.campaignProgress.unlocked.includes('freeze'));assert.equal(c.campaignProgress.unlocked.includes('imaginary'),false);assert.equal(c.campaignProgress.cleared['1'],undefined);assert.equal(c.campaignProgress.best['1'],undefined);
});
test('blocked storage preserves session progress and reports no false save',()=>{
 const {c}=campaignContext();c.localStorage.setItem=()=>{throw Error('Storage unavailable')};c.lives=18;const result=c.recordStageOneVictory();assert.equal(result.saved,false);assert.equal(c.campaignProgress.best['1'].stars,2);
});
test('campaign and Boss Test use separate technology rules',()=>{
 const {c}=campaignContext();assert(c.isStageCampaign());c.titanBossTest=true;assert.equal(c.isStageCampaign(),false);c.titanBossTest=false;c.playMode='challenge';assert.equal(c.isStageCampaign(),false);
});
test('Stage 02 is locked until Stage 01 is cleared, and unlock survives reload',()=>{
 const {c}=campaignContext();assert.equal(c.canPlayStage(2),false);c.lives=18;c.recordStageOneVictory();assert.equal(c.canPlayStage(2),true);c.campaignProgress=c.readCampaignProgress();assert(c.canPlayStage(2));assert.equal(c.canPlayStage(3),false);
});
test('Stage 02 has ten deterministic waves with one final Bastion and no Titan',()=>{
 const {c}=campaignContext();c.campaignStageNumber=2;let total=0,bosses=0;
 for(let w=1;w<=10;w++){const seq=c.stageOneSequence(w);total+=seq.length;for(let i=0;i<seq.length;i++){const m=c.createStageOneEnemy(w,i);assert.equal(m.boss,undefined);if(m.miniBoss){bosses++;assert.equal(w,10);assert.equal(i,seq.length-1);assert.equal(m.hp,100);assert.equal(m.plates.length,6);assert(m.plateHp.every(h=>h===3))}}}assert.equal(total,231);assert.equal(bosses,1);
});
test('Stage 02 results remain independent of Stage 01 and persist',()=>{
 const {c}=campaignContext();c.lives=20;c.recordStageOneVictory();c.campaignStageNumber=2;c.lives=16;c.recordStageOneVictory();const progress=c.readCampaignProgress();assert.equal(progress.best['1'].stars,3);assert.equal(progress.best['2'].stars,2);assert.equal(progress.cleared['2'],true);
});
test('Stage 02 route differs, stays within the board and has no discontinuity',()=>{
 const {c}=campaignContext(),r=c.buildStageTwoRoute();assert.notEqual(JSON.stringify(r),JSON.stringify(c.buildStageOneRoute()));assert(r.at(-1).dist>2100);
 for(let i=1;i<r.length;i++){assert(r[i].dist>r[i-1].dist);assert(Math.hypot(r[i].x-r[i-1].x,r[i].y-r[i-1].y)<20);assert(r[i].x>=8&&r[i].x<=1112);assert(r[i].y>80&&r[i].y<600)}
});
test('Bastion escape ends the stage without mutating Titan state',()=>{
 const c=context();c.monsters=[{...enemy(1,0,100),miniBoss:true}];c.resolveEscapes();assert.equal(c.lives,0);assert.equal(c.escaped,1);assert.equal(c.titanEncounter,undefined);
});
test('Bastion has durable armor, a separate silhouette and partial freeze resistance',()=>{
 const {c}=campaignContext();c.campaignStageNumber=2;const m=c.createBastion();vm.runInContext(extract('enemyGeometry'),c);const geo=c.enemyGeometry(m,{x:0,y:0});assert(geo.flatMap(p=>p.points).some(p=>Math.hypot(p.x,p.y)>30));
 c.applyGeometricHit({m,kind:'armor',index:0,x:0,y:0},1);assert(m.plates[0]);assert.equal(m.plateHp[0],2);assert.equal(m.hp,100);assert.equal(c.freezeResistance(m),.5);assert(c.canGrapple(m));
});
test('Stage 03 unlock requires Stage 02 and all three records persist independently',()=>{
 const {c}=campaignContext();assert(!c.canPlayStage(3));c.lives=20;c.recordStageOneVictory();assert(!c.canPlayStage(3));c.campaignStageNumber=2;c.lives=18;c.recordStageOneVictory();assert(c.canPlayStage(3));c.campaignStageNumber=3;c.lives=16;c.recordStageOneVictory();const p=c.readCampaignProgress();assert.equal(p.best['1'].lives,20);assert.equal(p.best['2'].lives,18);assert.equal(p.best['3'].lives,16);assert(p.cleared['3']);assert(c.canPlayStage(4));assert(!c.canPlayStage(5));
});
test('Stage 03 contains 417 enemies across twelve waves and exactly one Nexus at the end',()=>{
 const {c}=campaignContext();c.campaignStageNumber=3;let total=0,bosses=0;assert.equal(c.campaignStageBudget(),600);
 for(let w=1;w<=12;w++){const seq=c.stageOneSequence(w);total+=seq.length;for(let i=0;i<seq.length;i++){const m=c.createStageOneEnemy(w,i);assert.equal(m.boss,undefined);if(m.miniBoss){bosses++;assert.equal(w,12);assert.equal(i,seq.length-1);assert.equal(m.stageBoss,'nexus');assert.equal(m.hp,160);assert.equal(m.type,1)}}}assert.equal(total,417);assert.equal(bosses,1);
});
test('Nexus phase changes once at half health without restoring HP or armor',()=>{
 const {c}=campaignContext(),m=c.createNexus();m.hp=81;assert.equal(c.updateNexusPhase(m),false);m.hp=80;m.plates[0]=false;const speed=m.moveSpeed;assert(c.updateNexusPhase(m));assert(m.moveSpeed>speed);assert.equal(m.hp,80);assert.equal(m.plates[0],false);assert.equal(c.updateNexusPhase(m),false);assert.equal(c.freezeResistance(m),.35);
});
test('boss grapple shield lasts three simulation seconds after release and ordinary enemies are unchanged',()=>{
 const {c}=campaignContext();for(const m of [c.createBastion(),c.createNexus()]){m.grapple={};c.releaseGrapple(m);assert.equal(m.grappleGuard,3);assert.equal(c.canGrapple(m),false);c.advanceGrappleGuard(m,2.9);assert.equal(c.canGrapple(m),false);c.advanceGrappleGuard(m,.11);assert(c.canGrapple(m));}const normal={grapple:{}};c.releaseGrapple(normal);assert(c.canGrapple(normal));assert.equal(normal.grappleGuard,undefined);
});
test('Stage 03 route is distinct, continuous and bounded, and Nexus geometry has three plates',()=>{
 const {c}=campaignContext(),r=c.buildStageThreeRoute();assert.notEqual(JSON.stringify(r),JSON.stringify(c.buildStageTwoRoute()));for(let i=1;i<r.length;i++){assert(r[i].dist>r[i-1].dist);assert(Math.hypot(r[i].x-r[i-1].x,r[i].y-r[i-1].y)<20);assert(r[i].x>=8&&r[i].x<=1112);assert(r[i].y>80&&r[i].y<600)}const geo=c.nexusGeometry(c.createNexus(),{x:0,y:0});assert.equal(geo.filter(p=>p.kind==='armor').length,3);assert.equal(geo.filter(p=>p.kind==='red').length,3);
});
test('boss phase and death rings render without negative radii throughout their lifetime',()=>{
 const render=source.match(/for\(let p of particles\)\{if\(p.effect\)continue;[^\n]+/)[0],radii=[];
 const particles=[{x:0,y:0,r:65,life:.7,blast:true},{x:0,y:0,r:85,life:.8,blast:true},{x:0,y:0,r:100,life:1.46,blast:true},{x:0,y:0,r:18,life:.35}];
 const c=vm.createContext({particles,Math,g:{beginPath(){},arc(x,y,r){assert(Number.isFinite(r)&&r>=0);radii.push(r)},stroke(){}}});for(let i=0;i<40;i++){vm.runInContext(render,c);for(const p of particles)p.life=Math.max(0,p.life-.05)}assert.equal(radii.length,160);assert(radii.some(r=>r>=85));
});

function magnetContext(){
 const {c}=titanContext();Object.assign(c,{C:57,magneticPairs:[],magnetSerial:0,towers:[],way:[{dist:10000}]});
 const raw=source.match(/const areaSpecs=(\[null,.*?\]);/)[1];vm.runInContext('var areaSpecs='+raw,c);
 c.towerSpec=t=>c.areaSpecs[t.lv];c.ctr=t=>({x:t.x*57,y:t.y*57});
 for(const name of ['canMagnetCapture','beginMagneticPair','endMagneticPair','cancelMagnetarForTower','prepareMagnetar','advanceMagnetar','advanceELinks'])vm.runInContext(extract(name),c);
 c.monsters=[{...enemy(1,40,100),type:2,armor:6,plates:Array(6).fill(true),plateHp:Array(6).fill(4)},{...enemy(2,80,110),type:2,armor:6,plates:Array(6).fill(true),plateHp:Array(6).fill(4)}];
 const tower={type:'area',x:0,y:0,lv:1,cool:0};c.towers=[tower];return {c,tower};
}
test('Magnetar draws for 1 second then compresses for 4 seconds before a single release',()=>{
 const {c,tower}=magnetContext();assert(c.beginMagneticPair(tower));assert.equal(c.magneticPairs.length,1);assert(c.monsters.every(c.isMagnetProtected));
 c.advanceMagnetar(.99);c.advanceMagnetar(4);assert(c.monsters.every(m=>m.hp===100&&m.armor===6));
 c.advanceMagnetar(.01);assert.equal(c.magneticPairs.length,0);assert(c.monsters.every(m=>m.hp===75&&m.armor===0&&m.plates.every(p=>!p)&&m.plateHp.every(p=>p===0)));assert(c.monsters.every(m=>!c.isMagnetProtected(m)));c.advanceMagnetar(10);assert(c.monsters.every(m=>m.hp===75));
});
test('every Magnetar level reduces compression by 25 percent while keeping formation fixed',()=>{
 for(let lv=1;lv<=5;lv++){const {c,tower}=magnetContext();tower.lv=lv;assert.equal(c.areaSpecs[lv].compression,4*.75**(lv-1));assert(c.beginMagneticPair(tower));c.advanceMagnetar(1+c.areaSpecs[lv].compression-.001);assert.equal(c.monsters[0].hp,100);c.advanceMagnetar(.001);assert.equal(c.monsters[0].hp,75)}
});
test('Magnetar needs exactly two available targets and does not steal grappled or bound enemies',()=>{
 const {c,tower}=magnetContext();c.monsters[1].grapple={};assert.equal(c.beginMagneticPair(tower),false);delete c.monsters[1].grapple;assert(c.beginMagneticPair(tower));assert.equal(c.beginMagneticPair({...tower}),false);assert.equal(c.beginMagneticPair(tower),false);
});
test('Magnetar damage uses maximum HP and can finish an enemy already below 25 percent',()=>{
 const {c,tower}=magnetContext();c.monsters[0].hp=60;c.monsters[1].hp=20;c.beginMagneticPair(tower);c.advanceMagnetar(5);assert.equal(c.monsters[0].hp,35);assert.equal(c.monsters[1].hp,0);
});
test('projectiles already in flight and electric beams cannot damage bound enemies',()=>{
 const {c,tower}=magnetContext();c.beginMagneticPair(tower);for(const m of c.monsters){assert.equal(c.geometricHits({x:0,y:0},{x:100,y:0},m,{x:m.x,y:0}).length,0);assert.equal(c.applyGeometricHit({m,kind:'heart',x:0,y:0},100),false);assert.equal(c.canGrapple(m),false)}
 const link={type:'elink',x:0,y:0,end:{x:2,y:0},lv:1};c.towers.push(link);const base=c.towerSpec;c.towerSpec=t=>t.type==='elink'?{damage:100,width:1}:base(t);c.advanceELinks(.5);assert(c.monsters.every(m=>m.hp===100&&m.armor===6));
});
test('sale, escape, missing partner and tunnels cancel the pair without damage or stranded protection',()=>{
 for(const reason of ['sale','escape','missing','tunnel']){const {c,tower}=magnetContext();c.beginMagneticPair(tower);if(reason==='sale')c.cancelMagnetarForTower(tower);else{if(reason==='escape')c.monsters[0].progress=10000;if(reason==='missing')c.monsters.shift();if(reason==='tunnel')c.underTunnel=()=>true;c.advanceMagnetar(5)}assert.equal(c.magneticPairs.length,0);assert(c.monsters.every(m=>m.hp===100&&!c.isMagnetProtected(m)&&m.armor===6));}
});
test('upgrades apply to the next pair and cooldown starts only after release',()=>{
 const {c,tower}=magnetContext();c.beginMagneticPair(tower);tower.lv=5;c.prepareMagnetar(2);assert.equal(c.magneticPairs.length,1);c.advanceMagnetar(4);assert.equal(c.monsters[0].hp,100);c.advanceMagnetar(1);assert.equal(tower.cool,2);c.prepareMagnetar(1);assert.equal(c.magneticPairs.length,0);c.prepareMagnetar(1);assert.equal(c.magneticPairs.length,1);assert.equal(c.magneticPairs[0].compression,1.265625);
});
test('Stage 04 ends with two elite Hexions and both Gemini guardians within its 428 enemies',()=>{
 const {c}=campaignContext();c.campaignStageNumber=4;let total=0,elites=0,bosses=0;
 for(let w=1;w<=12;w++){const seq=c.stageOneSequence(w);total+=seq.length;for(let i=0;i<seq.length;i++){const m=c.createStageOneEnemy(w,i);assert(!m.boss);if(m.miniBoss){assert.equal(w,12);assert(i>=seq.length-2);assert.equal(m.stageBoss,'gemini');assert.equal(m.hp,220);bosses++;}else if(m.trait==='bulwark'){assert.equal(w,12);assert(i>=seq.length-4);assert.equal(m.hp,32);elites++;}}}assert.equal(total,428);assert.equal(elites,2);assert.equal(bosses,2);assert.equal(c.campaignStageBudget(),650);
});
test('Stage 04 gate, best result and route remain separate from earlier stages',()=>{
 const {c}=campaignContext();assert(!c.canPlayStage(4));for(let n=1;n<=4;n++){c.campaignStageNumber=n;c.lives=21-n;c.recordStageOneVictory();if(n<4)assert(c.canPlayStage(n+1));}const p=c.readCampaignProgress();assert.equal(p.best['4'].lives,17);assert.equal(p.best['3'].lives,18);assert(p.cleared['4']);assert(!c.canPlayStage(5));const r=c.buildStageFourRoute();assert(r.at(-1).dist>2500);for(let i=1;i<r.length;i++){assert(r[i].dist>r[i-1].dist);assert(Math.hypot(r[i].x-r[i-1].x,r[i].y-r[i-1].y)<23);assert(r[i].x>=8&&r[i].x<=1112);assert(r[i].y>80&&r[i].y<600)}
});
test('Gemini has two independent durable armor sets, opposite rotation and combined HP by difficulty',()=>{
 for(const level of [1,2,3]){const {c}=campaignContext();c.level=level;const a=c.createGemini(0),b=c.createGemini(1),hp=220*(level===1?.82:level===3?1.18:1);assert.equal(a.hp,hp);assert.equal(b.hp,hp);assert.equal(c.geminiStatus().maxHp,hp*2);assert.equal(a.plates.length,6);assert.equal(b.plateHp.length,6);assert(a.spinSpeed*b.spinSpeed<0);a.plates[0]=false;assert(b.plates[0]);assert.equal(c.freezeResistance(a),.25);}
});
test('Gemini survivor enters last stand once, without restoring HP or stripped armor',()=>{
 const {c}=campaignContext();const a=c.createGemini(0);a.hp=0;assert.equal(c.updateGeminiEncounter(),false);const b=c.createGemini(1);b.hp=90;b.plates.fill(false);b.plateHp.fill(0);const speed=b.moveSpeed;assert(c.updateGeminiEncounter());assert.equal(b.phase,2);assert.equal(b.hp,90);assert(b.plates.every(p=>!p));assert.equal(b.moveSpeed,speed*1.35);assert.equal(c.updateGeminiEncounter(),false);const status=c.geminiStatus();assert.equal(status.alive,1);assert.equal(status.hp,90);assert(status.frenzy);b.hp=0;assert.equal(c.updateGeminiEncounter(),false);assert.equal(c.geminiStatus().hp,0);
});
test('Gemini pending partner does not look defeated and the spawn gap preserves wave totals',()=>{
 const {c}=campaignContext();c.campaignStageNumber=4;const a=c.createGemini(0);a.hp=0;assert.equal(c.geminiStatus().hp,220);assert.equal(c.geminiStatus().pending,1);assert.equal(c.nextCampaignSpawnDelay(12,39),2.2);assert.equal(c.nextCampaignSpawnDelay(12,38),.46);assert.equal(c.nextCampaignSpawnDelay(11,39),.40);
});
test('Magnetar binds both Gemini guardians and removes their durable plates and a quarter of maximum HP',()=>{
 const {c,tower}=magnetContext();const {c:factory}=campaignContext();const a=factory.createGemini(0),b=factory.createGemini(1);Object.assign(a,{x:40,y:0,progress:100});Object.assign(b,{x:80,y:0,progress:110});c.monsters=[a,b];assert(c.beginMagneticPair(tower));c.advanceMagnetar(5);assert.equal(a.hp,165);assert.equal(b.hp,165);assert(a.plateHp.every(p=>p===0));assert(b.plates.every(p=>!p));assert.equal(a.armor,0);assert.equal(b.armor,0);
});
test('Either Gemini guardian escaping defeats the core exactly once',()=>{
 for(const twin of [0,1]){const c=context();c.monsters=[{...enemy(1,0,100),miniBoss:true,stageBoss:'gemini',twin}];c.resolveEscapes();assert.equal(c.lives,0);assert.equal(c.escaped,1);c.resolveEscapes();assert.equal(c.escaped,1)}
});
test('Gemini renders both guardians, capture shields and Last Stand at portrait portal scales',()=>{
 const {c}=campaignContext();c.g=new Proxy({arc(x,y,r){assert(Number.isFinite(r)&&r>=0)}},{get:(t,k)=>t[k]||(()=>{})});vm.runInContext(extract('paintGemini'),c);
 for(const twin of [0,1]){const m=c.createGemini(twin);assert.doesNotThrow(()=>c.paintGemini(m,{x:10,y:20},.6));m.phase=2;m.grappleGuard=3;assert.doesNotThrow(()=>c.paintGemini(m,{x:10,y:20},1));}
});
console.log(count+' regression checks passed');
