import { findAccount } from '../data/accounts.js';
import { findLicense } from '../data/licenses.js';
import { buildMenuResponse, filterMenuItems, MENU_ITEMS } from '../data/menu.js';
import { cancelOrder, createOrder, findOrder } from '../data/orders.js';
import { FINI50_PROMO, PROMOTIONS, STORE_INFO } from '../data/store.js';
import { findSubscription } from '../data/subscriptions.js';
import type { ThothWebhookPayload } from '@thothsupport/webhook';

function readStringArg(args: Record<string, unknown>, key: string) {
	const value = args[key];
	return typeof value === 'string' ? value.trim() : undefined;
}

function readNumberArg(args: Record<string, unknown>, key: string) {
	const value = args[key];
	if (typeof value === 'number' && !Number.isNaN(value)) {
		return value;
	}
	if (typeof value === 'string') {
		const parsed = Number.parseInt(value, 10);
		return Number.isNaN(parsed) ? undefined : parsed;
	}
	return undefined;
}

function handleMenuTool(args: Record<string, unknown>) {
	const items = filterMenuItems({
		category: readStringArg(args, 'category'),
		query: readStringArg(args, 'query'),
		itemId: readNumberArg(args, 'itemId')
	});

	return {
		...buildMenuResponse(items),
		meta: {
			totalItems: MENU_ITEMS.length,
			matchedItems: items.length
		}
	};
}

function handleOrderStatus(args: Record<string, unknown>) {
	const orderId = readStringArg(args, 'orderId');
	if (!orderId) {
		return { error: 'orderId is required' };
	}

	const order = findOrder(orderId);
	if (!order) {
		return {
			orderId,
			found: false,
			message: 'No order found with that ID. Demo IDs include ORD-42, ORD-100, and ORD-88.'
		};
	}

	return { found: true, ...order };
}

function handleSubscription(args: Record<string, unknown>) {
	const email = readStringArg(args, 'email');
	if (!email) {
		return { error: 'email is required' };
	}

	const subscription = findSubscription(email);
	if (!subscription) {
		return {
			email,
			found: false,
			message:
				'No subscription found for that email. Demo emails include demo@example.com and trial@example.com.'
		};
	}

	return { found: true, ...subscription };
}

function handleLicense(args: Record<string, unknown>) {
	const licenseKey = readStringArg(args, 'licenseKey');
	if (!licenseKey) {
		return { error: 'licenseKey is required' };
	}

	const license = findLicense(licenseKey);
	if (!license) {
		return {
			licenseKey,
			found: false,
			valid: false,
			message:
				'License key not recognized. Demo keys include THOTH-DEMO-2026 and THOTH-EXPIRED.'
		};
	}

	return { found: true, ...license };
}

function handleAccountStatus(args: Record<string, unknown>) {
	const username = readStringArg(args, 'username');
	if (!username) {
		return { error: 'username is required' };
	}

	const account = findAccount(username);
	if (!account) {
		return {
			username,
			found: false,
			message:
				'Account not found. Demo usernames include player123, new_user, and banned_user.'
		};
	}

	return { found: true, ...account };
}

function handleStoreInfo() {
	return {
		store: STORE_INFO,
		promotions: PROMOTIONS,
		ts: Date.now()
	};
}

function handleFini50Promo() {
	return { ...FINI50_PROMO };
}

function handleCancelOrder(args: Record<string, unknown>) {
	const orderId = readStringArg(args, 'orderId');
	if (!orderId) {
		return { error: 'orderId is required' };
	}

	const reason = readStringArg(args, 'reason');
	return cancelOrder(orderId, reason);
}

function handleCreateOrder(args: Record<string, unknown>) {
	const customerName = readStringArg(args, 'customerName');
	const items = readStringArg(args, 'items');
	if (!customerName || !items) {
		return { error: 'customerName and items are required' };
	}

	return createOrder({
		customerName,
		items,
		fulfillment: readStringArg(args, 'fulfillment')
	});
}

const TOOL_HANDLERS: Record<string, (args: Record<string, unknown>) => unknown> = {
	search_menu: handleMenuTool,
	get_menu: handleMenuTool,
	menu: handleMenuTool,
	check_order_status: handleOrderStatus,
	cancel_order: handleCancelOrder,
	create_order: handleCreateOrder,
	check_subscription: handleSubscription,
	validate_license: handleLicense,
	account_status: handleAccountStatus,
	get_store_info: () => handleStoreInfo(),
	store_hours: () => handleStoreInfo(),
	get_fini50_promo: () => handleFini50Promo(),
	fini50: () => handleFini50Promo()
};

export function handleToolRequest(payload: ThothWebhookPayload) {
	const handler = TOOL_HANDLERS[payload.tool] ?? handleMenuTool;
	const result = handler(payload.arguments);

	return {
		tool: payload.tool,
		...(typeof result === 'object' && result !== null ? result : { result }),
		ts: Date.now()
	};
}

export function listDemoTools() {
	return Object.keys(TOOL_HANDLERS).map((name) => ({
		name,
		demoArgs: getDemoArgs(name)
	}));
}

function getDemoArgs(toolName: string) {
	switch (toolName) {
		case 'check_order_status':
			return { orderId: 'ORD-42' };
		case 'cancel_order':
			return { orderId: 'ORD-100', reason: 'Customer changed plans' };
		case 'create_order':
			return {
				customerName: 'Jamie Lee',
				items: 'Margherita (large), Garlic Bread (medium)',
				fulfillment: 'collection'
			};
		case 'check_subscription':
			return { email: 'demo@example.com' };
		case 'validate_license':
			return { licenseKey: 'THOTH-DEMO-2026' };
		case 'account_status':
			return { username: 'player123' };
		case 'get_store_info':
		case 'store_hours':
			return {};
		case 'get_fini50_promo':
		case 'fini50':
			return {};
		default:
			return { query: 'margherita' };
	}
}
