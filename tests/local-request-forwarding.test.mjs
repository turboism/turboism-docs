import test from 'node:test';
import assert from 'node:assert/strict';
import { forwardLocalRequest } from '../scripts/forward-local-request.mjs';

function route(overrides = {}) {
  return {
    request: () => ({ url: () => 'https://turboism.dev/docs/zh' }),
    fetch: async options => { assert.equal(options.url, 'http://127.0.0.1:3000/docs/zh'); return {}; },
    fulfill: async () => {},
    abort: async () => { throw new Error('Unexpected abort'); },
    ...overrides,
  };
}

const forward = request => forwardLocalRequest(request, 'http://127.0.0.1:3000', 'https://turboism.dev');
test('navigation closing after fulfillment begins never aborts the handled route', async () => {
  await forward(route({ fulfill: async () => { throw new Error('Target page, context or browser has been closed'); } }));
});
test('unexpected fulfillment errors retain their original cause without a second route action', async () => {
  const failure = new Error('Invalid response body');
  await assert.rejects(forward(route({ fulfill: async () => { throw failure; } })), error => error === failure);
});
test('upstream fetch failure aborts the still-unhandled request', async () => {
  let aborted = 0;
  await forward(route({ fetch: async () => { throw new Error('ECONNREFUSED'); }, abort: async () => { aborted++; } }));
  assert.equal(aborted, 1);
});
