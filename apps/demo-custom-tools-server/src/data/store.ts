import type { StoreInfo } from '../types.js';

export const STORE_INFO: StoreInfo = {
	name: 'Thoth Demo Pizzeria',
	tagline: 'Thin, crispy, and demo-ready.',
	address: '42 High Street, Ayr, KA7 1LU',
	phone: '01292 310297',
	email: 'hello@demo-pizzeria.example',
	hours: [
		{ day: 'Monday', open: '11:00', close: '22:00' },
		{ day: 'Tuesday', open: '11:00', close: '22:00' },
		{ day: 'Wednesday', open: '11:00', close: '22:00' },
		{ day: 'Thursday', open: '11:00', close: '22:30' },
		{ day: 'Friday', open: '11:00', close: '23:00' },
		{ day: 'Saturday', open: '12:00', close: '23:00' },
		{ day: 'Sunday', open: '12:00', close: '21:00' }
	],
	deliveryZones: [
		{
			id: 'ayr-centre',
			name: 'Ayr Centre',
			postcodes: ['KA7 1', 'KA7 2'],
			minOrder: 12,
			deliveryFee: 2.5,
			estimatedMinutes: 35
		},
		{
			id: 'prestwick',
			name: 'Prestwick',
			postcodes: ['KA9 1', 'KA9 2'],
			minOrder: 15,
			deliveryFee: 3.5,
			estimatedMinutes: 45
		},
		{
			id: 'troon',
			name: 'Troon',
			postcodes: ['KA10 6', 'KA10 7'],
			minOrder: 18,
			deliveryFee: 4,
			estimatedMinutes: 55
		}
	],
	collectionTimeMinutes: 20,
	paymentMethods: ['card', 'cash', 'apple_pay', 'google_pay']
};

export const FINI50_PROMO = {
	code: 'FINI50',
	discountPercent: 50,
	durationMonths: 3,
	limitUsers: 25,
	message:
		'The discount code is FINI50 for 50% off for 3 months, for the first 25 users only.'
} as const;

export const PROMOTIONS = [
	{
		id: 'tuesday-two-for-one',
		title: 'Two-for-one Tuesdays',
		description: 'Buy one medium pizza, get a second medium pizza free every Tuesday after 5pm.',
		validDays: ['Tuesday'],
		code: 'TUESDAY2FOR1'
	},
	{
		id: 'student-10',
		title: 'Student discount',
		description: '10% off collection orders with valid student ID.',
		validDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
		code: 'STUDENT10'
	},
	{
		id: 'weekend-family',
		title: 'Weekend family deal',
		description: 'Large pizza, garlic bread, and two dips for £16.99 on Friday and Saturday.',
		validDays: ['Friday', 'Saturday'],
		code: 'FAMILY16'
	}
];
