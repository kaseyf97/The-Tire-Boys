Remind me where we left off on The Tire Boys website. Here's the current to-do list:

**Most Important First:**
1. **Rotate the ntfy.sh token** — go to ntfy.sh, delete the old token `tk_0ibssstotn5p864em18jb8otsteer`, generate a new one, and update it in `.env.local` and in Vercel (run `vercel env rm NTFY_TOKEN production --yes` then `vercel env add NTFY_TOKEN production --value "NEW_TOKEN" --yes` then `vercel --prod --yes`).

**Then when ready:**
2. **Fix muted text contrast** — change `#888888` to `#767676` in all 4 HTML files. One character change, fixes an accessibility violation.
3. **Add skip-to-content link** — small HTML/CSS addition to all 4 pages for keyboard accessibility.
4. **Add pricing signals to services page** — "Starting at $XX" or "Call for pricing" on each service in `services.html`.
5. **Add nearby cities to homepage** — one line in `index.html` mentioning Denair, Ceres, Hilmar, Hughson to capture nearby searches.
