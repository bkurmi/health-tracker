# Laddoo vs Me 🥊

A one-page, no-login habit tracker for cholesterol control (LDL ↓, HDL ↑) and more protein.
All data is stored in the browser (localStorage) on your device — no database, no server.

## Features
- **Coach Chacha** — time-aware check-ins every time you open the app (morning walk, breakfast, lunch, hourly craving checks 12:30–4:30 PM, chai, dinner, night). Tap-to-answer; answers auto-update checklist, protein and slips. "Baad me" snoozes 45 min.
- **Data-driven insights** — streak/record, yesterday's score & protein, sweets left this week, fried-snack patterns, days to lipid retest, weight change.
- **Fresh daily** — 40 quotes, 37 tips, 36 daily challenges (+3 bonus) rotating by date; 20 SOS roasts, 15 slip roasts. Edit `content.js` to add more.
- **Monday report card** — last week's grade vs the week before.
- **6 gradual phases** — one new rule every ~2 weeks; next phase unlocks after 14 days with 11+ days scoring 70+.
- **Daily checklist** (only habits of the current phase), **slip counters** with weekly budgets, ghee-roti counter.
- **Protein meter** with one-tap vegetarian foods.
- **Craving SOS** — 10-min timer + Hinglish roasts.
- **Wheel of Penance** — spins automatically on over-budget slips.
- **Murukku Tax jar**, streaks, XP levels, charts (score, slips, protein, weight, LDL/HDL).
- **Backup**: Share / Download / Import a JSON file (keep it on Google Drive or WhatsApp).

## Run locally
```powershell
python -m http.server 8080
```
Open http://localhost:8080

## Host free on GitHub Pages
```powershell
git init; git add .; git commit -m "Laddoo vs Me"
gh repo create laddoo-vs-me --public --source . --push
gh api -X POST repos/{owner}/laddoo-vs-me/pages -f "source[branch]=main" -f "source[path]=/"
```
Then open `https://<your-username>.github.io/laddoo-vs-me/` on your phone → browser menu → **Add to Home screen**.

> Data stays on the phone you use. Use the same browser every time, avoid incognito, and take a backup weekly.

_Not medical advice — consult your doctor._
