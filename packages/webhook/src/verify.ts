import { createHmac, timingSafeEqual } from 'node:crypto';

const DEFAULT_MAX_AGE_SECONDS = 300;

export type VerifyThothWebhookOptions = {
	rawBody: string;
	signatureHeader: string | undefined;
	authorizationHeader?: string | undefined;
	secret: string;
	maxAgeSeconds?: number;
};

export function verifyThothWebhook(options: VerifyThothWebhookOptions): boolean {
	const {
		rawBody,
		signatureHeader,
		authorizationHeader,
		secret,
		maxAgeSeconds = DEFAULT_MAX_AGE_SECONDS
	} = options;

	if (!secret) {
		return false;
	}

	const bearer = authorizationHeader?.match(/^Bearer\s+(.+)$/i)?.[1];
	if (bearer && bearer !== secret) {
		return false;
	}

	const match = /^t=(\d+),v1=([a-f0-9]+)$/.exec(signatureHeader ?? '');
	if (!match) {
		return false;
	}

	const timestamp = Number(match[1]);
	const provided = match[2];
	const now = Math.floor(Date.now() / 1000);
	if (Math.abs(now - timestamp) > maxAgeSeconds) {
		return false;
	}

	const expected = createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('hex');

	if (provided.length !== expected.length) {
		return false;
	}

	return timingSafeEqual(Buffer.from(provided, 'hex'), Buffer.from(expected, 'hex'));
}
