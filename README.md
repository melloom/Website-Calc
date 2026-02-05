# Mellow Quote 🧮

A website pricing calculator I built for myself to streamline my quoting process. No more back-and-forth emails trying to figure out what a client needs — just send them the link and let them build their own quote.

## What This Is

This is a multi-step wizard that walks potential clients through selecting what they want for their website:
- Single page vs multi-page
- Industry/category
- Features & add-ons
- Design complexity
- Timeline preferences

At the end, they get an instant quote and can submit their info. I get a PDF quote sent to my inbox. Clean and simple.

## Why I Built It

Tired of:
- "How much for a website?" messages with zero context
- Spending 30 mins on discovery calls for projects that go nowhere
- Manually calculating quotes and forgetting to include things

Now I just drop the link and let the app do the work.

## Tech Stack

**Next.js** — The React framework that actually makes sense. File-based routing means each step of the wizard is just a file in `/pages`. No router config BS. Server-side rendering out of the box for fast initial loads.

**React 18** — Hooks everywhere. `useState` for selections, `useRouter` for navigation between steps. The component model makes each step isolated and easy to tweak.

**TailwindCSS** — Utility-first CSS that lets you style without leaving your JSX. No more switching between files. The responsive prefixes (`sm:`, `md:`) make mobile-first dead simple. Also the animations and transitions just *work*.

**Nodemailer** — Sends the quote emails through SMTP. Set up once, forget about it. Handles the serverless function for email delivery via Netlify Functions.

**jsPDF + html2canvas** — Generates professional PDF quotes on the fly. Captures the quote summary as an image and drops it into a PDF. Client gets something they can actually print or forward.

**Netlify** — One `git push` and it's deployed. Serverless functions handle the backend (email sending). Free tier is more than enough for this use case.

## Project Structure

```
/pages          → Each step of the wizard (index.js, step-2.js, step-3.js, etc.)
/pages/api      → API routes for email handling
/public         → Favicons and manifest
/styles         → Global CSS (mostly just Tailwind imports)
/netlify        → Serverless functions for production
```

## Running It

```bash
npm install
npm run dev
```

Then hit `localhost:3000`.

## Environment Variables

Create `.env.local` with your SMTP creds:

```
EMAIL_HOST=your-smtp-server
EMAIL_PORT=587
EMAIL_USER=your-email
EMAIL_PASS=your-password
EMAIL_TO=where-quotes-go
```

---

Built with caffeine and the desire to never manually write another quote again.
