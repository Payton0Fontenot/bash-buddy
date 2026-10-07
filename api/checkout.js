// Vercel serverless function: POST /api/checkout
// Turns the visitor's cart into a Stripe Checkout Session and returns its URL.
// Needs the STRIPE_SECRET_KEY environment variable (set it in Vercel, never in this code).
const prices = require("./_prices.js");
const banners = require("./_banners.js");

function cleanBanner(id, o) {
  const m = typeof id === "string" && id.match(/^(.+)-3$/);
  if (!m || !o || typeof o !== "object") return null;
  const list = banners.templates[m[1]];
  const s = (v, n) => (typeof v === "string" ? v.replace(/[\r\n]+/g, " ").trim().slice(0, n) : "");
  const template = s(o.template, 60);
  const text = s(o.text, 30);
  if (!list || !list.includes(template) || !text) return null;
  const colors = banners.colors.includes(o.colors) ? o.colors : banners.colors[0];
  const date = /^\d{4}-\d{2}-\d{2}$/.test(o.date || "") ? o.date : "";
  return [m[1], template, "Text: " + text, s(o.line2, 30) && "Line 2: " + s(o.line2, 30), colors, date && "Date: " + date, s(o.notes, 200) && "Notes: " + s(o.notes, 200)].filter(Boolean).join(" | ").slice(0, 500);
}

function priceFor(id) {
  if (typeof id !== "string") return "";
  const m = id.match(/^(.+)-(\d)$/);
  if (!m) return prices.boxes[id] || "";
  const slug = m[1];
  const n = Number(m[2]);
  if (n === 0) return prices.extras[slug] || "";
  const key = { 1: "favors", 2: "drinks", 3: "banner", 4: "cleanup", 5: "birthday" }[n];
  return key && prices.boxes[slug] !== undefined ? prices.addons[key] || "" : "";
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return res.status(500).json({ error: "Checkout is not set up yet." });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { body = null; }
  }
  const items = body && Array.isArray(body.items) ? body.items.slice(0, 30) : [];
  if (!items.length) return res.status(400).json({ error: "Your cart is empty." });

  const params = new URLSearchParams();
  params.append("mode", "payment");
  let n = 0;
  let b = 0;
  for (const it of items) {
    const price = priceFor(it && it.id);
    const q = Math.floor(Number(it && it.q));
    if (!price || !(q >= 1)) {
      return res.status(400).json({ error: "An item in your cart is not available for purchase yet." });
    }
    if (/-3$/.test(it.id)) {
      const d = cleanBanner(it.id, it.opts);
      if (!d) return res.status(400).json({ error: "Please fill out the banner details again." });
      b++;
      params.append("metadata[banner_" + b + "]", d);
    }
    params.append("line_items[" + n + "][price]", price);
    params.append("line_items[" + n + "][quantity]", String(Math.min(q, 10)));
    n++;
  }

  const origin = process.env.SITE_URL || "https://" + req.headers.host;
  params.append("success_url", origin + "/success");
  params.append("cancel_url", origin + "/cart");
  params.append("shipping_address_collection[allowed_countries][0]", "US");
  params.append("billing_address_collection", "auto");
  if (process.env.STRIPE_SHIPPING_RATE_ID) {
    params.append("shipping_options[0][shipping_rate]", process.env.STRIPE_SHIPPING_RATE_ID);
  }

  try {
    const r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + key,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });
    const data = await r.json();
    if (!r.ok || !data.url) {
      console.error("Stripe error:", data && data.error && data.error.message);
      return res.status(502).json({ error: "Checkout could not start. Please try again." });
    }
    return res.status(200).json({ url: data.url });
  } catch (e) {
    console.error("Checkout failure:", e && e.message);
    return res.status(502).json({ error: "Checkout could not start. Please try again." });
  }
};
