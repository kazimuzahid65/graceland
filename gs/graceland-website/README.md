# Graceland Financial Solutions — Demo Website

Static, dependency-free site (HTML, CSS, JavaScript). English only, light/dark mode. Built from the YSR site structure with Graceland branding (emerald + mint + gold accent).

## Structure
```
index.html            Page markup (hash-routed pages: #/home, #/about, #/services, #/planning, #/resources, #/booking, #/contact)
assets/css/style.css  All styles (premium header/footer = sections 4, 10, 14)
assets/js/content.js  All site copy, services, FAQ, tax/estate accordions, reviews (edit here)
assets/js/app.js      Router, theme, slider, reviews (right-to-left marquee), booking calendar, tabs
assets/js/chat.js     English-only live chat assistant (rules, lead capture, WhatsApp/call)
assets/img/           Logo and photos
```

## Deploy on GitHub Pages
1. Upload the contents of this folder to a repository (index.html at the root).
2. Settings → Pages → Deploy from a branch → `main` / `(root)`.

## Demo placeholders
- Stats, timeline, 3 of 8 reviews, resource cards and tips are demo content. The first 5 reviews and all service/planning text come from the client's public site.
- Booking calendar is a demo (Central Time) — swap for the client's real booking embed.
- Contact form opens the visitor's mail app; chat leads are stored in the browser only (set `CHAT_CFG.endpoint` in chat.js).
- Hero photos were low-resolution; replace with larger versions for production.
