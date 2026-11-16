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
 const realDraw=draw,realTunnel=underTunnel;draw=()=>{};
 globalThis.sim={
  reset:()=>{campaignStageNumber=6;unlockCampaignTechnologies(8);build();waveNumber=1;playing=true;paused=false;waveSpawned=0;waveTotal=999;waveDelay=99999;autoWaveCountdown=-1;waveIntroStart=revealSweepStart=0;},
  setup:(enemies,defenses)=>{monsters=enemies;towers=defenses;},
  enemies:()=>monsters,towers:()=>towers,
  enemy:(id,progress=120,extra={})=>({id,progress,type:2,spin:0,hp:20,maxHp:20,moveSpeed:1,spinSpeed:1,reward:20,plates:Array(6).fill(true),armor:6,...extra}),
  tower:(type='maw',lv=1,extra={})=>({x:4,y:4,type,lv,cool:0,angle:0,...extra}),
  point:monsterPosition,origin:posAt,center:ctr,
  capture:beginMawCapture,end:endMawCapture,prepare:prepareMaw,advance:advanceMaw,cancel:cancelMawForTower,
  protect:isMagnetProtected,magnet:beginMagneticPair,grapple:canGrapple,
  hit:(m)=>applyGeometricHit({m,kind:'heart',x:0,y:0},100),
  spec:towerSpec,price:campaignUpgradeCost,status:mawStatus,
  step:()=>animate((last||1)+50),speed:value=>$('speed').value=String(value),
  pause:value=>paused=value,
  state:()=>({playing,paused,kills,energy,lives,wave:waveNumber,length:way.at(-1).dist}),
  raw:()=>{draw=realDraw;try{draw()}finally{draw=()=>{}}},
  drawMaw:paintMaw,drawCaptives:paintMawCaptives,visual:mawGrindVisual,drawDebris:paintMawDebris,particles:()=>particles,
  upgrade:t=>{const cost=campaignUpgradeCost(t);if(energy<cost)return false;energy-=cost;t.lv++;return true},
  setEnergy:v=>energy=v,
  buy:(t)=>{if(energy<220||!technologyAvailable('maw'))return false;towers.push(t);energy-=220;return true},
  blocked:value=>underTunnel=value?()=>true:realTunnel,
  available:()=>technologyAvailable('maw'),
  route:()=>way,tech:()=>campaignProgress.unlocked
 };
 })();`;
 vm.runInContext(source.slice(start,end)+exports,c,{timeout:10000});return {sim:c.sim,saved};
}
let checks=0;function check(name,fn){fn();checks++;console.log('PASS '+name)}
function fixture(){const {sim}=game();sim.reset();sim.speed(1);return sim}
function adjacent(sim,id=1,extra={}){const t=sim.tower(),tc=sim.center(t),p=sim.route().reduce((a,b)=>Math.hypot(a.x-tc.x,a.y-tc.y)<Math.hypot(b.x-tc.x,b.y-tc.y)?a:b);return {t,m:sim.enemy(id,p.dist,extra)}}
check('Maw migrates into campaign technologies and costs 220 energy',()=>{
 const s=fixture();assert(s.available());assert(s.tech().includes('maw'));const before=s.state().energy;assert(s.buy(s.tower()));assert.equal(s.state().energy,before-220);
});
check('only one available enemy is captured, following selected target priority',()=>{
 const s=fixture(),{t,m}=adjacent(s);const other={...m,id:2,progress:m.progress-3};s.setup([m,other],[t]);assert(s.capture(t));assert(m.maw);assert(!other.maw);assert(!s.capture(t));assert.equal(t.mawTarget,m.id);
});
check('absorption shrinks toward the tower and preserves path progress',()=>{
 const s=fixture(),{t,m}=adjacent(s);s.setup([m],[t]);const progress=m.progress,from=s.point(m),tc=s.center(t);s.capture(t);s.advance(.4);const p=s.point(m);assert(Math.hypot(p.x-tc.x,p.y-tc.y)<Math.hypot(from.x-tc.x,from.y-tc.y));assert.equal(m.progress,progress);s.advance(.4);assert.deepEqual(s.point(m),tc);assert.equal(m.hp,20);
});
check('a captive is immune to direct hits, grapples and other Magnetars',()=>{
 const s=fixture(),{t,m}=adjacent(s);const other={...m,id:2};s.setup([m,other],[t,s.tower('area')]);s.capture(t);assert(s.protect(m));assert(!s.hit(m));assert.equal(m.hp,20);assert(!s.grapple(m));assert(!s.magnet(s.towers()[1]));assert(!other.magnetId);
});
check('grappled, bound, escaped, dead, out-of-range and finished targets are rejected',()=>{
 for(const extra of [{grapple:{}},{magnetId:4},{mawGuard:2},{hp:0},{escaped:true},{progress:1e8}]){
  const s=fixture(),{t,m}=adjacent(s,1,extra);s.setup([m],[t]);assert(!s.capture(t),JSON.stringify(extra));
 }
 const s=fixture(),t=s.tower(),m=s.enemy(9,0);t.x=15;t.y=8;s.setup([m],[t]);assert(!s.capture(t));
});
check('ordinary monsters are eliminated after full digestion and recovery starts then',()=>{
 const s=fixture(),{t,m}=adjacent(s);s.setup([m],[t]);s.capture(t);s.advance(6.79);assert(m.maw);assert.equal(m.hp,20);s.advance(.01);assert.equal(m.hp,0);assert(!m.maw);assert.equal(t.cool,12);s.prepare(1);assert.equal(t.cool,11);assert.equal(t.mawTarget,undefined);
});
check('selling during digestion frees the prey without damage or a teleport',()=>{
 const s=fixture(),{t,m}=adjacent(s);s.setup([m],[t]);const start=m.progress;s.capture(t);s.advance(2);s.cancel(t);assert.equal(m.hp,20);assert(!m.maw);assert.equal(m.progress,start);assert.deepEqual(s.point(m),s.origin(start));assert(!s.protect(m));assert.equal(t.cool,12);
});
check('missing towers cancel safely and two Maws cannot share a captive',()=>{
 const s=fixture(),{t,m}=adjacent(s),t2={...t};s.setup([m],[t,t2]);assert(s.capture(t));assert(!s.capture(t2));s.setup([m],[t2]);s.advance(1);assert(!m.maw);assert.equal(m.hp,20);assert.equal(t.mawTarget,undefined);
});
check('bosses and minibosses lose exactly 12% max HP then return with 8s resistance',()=>{
 for(const kind of ['boss','miniBoss']){
  const s=fixture(),{t,m}=adjacent(s,1,{[kind]:true,hp:500,maxHp:600,plateHp:Array(6).fill(6)});s.setup([m],[t]);const start=m.progress;s.capture(t);s.advance(3.19);assert.equal(m.hp,500);s.advance(.01);assert.equal(m.hp,428);assert(!m.maw);assert.equal(m.progress,start);assert.equal(m.mawGuard,8);assert.deepEqual(m.plateHp,Array(6).fill(6));t.cool=0;assert(!s.capture(t));s.prepare(7.99);assert(!m.maw);s.prepare(.02);assert(m.maw);
 }
});
check('five levels improve digestion/range while retaining slow recharge and one target',()=>{
 const s=fixture();for(let lv=1;lv<=5;lv++){const t=s.tower('maw',lv),sp=s.spec(t);assert.equal(sp.digestion,6-(lv-1)*.5);assert.equal(sp.rate,12-(lv-1)*.5);assert.equal(sp.damage,0)}
 const t=s.tower('maw',5);t.specialization='power';assert.equal(s.spec(t).rate,8.2);t.specialization='reach';assert.equal(s.spec(t).range,4.026);
});
check('an upgrade preserves an active digestion snapshot',()=>{
 const s=fixture(),{t,m}=adjacent(s);s.setup([m],[t]);s.setEnergy(1000);s.capture(t);assert(s.upgrade(t));assert.equal(t.lv,2);assert.equal(m.maw.digestion,6);assert.equal(m.maw.recovery,12);s.advance(6.8);assert.equal(t.cool,12);
});
check('real frames freeze captive progress, respect pause/speed, and award one kill and reward',()=>{
 const s=fixture(),{t,m}=adjacent(s);s.setup([m],[t]);const start=m.progress,before=s.state();s.step();assert(m.maw);assert.equal(m.progress,start);const age=m.maw.age;s.pause(true);for(let i=0;i<20;i++)s.step();assert.equal(m.maw.age,age);s.pause(false);s.speed(2);s.step();assert(Math.abs(m.maw.age-age-.1)<1e-8);s.speed(1);
 for(let i=0;i<150;i++)s.step();assert.equal(s.state().kills,before.kills+1);assert.equal(s.state().energy,before.energy+20);assert(!s.enemies().includes(m));for(let i=0;i<20;i++)s.step();assert.equal(s.state().kills,before.kills+1);
});
check('renderers run in ready, absorption, digestion, boss and recovery states',()=>{
 const s=fixture(),{t,m}=adjacent(s);s.setup([m],[t]);s.drawMaw(t);s.capture(t);s.advance(.3);s.raw();s.advance(1);s.raw();s.advance(5.5);s.raw();s.drawMaw(t);
});

check('a released boss resumes its original route during resistance',()=>{
 const s=fixture(),{t,m}=adjacent(s,1,{boss:true,hp:500,maxHp:600});s.setup([m],[t]);s.capture(t);s.advance(3.2);const p=m.progress;for(let i=0;i<10;i++)s.step();assert(m.progress>p);assert(!m.maw);assert(m.mawGuard>7);
});


check('a tunnel-covered enemy cannot be swallowed',()=>{
 const s=fixture(),{t,m}=adjacent(s);s.setup([m],[t]);s.blocked(true);assert(!s.capture(t));s.blocked(false);assert(s.capture(t));
});


check('the larger captive is visibly squeezed when the jaw closes',()=>{
 const s=fixture(),{t,m}=adjacent(s);s.setup([m],[t]);s.capture(t);m.maw.age=.8;
 const open=s.visual(m);m.maw.age=.8+1/(4*1.65);const closed=s.visual(m);
 assert(open.scaleX>=.8);assert(closed.gap<open.gap-10);assert(closed.scaleY<open.scaleY*.4);assert(closed.scaleX>closed.scaleY);assert(closed.pressure>.99);
});
check('grinding visuals follow simulation time and never alter combat state',()=>{
 const s=fixture(),{t,m}=adjacent(s);s.setup([m],[t]);s.capture(t);s.advance(2);
 const before=JSON.stringify({m,t,game:s.state(),particles:s.particles()}),visual=s.visual(m);
 for(let i=0;i<20;i++){s.drawMaw(t);s.drawCaptives();s.drawDebris()}
 assert.equal(JSON.stringify({m,t,game:s.state(),particles:s.particles()}),before);
 assert.deepEqual(s.visual(m),visual);s.pause(true);s.step();assert.deepEqual(s.visual(m),visual);
});
check('all grinding frames retain finite positive scales for regular enemies and bosses',()=>{
 for(const boss of [false,true]){
  const s=fixture(),{t,m}=adjacent(s,1,{boss});s.setup([m],[t]);s.capture(t);
  const end=m.maw.absorb+m.maw.digestion;for(let age=0;age<end;age+=.037){
   m.maw.age=age;const v=s.visual(m);assert(Number.isFinite(v.scaleX)&&v.scaleX>0);assert(Number.isFinite(v.scaleY)&&v.scaleY>0);assert(v.gap>=7&&v.gap<=19);s.drawMaw(t);s.drawCaptives();
  }
 }
});
check('finishing debris reuses the existing completion burst without new particles',()=>{
 const s=fixture(),{t,m}=adjacent(s);s.setup([m],[t]);s.capture(t);s.advance(6.8);
 const before=JSON.stringify(s.particles());for(let i=0;i<20;i++)s.drawDebris();assert.equal(JSON.stringify(s.particles()),before);
});

console.log(checks+' Maw checks passed');
