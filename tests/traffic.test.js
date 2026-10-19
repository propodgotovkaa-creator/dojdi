import test from 'node:test';
import assert from 'node:assert/strict';
import {trafficAt} from '../js/traffic.js';
test('taxi follows bus, then red car, with a repeating schedule',()=>{
 assert.deepEqual(trafficAt(0),{kind:'bus',time:3});
 assert.equal(trafficAt(9.999).kind,'bus');
 assert.deepEqual(trafficAt(10),{kind:'taxi',time:0});
 assert.equal(trafficAt(20.999).kind,'taxi');
 assert.deepEqual(trafficAt(21),{kind:'car',time:0});
 assert.deepEqual(trafficAt(32),{kind:'bus',time:0});
 assert.deepEqual(trafficAt(35),trafficAt(0));
});
