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
console.log(count+' regression checks passed');
