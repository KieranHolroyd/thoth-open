import type { Order, OrderStatus } from '../types.js';

export const ORDERS: Order[] = [
	{
		orderId: 'ORD-42',
		status: 'shipped',
		placedAt: '2026-06-19T18:45:00Z',
		customerName: 'Alex Morgan',
		items: ['Margherita (large)', 'Garlic Bread (medium)', 'Choice Of Dips x2'],
		total: 18.5,
		carrier: 'UPS',
		trackingNumber: '1Z999AA10123456784',
		eta: '2026-06-24'
	},
	{
		orderId: 'ORD-100',
		status: 'preparing',
		placedAt: '2026-06-21T19:05:00Z',
		customerName: 'Jamie Lee',
		items: ['The BBQ (large)', 'Chunky Cajun Fries', 'Sweet Choco Balls'],
		total: 22,
		estimatedReady: '2026-06-21T19:35:00Z'
	},
	{
		orderId: 'ORD-77',
		status: 'ready',
		placedAt: '2026-06-21T18:50:00Z',
		customerName: 'Sam Patel',
		items: ['Pepperoni (medium)', 'Cajun Chicken Pasta'],
		total: 12,
		estimatedReady: '2026-06-21T19:20:00Z'
	},
	{
		orderId: 'ORD-88',
		status: 'out_for_delivery',
		placedAt: '2026-06-21T18:30:00Z',
		customerName: 'Taylor Brooks',
		items: ['Veg Supreme (large)', 'Sweet Potato Fries', 'Macaroni Cheese'],
		total: 19.5,
		carrier: 'Demo Delivery',
		trackingNumber: 'DEMO-8821',
		eta: '2026-06-21T19:15:00Z'
	},
	{
		orderId: 'ORD-15',
		status: 'delivered',
		placedAt: '2026-06-20T12:10:00Z',
		customerName: 'Casey Nguyen',
		items: ['Hawaiian (medium)', 'Meatball Pasta'],
		total: 12,
		carrier: 'Demo Delivery',
		trackingNumber: 'DEMO-1510',
		eta: '2026-06-20T12:45:00Z'
	},
	{
		orderId: 'ORD-404',
		status: 'cancelled',
		placedAt: '2026-06-18T20:00:00Z',
		customerName: 'Riley Chen',
		items: ['Weekend Special'],
		total: 0,
		cancelReason: 'Customer requested cancellation before preparation started.'
	}
];

export function findOrder(orderId: string) {
	const normalized = orderId.trim().toUpperCase();
	return ORDERS.find((order) => order.orderId.toUpperCase() === normalized) ?? null;
}

const NON_CANCELLABLE_STATUSES = new Set<OrderStatus>(['delivered', 'cancelled']);

export function cancelOrder(orderId: string, reason?: string) {
	const order = findOrder(orderId);
	if (!order) {
		return {
			ok: false as const,
			orderId,
			found: false,
			message: 'No order found with that ID. Demo IDs include ORD-42, ORD-100, and ORD-88.'
		};
	}

	if (NON_CANCELLABLE_STATUSES.has(order.status)) {
		return {
			ok: false as const,
			found: true,
			orderId: order.orderId,
			status: order.status,
			message:
				order.status === 'cancelled'
					? 'This order is already cancelled.'
					: 'Delivered orders cannot be cancelled.'
		};
	}

	const cancelReason = reason?.trim() || 'Cancelled at customer request via support.';
	order.status = 'cancelled';
	order.cancelReason = cancelReason;
	delete order.carrier;
	delete order.trackingNumber;
	delete order.eta;
	delete order.estimatedReady;

	return {
		ok: true as const,
		found: true,
		orderId: order.orderId,
		status: order.status,
		cancelReason: order.cancelReason,
		message: `Order ${order.orderId} has been cancelled.`
	};
}

export function filterOrders(input: { status?: string; customer?: string }) {
	let orders = ORDERS;

	if (input.status) {
		const normalized = input.status.trim().toLowerCase();
		orders = orders.filter((order) => order.status === normalized);
	}

	if (input.customer) {
		const normalized = input.customer.trim().toLowerCase();
		orders = orders.filter((order) => order.customerName.toLowerCase().includes(normalized));
	}

	return orders;
}
