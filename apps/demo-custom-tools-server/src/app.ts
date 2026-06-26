import { Hono } from "hono";
import demoCustomTools from "./data/demo-custom-tools.json" with { type: "json" };
import { findAccount } from "./data/accounts.js";
import { findLicense } from "./data/licenses.js";
import {
  buildMenuResponse,
  filterMenuItems,
  findMenuItem,
  MENU_CATEGORIES,
} from "./data/menu.js";
import { filterOrders, findOrder } from "./data/orders.js";
import { PROMOTIONS, STORE_INFO } from "./data/store.js";
import { findSubscription } from "./data/subscriptions.js";
import { handleToolRequest, listDemoTools } from "./handlers/tool-responses.js";
import {
  readVerifiedThothWebhook,
  verifiedWebhookErrorResponse,
} from "./handlers/thoth-webhook.js";

export const app = new Hono();

app.get("/health", (c) =>
  c.json({
    status: "ok",
    service: "demo-custom-tools-server",
    datasets: [
      "menu",
      "orders",
      "subscriptions",
      "licenses",
      "accounts",
      "store",
    ],
  }),
);

app.post("/FINI50", async (c) => {
  const verified = await readVerifiedThothWebhook(c);
  if (!verified.ok) {
    return verifiedWebhookErrorResponse(c, verified);
  }

  return c.json(
    handleToolRequest({
      ...verified.payload,
      tool: verified.payload.tool || "get_fini50_promo",
    }),
  );
});

app.get("/demo", (c) =>
  c.json({
    description: "Mock data API for Thoth custom tool demos.",
    tools: listDemoTools(),
    endpoints: [
      "POST /FINI50",
      "GET /menu",
      "GET /menu/:id",
      "GET /categories",
      "GET /orders",
      "GET /orders/:orderId",
      "GET /subscriptions?email=",
      "GET /licenses/:licenseKey",
      "GET /accounts/:username",
      "GET /store",
      "POST / (Thoth webhook)",
    ],
    importBundle: "/demo-custom-tools.json",
    ts: Date.now(),
  }),
);

app.get("/demo-custom-tools.json", (c) => c.json(demoCustomTools));

app.get("/menu", (c) => {
  const category = c.req.query("category");
  const query = c.req.query("query");
  const itemId = c.req.query("itemId");

  const parsedItemId = itemId ? Number.parseInt(itemId, 10) : undefined;
  if (itemId && Number.isNaN(parsedItemId)) {
    return c.json({ error: "itemId must be a number" }, 400);
  }

  const items = filterMenuItems({
    category,
    query,
    itemId: parsedItemId,
  });

  return c.json(buildMenuResponse(items));
});

app.get("/menu/:id", (c) => {
  const id = Number.parseInt(c.req.param("id"), 10);
  if (Number.isNaN(id)) {
    return c.json({ error: "id must be a number" }, 400);
  }

  const item = findMenuItem(id);
  if (!item) {
    return c.json({ error: "Menu item not found" }, 404);
  }

  return c.json({ item, ts: Date.now() });
});

app.get("/categories", (c) =>
  c.json({
    categories: Object.entries(MENU_CATEGORIES).map(([id, name]) => ({
      id,
      name,
    })),
    ts: Date.now(),
  }),
);

app.get("/orders", (c) => {
  const status = c.req.query("status");
  const customer = c.req.query("customer");

  return c.json({
    orders: filterOrders({ status, customer }),
    ts: Date.now(),
  });
});

app.get("/orders/:orderId", (c) => {
  const order = findOrder(c.req.param("orderId"));
  if (!order) {
    return c.json({ error: "Order not found" }, 404);
  }

  return c.json({ order, ts: Date.now() });
});

app.get("/subscriptions", (c) => {
  const email = c.req.query("email");
  if (!email) {
    return c.json({ error: "email query parameter is required" }, 400);
  }

  const subscription = findSubscription(email);
  if (!subscription) {
    return c.json({ error: "Subscription not found" }, 404);
  }

  return c.json({ subscription, ts: Date.now() });
});

app.get("/licenses/:licenseKey", (c) => {
  const license = findLicense(c.req.param("licenseKey"));
  if (!license) {
    return c.json({ error: "License not found" }, 404);
  }

  return c.json({ license, ts: Date.now() });
});

app.get("/accounts/:username", (c) => {
  const account = findAccount(c.req.param("username"));
  if (!account) {
    return c.json({ error: "Account not found" }, 404);
  }

  return c.json({ account, ts: Date.now() });
});

app.get("/store", (c) =>
  c.json({
    store: STORE_INFO,
    promotions: PROMOTIONS,
    ts: Date.now(),
  }),
);

app.post("/", async (c) => {
  const verified = await readVerifiedThothWebhook(c);
  if (!verified.ok) {
    return verifiedWebhookErrorResponse(c, verified);
  }

  return c.json(handleToolRequest(verified.payload));
});
