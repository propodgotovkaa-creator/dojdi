// Logical game coordinates stay fixed; the backing store follows physical pixels.
export function setCanvasResolution(canvas,width,height,displayScale=1,pixelRatio=1){
 const density=Math.max(1,Math.min(4,displayScale*pixelRatio));
 const w=Math.round(width*density),h=Math.round(height*density);
 if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
 const ctx=canvas.getContext('2d');
 ctx.setTransform(w/width,0,0,h/height,0,0);
 ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
 return density;
}
