const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
export function hoodMotion(seconds){
 const reach=smooth(seconds/.45),pull=smooth((seconds-.45)/.65),release=smooth((seconds-1.1)/.55);
 const angle=-.35*pull,scaleY=1-.75*pull,dx=-13*pull,dy=25*pull;
 // This point is on the fabric rim: hand and cloth share one trajectory.
 const grip={x:111+dx+13*Math.cos(angle)+35*scaleY*Math.sin(angle),y:77+dy+13*Math.sin(angle)-35*scaleY*Math.cos(angle)};
 const hand={x:(118+(grip.x-118)*reach)*(1-release)+118*release,y:(132+(grip.y-132)*reach)*(1-release)+132*release};
 return {dx,dy,angle,scaleY,hand,grip};
}
