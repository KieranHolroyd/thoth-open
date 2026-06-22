import type { License } from '../types.js';

export const LICENSES: License[] = [
	{
		licenseKey: 'THOTH-DEMO-2026',
		valid: true,
		product: 'Thoth Pro',
		expiresAt: '2027-01-01',
		seats: 5,
		activatedDevices: 2
	},
	{
		licenseKey: 'THOTH-TEAM-ENTERPRISE',
		valid: true,
		product: 'Thoth Enterprise',
		expiresAt: '2028-06-01',
		seats: 25,
		activatedDevices: 18
	},
	{
		licenseKey: 'THOTH-EXPIRED',
		valid: false,
		product: 'Thoth Pro',
		expiresAt: '2025-01-01',
		seats: 1,
		reason: 'License expired on 2025-01-01.'
	},
	{
		licenseKey: 'THOTH-REVOKED',
		valid: false,
		product: 'Thoth Pro',
		expiresAt: '2027-06-01',
		seats: 1,
		reason: 'License was revoked after a chargeback.'
	}
];

export function findLicense(licenseKey: string) {
	const normalized = licenseKey.trim().toUpperCase();
	return (
		LICENSES.find((license) => license.licenseKey.toUpperCase() === normalized) ?? null
	);
}
