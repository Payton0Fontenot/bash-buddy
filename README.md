# Bash Buddy Co. site (static preview)

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
- The cart works in the visitor's browser only. Checkout shows a "not connected yet" message until you connect your store (for example Shopify).
- Email signup and contact form: set the `data-endpoint` attribute on the form in signup.html and contact.html to your form service URL. Until then it shows a "not connected yet" message.
