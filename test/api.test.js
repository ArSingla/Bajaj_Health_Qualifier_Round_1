const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

process.env.OFFICIAL_EMAIL = 'test@chitkara.edu.in';

const { app } = require('../src/app');

let server;
let baseUrl;

test.before(async () => {
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test('GET /health returns success response', async () => {
  const res = await fetch(`${baseUrl}/health`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.is_success, true);
  assert.equal(body.official_email, 'test@chitkara.edu.in');
});

test('POST /bfhl fibonacci works', async () => {
  const res = await fetch(`${baseUrl}/bfhl`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ fibonacci: 7 }),
  });

  assert.equal(res.status, 200);
  const body = await res.json();
  assert.deepEqual(body.data, [0, 1, 1, 2, 3, 5, 8]);
});

test('POST /bfhl rejects multiple keys', async () => {
  const res = await fetch(`${baseUrl}/bfhl`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ fibonacci: 4, hcf: [2, 4] }),
  });

  assert.equal(res.status, 400);
  const body = await res.json();
  assert.equal(body.is_success, false);
});
