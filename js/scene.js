import {trafficAt} from './traffic.js?v=12';
import {drawGait} from './gait.js?v=11';
// Approved scene assets; all movement is time-based and frame-rate independent.
export function createScene(canvas, images){
const ctx=canvas.getContext('2d'),W=1280,H=526,characterScale=.88;
const {city:bg,clouds:cloudArt,car:carArt,taxi:taxiArt,bus:busArt,heroParts}=images;
let wet=1,target=1,elapsed=0,completed=false,celebration=0,activeKind='woman',lastRound=false,currentRound=0,trafficElapsed=0;
// Feather the cloud groups at source resolution, avoiding rectangular cut edges.
const cloudGroups=[0,1].map(side=>{
 const layer=document.createElement('canvas');
 layer.width=cloudArt.naturalWidth;layer.height=cloudArt.naturalHeight;
 const brush=layer.getContext('2d');
 brush.drawImage(cloudArt,0,0);
 brush.globalCompositeOperation='destination-in';
 const mask=brush.createLinearGradient(layer.width*.30,0,layer.width*.70,0);
 mask.addColorStop(0,side?'transparent':'#fff');
 mask.addColorStop(1,side?'#fff':'transparent');
 brush.fillStyle=mask;brush.fillRect(0,0,layer.width,layer.height);
 return layer;
});
const drops=Array.from({length:1150},(_,i)=>({x:Math.random()*W,y:Math.random()*H,z:i%3,threshold:Math.random(),speed:560+Math.random()*460,len:12+Math.random()*24}));
let rings=[],spawn=0;
const people=[{kind:'woman',x:140,walk:0,v:96,end:-1,hood:-1,pose:0},{kind:'man',x:690,walk:0,v:104,end:-1,hood:-1,pose:0}];
// Draw heroes directly into the high-density scene: no low-resolution intermediate.
function drawPeople(dt){
 for(const p of people){
  if(p.kind!==activeKind)continue;
  if(p.end<0&&completed){p.end=0;p.hood=-1;}
  if(p.end>=0){
   p.end+=dt;
   const t=Math.min(1,p.end/.7);
   p.motion=1-t*t*(3-2*t);
   p.walk+=dt*p.motion;p.x+=p.v*dt*p.motion*characterScale;
   if(p.hood<0&&wet<=.08)p.hood=0;
   if(p.hood>=0)p.hood+=dt;
  }else{p.motion=1;p.walk+=dt;p.x+=p.v*dt*characterScale;if(p.x>W+5)p.x=-165;}
  ctx.save();ctx.translate(p.x+108,H*.825);ctx.scale(characterScale,characterScale);ctx.translate(-108,-205);drawGait(ctx,p,images);ctx.restore();
 }
}
function draw(dt){
 elapsed+=dt;trafficElapsed+=dt;wet+=(target-wet)*(1-Math.exp(-dt/1.8));if(Math.abs(target-wet)<.003)wet=target;
 if(completed)celebration+=dt;
ctx.clearRect(0,0,W,H);if(bg.complete&&bg.naturalWidth)ctx.drawImage(bg,0,0,W,H);else{ctx.fillStyle='#a5c8d8';ctx.fillRect(0,0,W,H);}
ctx.fillStyle='rgba(39,57,77,'+(wet*.46)+')';ctx.fillRect(0,0,W,H);
const sun=Math.max(0,1-wet*4);ctx.save();ctx.globalAlpha=sun;let glow=ctx.createRadialGradient(900,105,20,900,105,145);glow.addColorStop(0,'rgba(255,230,147,.8)');glow.addColorStop(1,'rgba(255,230,147,0)');ctx.fillStyle=glow;ctx.fillRect(745,0,310,270);ctx.fillStyle='#ffe6a1';ctx.beginPath();ctx.arc(900,105,36,0,7);ctx.fill();ctx.restore();
const spread=(1-wet)*650;
if(cloudArt.complete&&cloudArt.naturalWidth){
ctx.save();ctx.globalAlpha=.18+wet*.38;ctx.drawImage(cloudArt,-60+Math.sin(elapsed*.055)*14,-160,1400,420);ctx.restore();
for(let side=0;side<2;side++){
ctx.save();ctx.globalAlpha=.65+wet*.35;
const drift=(side===0?-1:1)*spread+Math.sin(elapsed*.08+side)*9;
ctx.translate(drift,0);
ctx.drawImage(cloudGroups[side],0,-105,W,380);ctx.restore();
}}

ctx.fillStyle='rgba(222,233,230,'+(wet*.13)+')';ctx.fillRect(0,180,W,420);

drawPeople(dt);
const traffic=trafficAt(trafficElapsed,currentRound),trafficTime=traffic.time;
const vehicleArt=traffic.kind==='taxi'?taxiArt:carArt;
if(traffic.kind!=='bus'&&vehicleArt?.complete&&vehicleArt.naturalWidth){
const scale=.16,velocity=168,cx=trafficTime*velocity-340,ground=H*.955,cy=ground-740*scale;
const wheelY=cy+580*scale,rad=160*scale;
ctx.save();ctx.fillStyle='rgba(30,43,49,.18)';ctx.beginPath();ctx.ellipse(cx+770*scale,ground-2,140,7,0,0,7);ctx.fill();ctx.restore();
for(const wx of [335,1260]){
ctx.save();ctx.translate(cx+wx*scale,wheelY);ctx.rotate(elapsed*velocity/rad);ctx.beginPath();ctx.arc(0,0,rad,0,7);ctx.clip();ctx.drawImage(vehicleArt,607,666,322,326,-rad,-rad,rad*2,rad*2);ctx.restore();
}
ctx.save();ctx.translate(cx,cy+Math.sin(elapsed*7)*.8+Math.sin(elapsed*11)*.3);ctx.drawImage(vehicleArt,0,0,1536,640,0,0,1536*scale,640*scale);ctx.restore();
for(const wx of [335,1260]){for(let j=0;j<13;j++){
const life=(elapsed*2.8+j/13)%1,back=life*(18+(j%4)*9),height=Math.sin(life*Math.PI)*(6+j%5*3);
ctx.fillStyle='rgba(205,230,238,'+((1-life)*(.22+wet*.4))+')';ctx.beginPath();ctx.ellipse(cx+wx*scale-back,ground-height,1.3+(j%3)*.4,.7+(j%2)*.4,life,0,7);ctx.fill();
}}
}
if(busArt.complete&&busArt.naturalWidth&&traffic.kind==='bus'){
const scale=.195,velocity=140,cx=W+35-trafficTime*velocity,ground=H*.945,cy=ground-790*scale,rad=138*scale;
ctx.save();ctx.fillStyle='rgba(30,43,49,.15)';ctx.beginPath();ctx.ellipse(cx+768*scale,ground-2,185,7,0,0,7);ctx.fill();ctx.restore();
for(const wx of [376,1157]){
ctx.save();ctx.translate(cx+wx*scale,cy+652*scale);ctx.rotate(-elapsed*velocity/rad);ctx.beginPath();ctx.arc(0,0,rad,0,7);ctx.clip();ctx.drawImage(busArt,644,722,244,244,-rad,-rad,rad*2,rad*2);ctx.restore();
}
ctx.save();ctx.translate(cx,cy+Math.sin(elapsed*5)*.55);ctx.drawImage(busArt,0,0,1536,700,0,0,1536*scale,700*scale);ctx.restore();
for(const wx of [376,1157])for(let j=0;j<16;j++){
const life=(elapsed*2.6+j/16)%1,back=life*(22+j%4*10),height=Math.sin(life*Math.PI)*(6+j%5*3);
ctx.fillStyle='rgba(205,230,238,'+((1-life)*(.22+wet*.4))+')';ctx.beginPath();ctx.ellipse(cx+wx*scale+back,ground-height,1.3+j%3*.4,.7+j%2*.4,life,0,7);ctx.fill();
}
}
for(const d of drops){d.y+=dt*d.speed*(.65+d.z*.25);d.x-=dt*(70+d.z*15);if(d.y>H+30){d.y=-30;d.x=Math.random()*(W+80);}if(d.x<-40)d.x=W+30;const a=Math.min(1,Math.max(0,(wet-d.threshold)*10));if(!a)continue;ctx.strokeStyle='rgba(229,240,244,'+(a*(.22+d.z*.17))+')';ctx.lineWidth=.75+d.z*.5;ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(d.x+3+d.z*2,d.y-d.len*(.7+d.z*.4));ctx.stroke();}
spawn+=dt*wet*145;while(spawn>=1){spawn--;rings.push({x:Math.random()*W,y:H*(.87+Math.random()*.12),age:0,life:.7+Math.random()*.7,r:10+Math.random()*18});}rings=rings.filter(r=>r.age<r.life);for(const r of rings){r.age+=dt;const p=r.age/r.life;ctx.strokeStyle='rgba(213,235,240,'+((1-p)*.65)+')';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(r.x,r.y,1+p*r.r,.8+p*r.r*.22,0,0,7);ctx.stroke();if(p<.25){ctx.beginPath();ctx.moveTo(r.x-4*p,r.y-14*p);ctx.lineTo(r.x,r.y);ctx.lineTo(r.x+8*p,r.y-18*p);ctx.stroke();}}

if(completed&&wet<.08){
 const a=Math.min(1,(.08-wet)*15);ctx.save();ctx.globalAlpha=a;
 // Subtle glints on the water remain after the storm.
 for(let i=0;i<8;i++){const x=100+i*150,y=H*.93+Math.sin(i*2)*15,r=2+Math.sin(elapsed*2+i);ctx.strokeStyle='rgba(255,248,210,.55)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x-r,y);ctx.lineTo(x+r,y);ctx.moveTo(x,y-r);ctx.lineTo(x,y+r);ctx.stroke();}ctx.restore();
}
if(lastRound&&completed&&wet<.08){
 ctx.save();ctx.globalAlpha=Math.min(.28,(.08-wet)*4);
 const colors=['#e6b09b','#ecd398','#e9e3a9','#afcba4','#a1c9cc'];
 for(let i=0;i<colors.length;i++){ctx.strokeStyle=colors[i];ctx.lineWidth=6;ctx.beginPath();ctx.ellipse(620,210,310-i*7,180-i*6,0,Math.PI,Math.PI*2);ctx.stroke();}
 ctx.restore();
}
}
return {
 draw,
 progress(found,total){target=1-found/total;if(found===total)completed=true;},
 reset(round=0){currentRound=round;trafficElapsed=0;activeKind=round%2?'man':'woman';lastRound=round===10;completed=false;celebration=0;target=1;for(const p of people){p.x=300;p.end=-1;p.hood=-1;p.walk=0;p.motion=1;}},
 get activeCharacter(){return activeKind;},
 get intensity(){return wet;},
 get finished(){return completed&&wet<.015&&people.filter(p=>p.kind===activeKind).every(p=>p.hood>=(p.kind==='man'?1.74:2.38))&&celebration>4;}
};
}
