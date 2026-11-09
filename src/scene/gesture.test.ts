import test from 'node:test';
import assert from 'node:assert/strict';
import { isTap } from './gesture.ts';

test('toque curto e parado seleciona; arrasto, toque longo ou dois dedos não', () => {
  assert.equal(isTap({ dx: 2, dy: 3, ms: 120, pointers: 1 }), true);
  assert.equal(isTap({ dx: 8, dy: 0, ms: 120, pointers: 1 }), false);
  assert.equal(isTap({ dx: 0, dy: 0, ms: 900, pointers: 1 }), false);
  assert.equal(isTap({ dx: 0, dy: 0, ms: 100, pointers: 2 }), false);
});
