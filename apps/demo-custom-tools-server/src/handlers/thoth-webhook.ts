import type { Context } from 'hono';
import { verifyThothWebhook, type ThothWebhookPayload } from '@thothsupport/webhook';

type VerifyFailure = {
	ok: false;
	status: 400 | 401 | 500;
	error: string;
};

type VerifySuccess = {
	ok: true;
	payload: ThothWebhookPayload;
};

export type VerifiedThothWebhook = VerifySuccess | VerifyFailure;

export async function readVerifiedThothWebhook(c: Context): Promise<VerifiedThothWebhook> {
	const rawBody = await c.req.text();
	const signature = c.req.header('X-Thoth-Signature');
	const authorization = c.req.header('Authorization');
	const secret = process.env.THOTH_SIGNING_SECRET;

	if (!secret) {
		return { ok: false, status: 500, error: 'THOTH_SIGNING_SECRET is not configured' };
	}

	if (
		!verifyThothWebhook({
			rawBody,
			signatureHeader: signature,
			authorizationHeader: authorization,
			secret
		})
	) {
		return { ok: false, status: 401, error: 'Invalid signature' };
	}

	try {
		return { ok: true, payload: JSON.parse(rawBody) as ThothWebhookPayload };
	} catch {
		return { ok: false, status: 400, error: 'Invalid JSON body' };
	}
}

export function verifiedWebhookErrorResponse(
	c: Context,
	result: VerifyFailure
) {
	return c.json({ error: result.error }, result.status);
}
