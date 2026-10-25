# Manoj Rawat — Portfolio

Built with Next.js (App Router, JavaScript), Tailwind CSS v4 and GSAP.

```bash
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

- `app/` holds routes, the root layout and globals.css
- `components/layout|sections|ui` holds UI components
- `lib/gsap` is the GSAP entry point (import `gsap`, `ScrollTrigger`, `useGSAP` from `@/lib/gsap`)
- `lib/fonts.js` is for local fonts via `next/font/local`
- `hooks/` holds custom React hooks
- `public/images|icons|videos|fonts` holds static assets
