/**
 * Minimal Express webhook handler for Thoth custom tools.
 *
 *   npm install express @thothsupport/webhook
 *   THOTH_SIGNING_SECRET=your-secret npx tsx examples/node-express.ts
 */
import express from 'express';

import { verifyThothWebhook, type ThothWebhookPayload } from '@thothsupport/webhook';

const secret = process.env.THOTH_SIGNING_SECRET;
if (!secret) {
	throw new Error('THOTH_SIGNING_SECRET is required');
}

const app = express();

app.post(
	'/webhook',
	express.raw({ type: 'application/json' }),
	(req, res) => {
		const rawBody = req.body.toString('utf8');
		const signature = req.header('X-Thoth-Signature');
		const authorization = req.header('Authorization');

		if (
			!verifyThothWebhook({
				rawBody,
				signatureHeader: signature,
				authorizationHeader: authorization,
				secret
			})
		) {
			res.status(401).json({ error: 'Invalid signature' });
			return;
		}

		const payload = JSON.parse(rawBody) as ThothWebhookPayload;
		res.json({
			tool: payload.tool,
			orderId: payload.arguments.orderId,
			status: 'shipped'
		});
	}
);

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
	console.log(`listening on http://localhost:${port}/webhook`);
});
