# Bash Buddy Co. site (static preview)

**Branch `birthday-only`:** a second version of the site that launches with one box, the Birthday Bash. The language stays brand-wide so new themes can be added later: add a theme page, link it from the home page, and add its slug to `LIVE` in `api/checkout.js`. The original site with every theme lives on `main`.

Plain HTML and CSS. No build step. `index.html` is the home page.

## Deploy to Vercel
- GitHub: push this folder to a repo (index.html at the root), then Add New Project, Import, Deploy.
- CLI: `npm install -g vercel`, `vercel login`, then run `vercel` (preview) or `vercel --prod` (live) in this folder.

## Add your content
- Photos: drop .jpg files into `images/` using the names in `images/README.txt`. Empty slots show a placeholder.
- Links: edit `site-config.js` to add Instagram, TikTok, and your email. Empty ones stay hidden.
- Look for yellow [BRACKETED] notes on the FAQ, About, shipping, privacy, and terms pages. They mark text you must fill in. The policy pages are drafts and need review before launch.
- Custom domain: add it in your Vercel project settings.

## Not connected yet
- Prices say [PRICE] everywhere.
- The cart is saved in the visitor's browser. Checkout works after you finish the Stripe checkout setup below.
- Email signup and contact form: set the `data-endpoint` attribute on the form in signup.html and contact.html to your form service URL. Until then it shows a "not connected yet" message.

## Stripe checkout setup (cart to payment)
The cart page sends the cart to `api/checkout.js`, which creates a Stripe Checkout page. Do these steps in order, in Stripe TEST mode first.
1. In the Stripe Dashboard, create a Product and a Price for each item you sell (the boxes for sale, the shared add-ons, and the recommended add-on for each theme).
2. Copy each Price ID (starts with `price_`) into `api/_prices.js`. Items left empty cannot be bought.
3. In Vercel, open your project, then Settings, then Environment Variables, and add `STRIPE_SECRET_KEY` with your secret key (starts with `sk_test_` for testing). Never put the secret key in any file or in chat.
4. Customers pay for shipping. In Stripe, create two shipping rates: one for shipping (your flat rate) and one called Local pickup in Grand Junction at $0. In Vercel, add their IDs as `STRIPE_SHIPPING_RATE_ID` and `STRIPE_PICKUP_RATE_ID`.
5. Redeploy, add a box to the cart, check out with Stripe's test card 4242 4242 4242 4242, and confirm the order shows in your Stripe test dashboard.
6. For real sales, repeat with live products, live Price IDs, and your live secret key. Taxes and shipping rules are set in Stripe.

## Look
The site uses a Y2K glitter look: signature pink gradients, Bowlby One for headlines, and Sora for body text. Empty photo spots show illustrated templates until you add a real .jpg with the matching name in `images/`.

## Price test ($40 vs $55)
- Each visitor is randomly shown $40 or $55 on the home and Birthday Bash pages, and keeps that price on return visits. To preview one, add `?price=40` or `?price=55` to the page address.
- "Reserve for my party" goes to `/reserve/40` or `/reserve/55` (both show `reserve.html`). The form also sends the price each person saw as `price_shown`.
- Turn on Web Analytics in your Vercel project to count visits to each reserve path. Compare `/reserve/40` and `/reserve/55` visits (clicks) and form signups at each price.
- Connect the forms by pasting your form service URL into `formEndpoint` in `site-config.js`.
