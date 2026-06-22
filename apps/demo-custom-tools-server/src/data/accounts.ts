import type { Account } from '../types.js';

export const ACCOUNTS: Account[] = [
	{
		username: 'player123',
		status: 'active',
		memberSince: '2024-03-15',
		restrictions: [],
		lastSeen: '2026-06-21T17:30:00Z'
	},
	{
		username: 'moderator_j',
		status: 'active',
		memberSince: '2023-11-02',
		restrictions: [],
		lastSeen: '2026-06-21T19:00:00Z'
	},
	{
		username: 'new_user',
		status: 'restricted',
		memberSince: '2026-06-20',
		restrictions: ['links', 'attachments'],
		reason: 'Account is in a 24-hour new-member moderation period.',
		lastSeen: '2026-06-21T18:45:00Z'
	},
	{
		username: 'spammy_bot',
		status: 'suspended',
		memberSince: '2025-08-10',
		restrictions: ['chat', 'voice', 'tickets'],
		reason: 'Temporary suspension for repeated spam reports.',
		lastSeen: '2026-06-19T09:12:00Z'
	},
	{
		username: 'banned_user',
		status: 'banned',
		memberSince: '2024-01-05',
		restrictions: ['chat', 'voice', 'tickets', 'appeals'],
		reason: 'Permanent ban for repeated harassment after prior warnings.'
	}
];

export function findAccount(username: string) {
	const normalized = username.trim().toLowerCase();
	return ACCOUNTS.find((account) => account.username.toLowerCase() === normalized) ?? null;
}
