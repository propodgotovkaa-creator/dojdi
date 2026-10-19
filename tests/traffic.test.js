import test from 'node:test';
import assert from 'node:assert/strict';
import {trafficAt} from '../js/traffic.js';
test('each round has a bus followed by alternating red car and taxi',()=>{
 for(let round=0;round<11;round++){
  assert.deepEqual(trafficAt(0,round),{kind:'bus',time:3});
  assert.equal(trafficAt(9.999,round).kind,'bus');
  const kind=round%2?'taxi':'car';
  assert.deepEqual(trafficAt(10,round),{kind,time:0});
  assert.equal(trafficAt(20.999,round).kind,kind);
  assert.deepEqual(trafficAt(21,round),{kind:'bus',time:0});
  assert.deepEqual(trafficAt(24,round),trafficAt(0,round));
 }
});
