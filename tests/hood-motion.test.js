import test from 'node:test';
import assert from 'node:assert/strict';
import {hoodMotion} from '../js/hood-motion.js';
test('hand stays attached to the hood rim throughout the pull',()=>{for(let t=.45;t<=1.1;t+=.01){const p=hoodMotion(t);assert.ok(Math.hypot(p.hand.x-p.grip.x,p.hand.y-p.grip.y)<1e-8);}});
test('hood waits for the hand and remains folded after release',()=>{assert.equal(hoodMotion(.4).dy,0);assert.equal(hoodMotion(2).dy,25);assert.equal(hoodMotion(2).scaleY,.25);assert.deepEqual(hoodMotion(2).hand,{x:118,y:132});});
