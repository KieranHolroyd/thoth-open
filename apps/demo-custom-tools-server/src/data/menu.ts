import type { LiveConfig, MenuCategoryId, MenuItem, MenuResponse } from '../types.js';

export const MENU_CATEGORIES: Record<MenuCategoryId, string> = {
	'0': 'Specials',
	'1': 'Pizzas',
	'2': 'Pasta',
	'3': 'Sides',
	'4': 'Dips',
	'5': 'Desserts'
};

const ALLERGY_NOTICE =
	'Demo data only. Contact the shop for real allergen information before ordering.';

export const MENU_ITEMS: MenuItem[] = [
	{
		id: 1,
		title: 'Margherita',
		description:
			'Classic tomato and mozzarella on a hand-stretched thin and crispy base.',
		catagory: '1',
		price_medium: 7,
		price_large: 9,
		sizable: true,
		allergies: ALLERGY_NOTICE
	},
	{
		id: 2,
		title: 'The BBQ',
		description:
			'Chicken, mushrooms, red onion, mozzarella, and BBQ sauce on a crispy base.',
		catagory: '1',
		price_medium: 7,
		price_large: 9,
		sizable: true,
		allergies: ALLERGY_NOTICE
	},
	{
		id: 3,
		title: 'Pepperoni',
		description: 'Pepperoni, red onion, peppers, and mozzarella on a crispy base.',
		catagory: '1',
		price_medium: 7,
		price_large: 9,
		sizable: true,
		allergies: ALLERGY_NOTICE
	},
	{
		id: 4,
		title: 'Veg Supreme',
		description:
			'Peppers, mushrooms, caramelised onions, sweetcorn, red onions, and olives.',
		catagory: '1',
		price_medium: 7,
		price_large: 9,
		sizable: true,
		allergies: ALLERGY_NOTICE
	},
	{
		id: 5,
		title: 'Hawaiian',
		description: 'Thin sliced ham, pineapple, and mozzarella on a crispy base.',
		catagory: '1',
		price_medium: 7,
		price_large: 9,
		sizable: true,
		allergies: ALLERGY_NOTICE
	},
	{
		id: 6,
		title: 'Garlic Bread',
		description: 'Crispy bread topped with mozzarella and garlic.',
		catagory: '1',
		price_medium: 7,
		price_large: 9,
		sizable: true,
		allergies: ALLERGY_NOTICE
	},
	{
		id: 7,
		title: 'Cajun Chicken Pasta',
		description: 'Cajun chicken, mushrooms, and red onions in a creamy cajun sauce.',
		catagory: '2',
		price_medium: 5,
		allergies: ALLERGY_NOTICE
	},
	{
		id: 8,
		title: 'Meatball Pasta',
		description: 'Meatballs, red onions, and bacon in a tomato sauce.',
		catagory: '2',
		price_medium: 5,
		allergies: ALLERGY_NOTICE
	},
	{
		id: 9,
		title: 'Macaroni Cheese',
		description: 'Cheddar cheese sauce with thin sliced ham.',
		catagory: '2',
		price_medium: 5,
		allergies: ALLERGY_NOTICE
	},
	{
		id: 10,
		title: 'Chunky Cajun Fries',
		description: 'Chunky fries coated in cajun spice.',
		catagory: '3',
		price_medium: 4,
		allergies: ALLERGY_NOTICE
	},
	{
		id: 11,
		title: 'Sweet Potato Fries',
		description: 'Sweet potato fries with garlic granules.',
		catagory: '3',
		price_medium: 4,
		allergies: ALLERGY_NOTICE
	},
	{
		id: 12,
		title: 'Choice Of Dips',
		description: 'Garlic mayo, BBQ, sweet chilli, or piri piri.',
		catagory: '4',
		price_medium: 0.5,
		allergies: ALLERGY_NOTICE
	},
	{
		id: 13,
		title: 'Sweet Choco Balls',
		description: 'Dough balls filled with Nutella and fluffy marshmallows.',
		catagory: '5',
		price_medium: 3,
		allergies: ALLERGY_NOTICE
	},
	{
		id: 14,
		title: 'Weekend Special',
		description: 'Ask in store for rotating specials and the Doughluxe range.',
		catagory: '0',
		allergies: ALLERGY_NOTICE
	}
];

export const LIVE_CONFIG: LiveConfig[] = [
	{
		config_id: 'about_us_text',
		config_string:
			'Thoth Demo Pizzeria serves thin and crispy pizzas, pasta, sides, and desserts. This is mock menu data for testing Thoth custom tools. Call 01292 310297 for collection or delivery.'
	}
];

export function buildMenuResponse(items: MenuItem[] = MENU_ITEMS): MenuResponse {
	return {
		menu: items,
		liveconfig: LIVE_CONFIG,
		ts: Date.now()
	};
}

export function findMenuItem(id: number) {
	return MENU_ITEMS.find((item) => item.id === id) ?? null;
}

export function filterMenuItems(input: {
	category?: string;
	query?: string;
	itemId?: number;
}) {
	let items = MENU_ITEMS;

	if (input.itemId !== undefined) {
		items = items.filter((item) => item.id === input.itemId);
	}

	if (input.category) {
		items = items.filter((item) => item.catagory === input.category);
	}

	if (input.query) {
		const normalized = input.query.trim().toLowerCase();
		items = items.filter(
			(item) =>
				item.title.toLowerCase().includes(normalized) ||
				item.description.toLowerCase().includes(normalized)
		);
	}

	return items;
}
