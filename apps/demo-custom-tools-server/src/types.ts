export type MenuCategoryId = '0' | '1' | '2' | '3' | '4' | '5';

export type MenuItem = {
	id: number;
	title: string;
	description: string;
	catagory: MenuCategoryId;
	price_medium?: number;
	price_large?: number;
	sizable?: boolean;
	allergies: string;
};

export type LiveConfig = {
	config_id: string;
	config_string: string;
};

export type MenuResponse = {
	menu: MenuItem[];
	liveconfig: LiveConfig[];
	ts: number;
};

export type OrderStatus = 'received' | 'preparing' | 'ready' | 'out_for_delivery' | 'shipped' | 'delivered' | 'cancelled';

export type Order = {
	orderId: string;
	status: OrderStatus;
	placedAt: string;
	customerName: string;
	items: string[];
	total: number;
	carrier?: string;
	trackingNumber?: string;
	eta?: string;
	estimatedReady?: string;
	cancelReason?: string;
};

export type SubscriptionPlan = 'free' | 'pro' | 'enterprise';

export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'cancelled' | 'expired';

export type Subscription = {
	email: string;
	plan: SubscriptionPlan;
	status: SubscriptionStatus;
	renewsAt?: string;
	expiresAt?: string;
	cancelledAt?: string;
	seats?: number;
};

export type License = {
	licenseKey: string;
	valid: boolean;
	product: string;
	expiresAt: string;
	seats: number;
	activatedDevices?: number;
	reason?: string;
};

export type AccountStatus = 'active' | 'restricted' | 'suspended' | 'banned';

export type Account = {
	username: string;
	status: AccountStatus;
	memberSince: string;
	restrictions: string[];
	reason?: string;
	lastSeen?: string;
};

export type StoreHours = {
	day: string;
	open: string;
	close: string;
	closed?: boolean;
};

export type DeliveryZone = {
	id: string;
	name: string;
	postcodes: string[];
	minOrder: number;
	deliveryFee: number;
	estimatedMinutes: number;
};

export type StoreInfo = {
	name: string;
	tagline: string;
	address: string;
	phone: string;
	email: string;
	hours: StoreHours[];
	deliveryZones: DeliveryZone[];
	collectionTimeMinutes: number;
	paymentMethods: string[];
};
