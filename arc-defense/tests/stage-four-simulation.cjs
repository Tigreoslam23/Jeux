// Runs the actual game loop without rendering. No browser or extra dependencies.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const start=source.indexOf("<script>(()=>{'use strict';")+8,end=source.indexOf("$('recommend').onclick=",start);
function game(){
 const nodes=new Map(),saved=new Map();
 const gradient={addColorStop(){}};
 const g=new Proxy({createLinearGradient:()=>gradient,createRadialGradient:()=>gradient},{get:(t,k)=>t[k]||(()=>{})});
 function node(){return {value:'',textContent:'',disabled:false,hidden:false,style:{},dataset:{},children:[],classList:{add(){},remove(){},toggle(){},contains(){return false}},getContext:()=>g,appendChild(){},append(){},replaceChildren(){},setAttribute(){},querySelector(){return this.id==='waveCountdownBanner'?node():null},querySelectorAll(){return []},addEventListener(){},focus(){},click(){}}}
 const get=id=>{if(!nodes.has(id))nodes.set(id,node());return nodes.get(id)};
 for(const [id,value] of Object.entries({level:'2',seed:'20261104',speed:'4',analysisType:'precision',analysisLevel:'2'}))get(id).value=value;
 const c=vm.createContext({console,Math,Set,Map,Uint16Array,URLSearchParams,location:{search:''},localStorage:{getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v)},document:{getElementById:get,createElement:node,querySelector:()=>node(),body:node(),addEventListener(){}},performance:{now:()=>1},window:{__arcLabManual:true,arcAudio:{mode(){},pause(){},effect(){}},matchMedia:()=>({matches:false})},setTimeout:()=>0,clearTimeout(){},requestAnimationFrame(){},arcWaveLocked:()=>false,towerPrices:{precision:80,rapid:90,pierce:125,elink:200,area:180,freeze:135,boom:175,grapple:155}});
 const exports=`
 draw=()=>{};
 const magnetStats={started:0,completed:0,cancelled:0,releases:[]};
 const originalMagnetStart=beginMagneticPair,originalMagnetEnd=endMagneticPair;
 beginMagneticPair=t=>{const ok=originalMagnetStart(t);if(ok)magnetStats.started++;return ok};
 endMagneticPair=(p,complete=false)=>{complete?magnetStats.completed++:magnetStats.cancelled++;const before=p.ids.map(id=>monsters.find(m=>m.id===id)).filter(Boolean);originalMagnetEnd(p,complete);if(complete)magnetStats.releases.push(before.map(m=>({hp:m.hp,maxHp:m.maxHp,armor:m.armor})));};
 globalThis.sim={
 init:()=>{campaignStageNumber=4;campaignProgress.cleared['1']=true;campaignProgress.cleared['2']=true;campaignProgress.cleared['3']=true;unlockCampaignTechnologies(8);build();firstWaveStarted=true;launchWave(true)},
 state:()=>({magnetStats,protected:monsters.filter(isMagnetProtected).map(m=>({id:m.id,pair:m.magnetId,hp:m.hp,progress:m.progress,frozen:m.frozen,grapple:!!m.grapple})),boss:monsters.filter(m=>m.stageBoss==='nexus').map(m=>({hp:m.hp,progress:m.progress,phase:m.phase,guard:m.grappleGuard,captured:!!m.grapple})),wave:waveNumber,playing,lives,kills,energy,unlocked:[...campaignProgress.unlocked],defenses:towers.map(t=>({type:t.type,lv:t.lv})),done:campaignProgress.cleared['4']===true,progress:Math.max(0,...monsters.map(m=>m.progress)),length:way.at(-1).dist}),
 scenario:()=>{campaignStageNumber=4;build();firstWaveStarted=true;waveIntroStart=revealSweepStart=0;playing=true;paused=false;autoWaveCountdown=-1;waveNumber=4;waveTotal=waveSpawned=3;
 const make=(id,progress,hp=100)=>({id,type:2,progress,hp,maxHp:hp,spin:0,spinSpeed:1,moveSpeed:1,plates:Array(6).fill(true),plateHp:Array(6).fill(4),armor:6});
 monsters=[make(1001,250),make(1002,280)];const magnet={type:'area',x:3,y:3,lv:1,cool:0};towers=[magnet];beginMagneticPair(magnet);monsters.push(make(1003,300,10000));
 towers.push(...['precision','rapid','pierce','boom','freeze','grapple'].map(type=>({type,x:3,y:3,lv:5,cool:0})),{type:'elink',x:1,y:2,end:{x:6,y:2},lv:5,cool:0});
 const p=monsterPosition(monsters[0]);shots=[{x:p.x,y:p.y,vx:0,vy:0,life:1.5,damage:1000,type:'precision',hitIds:new Set()}];},
 step:()=>animate((last||1)+50),
 best:(type,lv=1,from=0)=>{let best=null,score=-1;const samples=way.filter((p,i)=>i%3===0&&p.dist>=from);for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(!freeConstructionCell(x,y))continue;const cover=coverageMask(x,y,type,lv,samples).filter(Boolean).length;const spacing=towers.some(t=>Math.hypot(t.x-x,t.y-y)<1.8)?.6:1;if(cover*spacing>score){score=cover*spacing;best={x,y}}}return best},
 buy:(type,cell)=>{if(!technologyAvailable(type)||energy<towerPrices[type]||!cell||!freeConstructionCell(cell.x,cell.y))return false;const t={...cell,type,lv:1,cool:0,angle:0};if(type==='boom')t.boomAngle=fixedBoomAngle(t);towers.push(t);energy-=towerPrices[type];return true},
 upgrade:(type,max)=>{const t=towers.find(t=>t.type===type&&t.lv<max);if(!t)return false;const price=campaignUpgradeCost(t);if(energy<price)return false;energy-=price;t.lv++;return true},
 link:()=>{if(!technologyAvailable('elink')||energy<200)return false;let best=null,score=-1;const samples=way.filter((_,i)=>i%3===0);for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(!freeConstructionCell(x,y))continue;for(let yy=y;yy<H;yy++)for(let xx=0;xx<W;xx++){const a={x,y},b={x:xx,y:yy};if(!validELinkEnd(a,b))continue;const pa=ctr(a),pb=ctr(b);const n=samples.filter(p=>segmentClosest(pa,pb,p,p).dist<26).length;if(n>score){score=n;best={a,b}}}}if(!best)return false;towers.push({...best.a,end:best.b,type:'elink',lv:1,cool:0,angle:0});energy-=200;return true}
 };
 })();`;
 vm.runInContext(source.slice(start,end)+exports,c,{timeout:10000});return {sim:c.sim,saved};
}
const probe=game().sim;probe.scenario();probe.step();let initial=probe.state().protected;assert.equal(initial.length,2);
for(let i=0;i<20;i++){probe.step();const now=probe.state().protected;assert.equal(now.length,2);for(const m of now){const old=initial.find(a=>a.id===m.id);assert.equal(m.hp,old.hp,'External towers do not damage bound targets');assert(m.progress>old.progress,'Targets keep moving');assert(!m.frozen&&!m.grapple,'External control is excluded');}initial=now;}
for(let i=0;i<6;i++)probe.step();const released=probe.state().magnetStats.releases[0];assert.equal(released.length,2);assert(released.every(m=>m.hp===75&&m.armor===0));console.log('PASS real combat: moving targets are isolated from all seven other tower families, then stripped and damaged');
const {sim,saved}=game();sim.init();
let state=sim.state();assert.equal(state.wave,1);assert.equal(state.energy,650);
// Visibility samples are for player-visible analysis; reveal them through real movement first.
sim.buy('precision',sim.best('precision',2));sim.buy('rapid',sim.best('rapid',2));sim.link();
let lastWave=0,lastBoss=null,sawOverdrive=false,sawGrappleShield=false,priorProtected=new Map();
for(let i=0;i<40000;i++){
 state=sim.state();for(const m of state.protected){const old=priorProtected.get(m.id);if(old&&old.pair===m.pair){assert.equal(m.hp,old.hp);assert(m.progress>=old.progress);assert(!m.frozen&&!m.grapple)}}priorProtected=new Map(state.protected.map(m=>[m.id,m]));if(state.boss.length){lastBoss=state.boss[0];sawOverdrive ||= lastBoss.phase===2;sawGrappleShield ||= lastBoss.guard>0;while(sim.upgrade('elink',4)){}}if(state.lives<=0||state.done)break;
 if(state.wave!==lastWave){
  lastWave=state.wave;
  if(state.wave>=1&&!state.defenses.some(t=>t.type==='freeze'))sim.buy('freeze',sim.best('freeze',2));
  if(state.wave>=2&&!state.defenses.some(t=>t.type==='elink'))sim.link();
  if(state.wave>=2&&!state.defenses.some(t=>t.type==='grapple'))sim.buy('grapple',sim.best('grapple',2));
  if(state.wave>=3&&!state.defenses.some(t=>t.type==='boom'))sim.buy('boom',sim.best('boom',3));
  if(state.wave>=6&&state.defenses.filter(t=>t.type==='rapid').length<2)sim.buy('rapid',sim.best('rapid',3));
  if(state.wave>=8&&state.defenses.filter(t=>t.type==='freeze').length<2)sim.buy('freeze',sim.best('freeze',3));
  if(state.wave>=9&&state.defenses.filter(t=>t.type==='elink').length<2)sim.link();
  if(state.wave>=1&&!state.defenses.some(t=>t.type==='area'))sim.buy('area',sim.best('area',2));
  for(const [type,level] of [['precision',3],['area',2],['freeze',2],['rapid',3],['grapple',2],['elink',2],['area',3],['precision',4],['freeze',3],['grapple',3],['elink',3],['area',4],['rapid',4],['precision',5],['freeze',4],['grapple',4],['rapid',5],['boom',4],['grapple',5],['elink',4],['area',5],['boom',5]])while(sim.upgrade(type,level)){}
  console.log('Wave',state.wave,'core',state.lives,'energy',sim.state().energy);
 }
 sim.step();
}
state=sim.state();console.log(JSON.stringify({...state,magnetStats:{started:state.magnetStats.started,completed:state.magnetStats.completed,cancelled:state.magnetStats.cancelled}}));console.log({lastBoss});
assert(state.done,'A legal sample defense can finish Stage 04');assert(state.magnetStats.completed>0,'Magnetar completes real cycles');
assert.equal(state.kills+20-state.lives,428);
assert(saved.has('arc_campaign_v1'));assert.equal(saved.has('arc_defense_v1_best'),false);
console.log('PASS real Stage 04 loop: twelve waves, elite finish and Magnetar, earned budget and isolated progress');
