// Continuous two-bone inverse kinematics. During stance the foot stays fixed
// in world space; the swing foot follows a low arc, with no pose-sheet swaps.
export function drawGait(ctx,person,images){
 const female=person.kind==='woman',art=female?images.womanRig:images.manRig;
 const phase=(person.walk/1.35)%1,ground=205,hipX=108,hipY=ground-57-Math.cos(phase*Math.PI*4)*.65;
 const upperLength=32,lowerLength=30,span=person.v*1.35*.62;
 function segment(rect,sx,sy,ex,ey,sourceLength,pivotX,pivotY){
  const length=Math.hypot(ex-sx,ey-sy),scale=length/sourceLength;
  ctx.save();ctx.translate(sx,sy);ctx.rotate(Math.atan2(ey-sy,ex-sx)-Math.PI/2);
  ctx.drawImage(art,...rect,-pivotX*scale,-pivotY*scale,rect[2]*scale,rect[3]*scale);ctx.restore();
 }
 function leg(offset,back){
  const t=(phase+offset)%1;let fx,fy;
  if(t<.62){fx=span/2-span*t/.62;fy=0;}else{const u=(t-.62)/.38;fx=-span/2+span*(u*u*(3-2*u));fy=-8*Math.sin(Math.PI*u);}
  const ax=hipX+fx,ay=ground-7+fy,dx=ax-hipX,dy=ay-hipY;
  const distance=Math.min(upperLength+lowerLength-.05,Math.hypot(dx,dy));
  const angle=Math.atan2(dy,dx)-Math.acos(Math.max(-1,Math.min(1,(upperLength**2+distance**2-lowerLength**2)/(2*upperLength*distance))));
  const kx=hipX+Math.cos(angle)*upperLength,ky=hipY+Math.sin(angle)*upperLength;
  ctx.save();if(back)ctx.globalAlpha=.92;
  if(female){
   segment(back?[309,584,119,343]:[770,151,123,340],hipX,hipY,kx,ky,310,60,12);
   segment(back?[779,609,160,241]:[1206,167,165,242],kx,ky,ax,ay,253,47,12);
  }else{
   segment(back?[268,580,107,374]:[751,101,109,373],hipX,hipY,kx,ky,310,60,30);
   segment(back?[764,674,166,252]:[1216,193,155,253],kx,ky,ax,ay,232,44,30);
  }
  // Shoes have their own orientation: stance soles remain horizontal.
  // Position the actual sole at ground height, rather than rotating it with the calf.
  const shoe=female?(back?[779,827,160,130]:[1206,386,165,120]):(back?[764,914,166,73]:[1216,430,155,66]);
  const shoeScale=female?.112:.135,ankle=female?45:44;
  ctx.drawImage(art,...shoe,ax-ankle*shoeScale,ground+fy-shoe[3]*shoeScale,shoe[2]*shoeScale,shoe[3]*shoeScale);
  ctx.restore();
 }
 leg(.5,true);leg(0,false);
 // Keep the approved upper body stable, with only subtle weight transfer.
 ctx.save();ctx.translate(0,-Math.cos(phase*Math.PI*4)*.65);
 if(female){const img=images.womanEnd,sw=img.naturalWidth/4;ctx.drawImage(img,sw,0,sw,350,8,205-438*.435,sw*.435,350*.435);}
 else{ctx.drawImage(images.man,0,0,362,278,108-239*.415,205-347*.415,362*.415,278*.415);
 // Briefcase is a separate hanging detail, moving less than one degree.
 ctx.save();ctx.translate(108+(168-239)*.415,205+(230-347)*.415);ctx.rotate(Math.sin(phase*Math.PI*2)*.012);ctx.drawImage(images.man,130,215,100,94,(130-168)*.415,(215-230)*.415,100*.415,94*.415);ctx.restore();}
 ctx.restore();
}
