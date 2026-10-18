import {WALK_DURATION,WALK_SPEED,JOINTS,WALK_FRAMES} from './walk-data.js';
export const CYCLE=WALK_DURATION,GROUND=205;
const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
const mix=(a,b,t)=>a+(b-a)*t;
// Retarget the recorded 3D walk in side view; do not synthesize knee motion.
export function sampleWalk(time){
 const phase=((time/CYCLE)%1+1)%1,index=phase*WALK_FRAMES.length,i=Math.floor(index),u=index-i;
 const a=WALK_FRAMES[i],b=WALK_FRAMES[(i+1)%WALK_FRAMES.length];
 const joints=Object.fromEntries(JOINTS.map((name,j)=>[name,{x:108+mix(a[j][0],b[j][0],u)*5.2,y:205-mix(a[j][1],b[j][1],u)*5.2}]));
 for(const side of ['Left','Right']){const foot=joints[side+'Foot'],toe=joints[side+'ToeBase'];foot.angle=Math.atan2(toe.y-foot.y,toe.x-foot.x)-.34;}
 // Align the lowest actual sole with the pavement, retaining captured body motion.
 const sole=f=>Math.max(...[-5,13].map(x=>f.y+x*Math.sin(f.angle)+6*Math.cos(f.angle)));
 const shift=GROUND-Math.max(sole(joints.LeftFoot),sole(joints.RightFoot));
 for(const j of Object.values(joints))j.y+=shift;
 return joints;
}
export function drawGait(ctx,p,images){
 const female=p.kind==='woman',motion=p.motion??1,reaction=smooth((p.hood??-1)/1.7);
 const joints=sampleWalk(p.walk*(p.v/WALK_SPEED));
 const rest={LeftUpLeg:[105,122],LeftLeg:[105,160],LeftFoot:[103,199],RightUpLeg:[111,122],RightLeg:[113,160],RightFoot:[114,199],LeftArm:[103,85],LeftForeArm:[101,110],LeftHand:[105,132],RightArm:[110,85],RightForeArm:[112,110],RightHand:[117,132]};
 for(const [name,xy] of Object.entries(rest)){const j=joints[name];j.x=mix(xy[0],j.x,motion);j.y=mix(xy[1],j.y,motion);if('angle'in j)j.angle*=motion;}
 const bob=(joints.LeftArm.y+joints.RightArm.y)/2-85,bodyX=(joints.LeftUpLeg.x+joints.RightUpLeg.x)/2-108;
 const coat=female?'#d4a547':'#4f7b88',coatDark=female?'#b88b36':'#416675';
 const pants=female?'#45576a':'#786653',darkPants=female?'#364757':'#625343',skin='#e7b68f';
 function stroke(points,color,width){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(...points[0]);for(const v of points.slice(1))ctx.lineTo(...v);ctx.stroke();}
 function leg(back){
  const side=back?'Left':'Right',hip=joints[side+'UpLeg'],k=joints[side+'Leg'],f=joints[side+'Foot'],color=back?darkPants:pants;
  stroke([[hip.x,hip.y],[k.x,k.y]],color,11);
  stroke([[k.x,k.y],[f.x,f.y-1]],color,8);
  ctx.save();ctx.translate(f.x,f.y);ctx.rotate(f.angle);
  ctx.fillStyle=back?'#313b3c':'#3d4847';ctx.beginPath();ctx.moveTo(-5,-3);ctx.quadraticCurveTo(0,-5,4,0);ctx.lineTo(11,2);ctx.quadraticCurveTo(15,3,13,6);ctx.lineTo(-5,6);ctx.closePath();ctx.fill();
  stroke([[-4,6],[12,6]],'#c7bda4',1.5);ctx.restore();
 }
 function arm(back){
  const side=back?'Left':'Right',shoulder=joints[side+'Arm'],elbow=joints[side+'ForeArm'],hand=joints[side+'Hand'];
  // Anchor the sleeve at the illustrated shoulder; retain captured arm articulation.
  const sx=107+bodyX+(back?-3:0),sy=87+bob;
  let ex=sx+elbow.x-shoulder.x,ey=sy+elbow.y-shoulder.y,hx=sx+hand.x-shoulder.x,hy=sy+hand.y-shoulder.y;
  if(female&&!back){ex=sx+8;ey=sy+24;hx=134+bodyX;hy=106+bob;}
  if(!back&&!female){const gesture=Math.sin(Math.PI*reaction);ex=mix(ex,135+bodyX,gesture);ey=mix(ey,102+bob,gesture);hx=mix(hx,120+bodyX,gesture);hy=mix(hy,55+bob,gesture);}
  stroke([[sx,sy],[ex,ey]],back?coatDark:coat,12);stroke([[ex,ey],[hx,hy]],back?coatDark:coat,10);
  stroke([[hx,hy],[hx+1,hy+4]],skin,7);
 }
 // Ground shadow stays still while the body shifts weight above it.
 ctx.fillStyle='rgba(25,44,43,.15)';ctx.beginPath();ctx.ellipse(110,207,26,3.2,0,0,Math.PI*2);ctx.fill();
 leg(true);arm(true);leg(false);
 const art=images.heroParts;
 // Source rectangles are the four isolated, newly drawn puppet parts.
 const parts=female?{head:[206,41,422,432],body:[1002,12,268,487]}:{head:[233,542,376,424],body:[1004,512,279,505]};
 function body(image,alpha){ctx.save();ctx.globalAlpha*=alpha;ctx.drawImage(image,...parts.body,90+bodyX,74+bob,39,female?68:58);ctx.restore();}
 function head(image,alpha){ctx.save();ctx.globalAlpha*=alpha;ctx.translate(111+bodyX,77+bob);ctx.rotate(-reaction*.10);
  if(female)ctx.drawImage(image,...parts.head,-23,-40,38,42);
  else ctx.drawImage(image,200,512,440,475,-26.34,-42.97,44.47,47.05);
  ctx.restore();
 }
 if(female){body(art,1);head(art,1);}else{
  const reveal=smooth((reaction-.25)/.5),rainArt=images.heroHood||art;
  // Align both drawings in the same atlas coordinates to avoid head-size changes.
  body(rainArt,1-reveal);body(art,reveal);head(rainArt,1-reveal);head(art,reveal);
 }
 arm(false);
 if(female){
  ctx.save();ctx.translate(134+bodyX,106+bob);ctx.rotate(reaction*.13);
  stroke([[0,4],[0,-78]],'#665f50',1.6);
  ctx.strokeStyle='#665f50';ctx.lineWidth=2;ctx.beginPath();ctx.arc(-4,5,4,0,Math.PI);ctx.stroke();
  const spread=mix(51,6,reaction),top=-77,bottom=mix(-54,-21,reaction);
  ctx.fillStyle='#ece0bc';ctx.beginPath();ctx.moveTo(-spread,bottom);ctx.bezierCurveTo(-spread*.7,top-19,spread*.7,top-19,spread,bottom);ctx.quadraticCurveTo(spread*.5,bottom-8,0,bottom);ctx.quadraticCurveTo(-spread*.5,bottom-8,-spread,bottom);ctx.fill();
  ctx.strokeStyle='#c7ba96';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,top-8);ctx.quadraticCurveTo(-spread*.3,top-1,-spread*.33,bottom-3);ctx.moveTo(0,top-8);ctx.quadraticCurveTo(spread*.3,top-1,spread*.33,bottom-3);ctx.stroke();ctx.restore();
 }
}
