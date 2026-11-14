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
 ctx.update=()=>ctx.updates++;
 ctx.monsterPosition=m=>({x:m.x,y:m.y,hidden:m.hidden});
 ctx.posAt=p=>({x:p,y:0});ctx.ctr=t=>({x:t.x,y:t.y});ctx.underTunnel=p=>!!p.hidden;
 ctx.enemyGeometry=()=>[];
 ctx.applyGeometricHit=(hit,damage)=>{ctx.hits.push({id:hit.m.id,damage});hit.m.hp-=damage;return true};
 for(const name of ['segmentClosest','geometricHits','sortTargets','boomPoint','boomSegments','launchBoomSalve','advanceBoomerangs','resolveEscapes'])vm.runInContext(extract(name),ctx);
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
console.log(count+' regression checks passed');
