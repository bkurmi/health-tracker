# Operation 227 🥊 Health Coach

A personalized, time-aware PWA health coach for **cholesterol control (LDL ↓, HDL ↑)**, **vegetarian protein**, and **snack police / continuous eating control**.

All data is stored directly in your browser (`localStorage`) — 100% private, no database, no external servers required.

---

## 🌟 What's New in Operation 227

- 🤖 **Smart AI Meal Logger & Point Allocation**: Type or voice-type whatever you ate in plain English or Hinglish (e.g. *"2 moong chilla with dahi"*, *"3 pieces gajak"*, *"1 samosa"*). The AI calculates protein, detects trans-fat/sweets/grazing slips, allocates points, and provides witty Coach feedback.
- 🕉️ **Vrat / Fasting Mode (Tuesday & Saturday)**:
  - Supports **"Ek-Time" Fasting** (daytime = phalahar: fruits, dry fruits, makhana, gajak, milk/chaas; evening = regular meal).
  - Tuesday is active by default; Saturday is toggleable in Coach & Data settings.
  - Habits and questions adapt automatically so you aren't asked about regular grains or penalized for skipping daytime meals.
- 🚨 **Snack Police & Danger Zone**:
  - Continuous eating and grazing intercept between **12:30 PM – 5:00 PM**.
  - Prominent **"CRAVING ALERT"** button with a 10-minute psychological delay timer and roasts.
- 🎨 **Dynamic Living UI**:
  - The interface changes throughout the day: **Morning Kickoff** (emerald/sunrise), **Snack Danger Zone** (alert coral), **Evening Wind-down** (indigo), and **Night Kitchen Lockout** (midnight dark).
  - Modern, mobile-first design with fluid cards, elevated typography, and clean contrast.
- 🧔‍♂️ **Interactive Coach Chacha Dialogue**:
  - Proactive time-aware prompts based on the current hour and when you last opened the app.
- ⚡ **Zero-Failure Hybrid Architecture**:
  - Works 100% offline with a smart built-in Indian food heuristic dictionary.
  - Optional: Paste your free Google Gemini API key in **Coach & Data** settings for live AI analysis (1,500 free requests/day).

---

## 🚀 Running Locally

```powershell
python -m http.server 8080
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 📱 Mobile Installation (PWA)

1. Host for free on GitHub Pages:
```powershell
git add .
git commit -m "Operation 227 Health Coach upgrade"
git push
```
2. Open your GitHub Pages URL on your phone's browser (Safari / Chrome).
3. Tap the browser menu ➔ **"Add to Home Screen"**.

---

## 🤖 Setting Up Free Gemini AI (Optional)

1. Get a free API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey) (takes 30 seconds).
2. In the app, tap the **"⚙️ Coach & Data"** tab.
3. Paste your key in **"AI Coach Settings"** and tap **"Save AI Key"**.
4. The key is saved strictly on your device's browser and connects directly to Google's free API.

_Not medical advice — consult your doctor._
