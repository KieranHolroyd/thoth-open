import type { Subscription } from '../types.js';

export const SUBSCRIPTIONS: Subscription[] = [
	{
		email: 'demo@example.com',
		plan: 'pro',
		status: 'active',
		renewsAt: '2026-07-01',
		seats: 2
	},
	{
		email: 'team@acme.dev',
		plan: 'enterprise',
		status: 'active',
		renewsAt: '2026-08-15',
		seats: 10
	},
	{
		email: 'trial@example.com',
		plan: 'pro',
		status: 'trialing',
		expiresAt: '2026-06-28',
		seats: 1
	},
	{
		email: 'pastdue@example.com',
		plan: 'pro',
		status: 'past_due',
		renewsAt: '2026-06-10',
		seats: 1
	},
	{
		email: 'cancelled@example.com',
		plan: 'pro',
		status: 'cancelled',
		cancelledAt: '2026-05-20',
		expiresAt: '2026-06-20',
		seats: 1
	},
	{
		email: 'expired@example.com',
		plan: 'free',
		status: 'expired',
		expiresAt: '2026-05-01'
	}
];

export function findSubscription(email: string) {
	const normalized = email.trim().toLowerCase();
	return SUBSCRIPTIONS.find((subscription) => subscription.email.toLowerCase() === normalized) ?? null;
}
