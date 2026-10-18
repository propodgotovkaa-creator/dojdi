import test from 'node:test';
import assert from 'node:assert/strict';
import {rounds,selectWord,shuffle} from '../js/rounds.js';
test('11 complete, unambiguous word sets with no duplicates',()=>{assert.equal(rounds.length,11);for(const r of rounds){assert.equal(r.answers.length,5);assert.equal(r.distractors.length,7);assert.equal(new Set([...r.answers,...r.distractors]).size,12);}assert.deepEqual(rounds[1].answers,['МЕДУЗА','СКАТ','КАЛЬМАР','АКУЛА','КИТ']);});
test('wrong and repeated answers never advance progress',()=>{for(const r of rounds){const found=new Set();assert.equal(selectWord(r,found,r.distractors[0]),'wrong');assert.equal(found.size,0);assert.equal(selectWord(r,found,r.answers[0]),'correct');assert.equal(selectWord(r,found,r.answers[0]),'duplicate');assert.equal(found.size,1);for(const w of r.answers.slice(1,-1))selectWord(r,found,w);assert.equal(selectWord(r,found,r.answers.at(-1)),'complete');assert.equal(found.size,5);}});
test('shuffle preserves content without mutating source',()=>{const source=['a','b','c'];assert.deepEqual([...shuffle(source,()=>.2)].sort(),source);assert.deepEqual(source,['a','b','c']);});
