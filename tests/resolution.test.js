import test from 'node:test';
import assert from 'node:assert/strict';
import {setCanvasResolution} from '../js/resolution.js';
function canvas(){const ctx={setTransform(...t){this.transform=t;}};return {width:1280,height:526,getContext:()=>ctx};}
test('Retina scenes use physical pixels without changing logical coordinates',()=>{const c=canvas();setCanvasResolution(c,1280,526,1,2);assert.deepEqual([c.width,c.height],[2560,1052]);assert.deepEqual(c.getContext().transform,[2,0,0,2,0,0]);assert.equal(c.getContext().imageSmoothingQuality,'high');});
test('viewport scaling and display changes resize the backing store',()=>{const c=canvas();setCanvasResolution(c,1280,526,1.5,2);assert.deepEqual([c.width,c.height],[3840,1578]);setCanvasResolution(c,1280,526,.5,2);assert.deepEqual([c.width,c.height],[1280,526]);});
test('unchanged dimensions do not reset the drawing surface',()=>{let writes=0;const ctx={setTransform(){}};const c={get width(){return 2560;},set width(v){writes++;},get height(){return 1052;},set height(v){writes++;},getContext:()=>ctx};setCanvasResolution(c,1280,526,1,2);assert.equal(writes,0);});
