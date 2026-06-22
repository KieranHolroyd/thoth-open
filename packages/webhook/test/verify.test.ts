import { createHmac } from 'node:crypto';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { verifyThothWebhook } from '../src/verify.js';

const SECRET = 'test-signing-secret';

function sign(timestamp: number, body: string): string {
	const signature = createHmac('sha256', SECRET).update(`${timestamp}.${body}`).digest('hex');
	return `t=${timestamp},v1=${signature}`;
}

describe('verifyThothWebhook', () => {
	const body = JSON.stringify({
		tool: 'check_order',
		guildId: '123',
		arguments: { orderId: 'ORD-1' },
		timestamp: 1_710_000_000
	});

	it('accepts a valid signature', () => {
		const timestamp = Math.floor(Date.now() / 1000);
		const ok = verifyThothWebhook({
			rawBody: body,
			signatureHeader: sign(timestamp, body),
			authorizationHeader: `Bearer ${SECRET}`,
			secret: SECRET
		});
		assert.equal(ok, true);
	});

	it('accepts a valid signature without Authorization header', () => {
		const timestamp = Math.floor(Date.now() / 1000);
		const ok = verifyThothWebhook({
			rawBody: body,
			signatureHeader: sign(timestamp, body),
			secret: SECRET
		});
		assert.equal(ok, true);
	});

	it('rejects a mismatched bearer token', () => {
		const timestamp = Math.floor(Date.now() / 1000);
		const ok = verifyThothWebhook({
			rawBody: body,
			signatureHeader: sign(timestamp, body),
			authorizationHeader: 'Bearer wrong-secret',
			secret: SECRET
		});
		assert.equal(ok, false);
	});

	it('rejects an invalid signature', () => {
		const timestamp = Math.floor(Date.now() / 1000);
		const ok = verifyThothWebhook({
			rawBody: body,
			signatureHeader: `t=${timestamp},v1=${'0'.repeat(64)}`,
			secret: SECRET
		});
		assert.equal(ok, false);
	});

	it('rejects a malformed signature header', () => {
		const ok = verifyThothWebhook({
			rawBody: body,
			signatureHeader: 'invalid',
			secret: SECRET
		});
		assert.equal(ok, false);
	});

	it('rejects an expired timestamp', () => {
		const timestamp = Math.floor(Date.now() / 1000) - 600;
		const ok = verifyThothWebhook({
			rawBody: body,
			signatureHeader: sign(timestamp, body),
			secret: SECRET,
			maxAgeSeconds: 300
		});
		assert.equal(ok, false);
	});

	it('rejects when secret is empty', () => {
		const timestamp = Math.floor(Date.now() / 1000);
		const ok = verifyThothWebhook({
			rawBody: body,
			signatureHeader: sign(timestamp, body),
			secret: ''
		});
		assert.equal(ok, false);
	});
});
