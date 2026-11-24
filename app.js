'use strict';

/* ==========================================================================
   Operation 227 🥊 Health Coach
   Personalized cholesterol control (LDL ↓, HDL ↑), vegetarian protein, 
   snack police, and time-aware living companion.
   ========================================================================== */

const STORAGE_KEY = 'laddooVsMe.v2';
const LEGACY_KEY = 'laddooVsMe.v1';

/* ---------- 6 Gradual Progression Phases ---------- */
const PHASES = [
  { n: 1, name: 'Mithai Diplomacy', emoji: '🍬', sweets: 3, fried: 7, ghee: 4, protein: 55, strictGraze: false,
    rule: 'Mithai max 3 piece/week, sirf lunch ke baad. Mathri/namkeen/biscuit max 1 katori/day. Ghee roti max 4.' },
  { n: 2, name: 'Grazing Band', emoji: '🚫', sweets: 3, fried: 4, ghee: 4, protein: 55, strictGraze: true,
    rule: '1–4 PM sirf EK snack slot — Desk Dabba se. Leftover paratha / random grazing ab penalty dega. Fried max 4/week.' },
  { n: 3, name: 'Protein Subah', emoji: '🥞', sweets: 3, fried: 3, ghee: 3, protein: 65, strictGraze: true,
    rule: 'Poha ki jagah chilla / sprouts / chana. Lunch me curd ya chaas. Ghee roti max 3. Protein 65g target.' },
  { n: 4, name: 'Salad Pehle, Atta Badlo', emoji: '🥗', sweets: 3, fried: 3, ghee: 3, protein: 80, strictGraze: true,
    rule: 'Lunch me salad pehle. Jau / jowar / oats mixed atta. 1 scoop whey. Protein 80g target.' },
  { n: 5, name: 'Brisk & Seeds', emoji: '🏃', sweets: 3, fried: 2, ghee: 2, protein: 80, strictGraze: true,
    rule: 'Walk me 25 min brisk (saans phoole). Daily seed mix (alsi + pumpkin + badaam). Ghee roti max 2.' },
  { n: 6, name: 'LDL Slayer Mode', emoji: '🗡️', sweets: 2, fried: 1, ghee: 1, protein: 80, strictGraze: true,
    rule: 'Mithai 2/week, fried 1/week, ghee roti max 1. Feb 2027 me lipid retest!' },
];

/* ---------- Habits (Normal Days) ---------- */
const HABITS = [
  { id: 'water', slot: '🌅 5:30 AM', label: '2 glass paani uthte hi', phase: 1 },
  { id: 'walk', slot: '🌅 5:30 AM', label: 'Morning walk + yoga (1 hr)', phase: 1 },
  { id: 'brisk', slot: '🌅 5:30 AM', label: '25 min BRISK walk (HDL booster)', phase: 5 },
  { id: 'seeds', slot: '🥛 6:30 AM', label: 'Seed mix: alsi + pumpkin + 4–5 badaam/akhrot', phase: 5 },
  { id: 'proteinBreakfast', slot: '🥞 7:30 AM', label: 'Protein breakfast (chilla / sprouts / chana)', phase: 3 },
  { id: 'saladFirst', slot: '🍛 11 AM Lunch', label: 'Salad pehle khaya', phase: 4 },
  { id: 'millet', slot: '🍛 11 AM Lunch', label: 'Jau / jowar / oats mixed atta roti', phase: 4 },
  { id: 'curd', slot: '🍛 11 AM Lunch', label: 'Curd / raita / chaas li', phase: 3 },
  { id: 'deskDabba', slot: '🥜 1–4 PM', label: 'Sirf EK snack slot, Desk Dabba se (no grazing)', phase: 2 },
  { id: 'whey', slot: '💪 Anytime', label: '1 scoop whey protein', phase: 4 },
  { id: 'dinnerEarly', slot: '🍲 6 PM Dinner', label: 'Dinner 6–7 PM tak ho gaya', phase: 1 },
  { id: 'eveningWalk', slot: '🌙 Night', label: 'Dinner ke baad walk', phase: 1 },
  { id: 'nightFast', slot: '🌙 Night', label: 'Dinner ke baad kitchen band (sirf paani/tulsi tea)', phase: 2 },
];

/* ---------- Habits on Vrat / Fasting Days (Tuesday & Saturday) ---------- */
const VRAT_HABITS = [
  { id: 'vratWater', slot: '🌅 Morning', label: '2–3 glass paani (vrat hydration essential)', phase: 1 },
  { id: 'walk', slot: '🌅 5:30 AM', label: 'Morning walk + yoga (1 hr)', phase: 1 },
  { id: 'phalaharMorning', slot: '☀️ Daytime', label: 'Phalahar: Fruit / dry fruit / makhana / milk (no grains)', phase: 1 },
  { id: 'deskDabba', slot: '🥜 1–4 PM', label: 'Afternoon energy: Makhana / peanuts / gajak portion control', phase: 1 },
  { id: 'vratHydrate', slot: '💧 Afternoon', label: 'Total 8+ glass paani din bhar me', phase: 1 },
  { id: 'vratBreakEarly', slot: '🍲 6 PM Evening', label: 'Vrat break: Halka hygienic dinner 7 PM se pehle', phase: 1 },
  { id: 'eveningWalk', slot: '🌙 Night', label: 'Dinner ke baad walk', phase: 1 },
  { id: 'nightFast', slot: '🌙 Night', label: 'Dinner ke baad kitchen band 🔒', phase: 1 },
];

const SLIPS = [
  { id: 'sweets', emoji: '🍬', label: 'Mithai / laddoo (piece)' },
  { id: 'fried', emoji: '🥨', label: 'Mathri / namkeen / biscuit (katori)' },
  { id: 'paratha', emoji: '🫓', label: 'Leftover paratha (piece)' },
  { id: 'grazing', emoji: '🐐', label: 'Random grazing / continuous snacking' },
];

const PENANCES = [
  '20 squats 🦵', '10 min extra walk 🚶', 'Kal mithai band 🚫', '2 glass paani abhi 💧',
  '30 sec plank x2 🧱', 'Kal ghee-free roti 🫓', '15 min brisk walk 🏃', 'Namkeen packet donate 🎁',
];
const WHEEL_COLORS = ['#0284c7', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#0d9488', '#f97316', '#6366f1'];

const LEVELS = [
  [0, 'Laddoo Addict 🍬'], [300, 'Mathri Muncher (Reformed) 🥨'], [900, 'Chana Challenger 🫘'],
  [1800, 'Chilla Champion 🥞'], [3000, 'Sprout Samurai 🌱'], [4500, 'Protein Pehelwan 💪'],
  [6500, 'LDL Slayer 🗡️'], [9000, 'Heart Ka Hero ❤️‍🔥'],
];

/* ---------- Date & Time Helpers ---------- */
const pad = n => String(n).padStart(2, '0');
const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseD = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (s, n) => { const d = parseD(s); d.setDate(d.getDate() + n); return ymd(d); };
const today = () => ymd(new Date());
const diffDays = (a, b) => Math.round((parseD(b) - parseD(a)) / 86400000);
const weekStart = s => { const d = parseD(s); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return ymd(d); };
const short = s => { const d = parseD(s); return `${d.getDate()}/${d.getMonth() + 1}`; };
const pretty = s => parseD(s).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

const $ = s => document.querySelector(s);
const pick = a => a[Math.floor(Math.random() * a.length)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- State Management ---------- */
function defaultState() {
  const t = today();
  return {
    v: 2,
    start: t,
    phases: [{ n: 1, start: t }],
    days: {},
    weights: [{ date: t, kg: 82.9 }],
    lipids: [{ date: '2026-11-12', total: 227.2, ldl: 149.32, hdl: 57.1, tg: 103.9 }],
    tax: { rate: 50, paid: 0 },
    lastBackup: null,
    aiKey: '', // Google Gemini API Key
    vratSaturday: false, // Tuesday is always on; Saturday is toggleable
    notifications: false,
    lastVisitTime: Date.now(),
    coachDialogue: {}, // Cached AI replies/daily briefings
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return Object.assign(defaultState(), parsed);
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  return defaultState();
}

let S = loadState();
const save = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(S));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
};

const EMPTY_DAY = {
  checks: {},
  slips: {},
  ghee: 0,
  waterGlasses: 0,
  prepMoong: false,
  prepDabba: false,
  prepOutSight: false,
  protein: [], // legacy array [{k, g}]
  meals: [],   // freeform AI-evaluated meals [{id, text, time, protein, verdict, slipType, slipUnits, comment, pts}]
  penances: [],
  beaten: 0,
  lost: 0,
  note: '',
  asked: {},
  challenge: false,
  mood: null,
};

const dv = d => S.days[d] || EMPTY_DAY;
function day(d) {
  if (!S.days[d]) S.days[d] = JSON.parse(JSON.stringify(EMPTY_DAY));
  if (!S.days[d].meals) S.days[d].meals = [];
  return S.days[d];
}
const loggedDays = () => Object.keys(S.days).sort();

/* ---------- Fasting & Time Rules ---------- */
function isVratDay(dateStr) {
  const d = parseD(dateStr);
  const dayOfWeek = d.getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  if (dayOfWeek === 2) return true; // Tuesday is always Vrat
  if (dayOfWeek === 6 && S.vratSaturday) return true; // Saturday is Vrat if enabled
  return false;
}

function getTimeMode() {
  const h = new Date().getHours() + new Date().getMinutes() / 60;
  if (h >= 5 && h < 11.5) return 'morning';
  if (h >= 11.5 && h < 17) return 'danger'; // 11:30 AM to 5 PM is danger zone
  if (h >= 17 && h < 21.5) return 'evening';
  return 'night';
}

function updateThemeStyles(d = cur) {
  const mode = getTimeMode();
  document.body.dataset.time = mode;
  document.body.dataset.vrat = isVratDay(d) ? 'true' : 'false';
  const badge = $('#liveBadge');
  const status = $('#coachStatus');
  if (badge && status) {
    if (isVratDay(d)) {
      status.textContent = '🕉️ Vrat Mode';
    } else if (mode === 'danger') {
      status.textContent = '🚨 Snack Police Active';
    } else if (mode === 'morning') {
      status.textContent = '🌅 Kickoff Mode';
    } else if (mode === 'evening') {
      status.textContent = '🍲 Wind-down';
    } else {
      status.textContent = '🔒 Kitchen Lockout';
    }
  }
}

/* ==========================================================================
   Eating & Digestion Window Protocol
   ========================================================================== */

const REGULAR_WINDOWS = [
  { id: 'b_digest', type: 'fast', from: 0, to: 7.0, title: 'Overnight Repair Fast', emoji: '🔒', nextName: 'Protein Breakfast', nextTime: '7:00 AM' },
  { id: 'breakfast', type: 'eat', from: 7.0, to: 9.0, title: 'Protein Breakfast Window', emoji: '🥞', nextName: 'Morning Digestion', nextTime: '9:00 AM' },
  { id: 'm_digest', type: 'fast', from: 9.0, to: 11.5, title: 'Morning Digestion & Hydration', emoji: '🧘', nextName: 'Salad & Lunch Window', nextTime: '11:30 AM' },
  { id: 'lunch', type: 'eat', from: 11.5, to: 13.0, title: 'Salad & Lunch Window', emoji: '🍛', nextName: 'Metabolic Rest (Danger Zone)', nextTime: '1:00 PM' },
  { id: 'danger_rest', type: 'fast', from: 13.0, to: 16.0, title: 'Metabolic Rest & Fat-Burn (Danger Zone)', emoji: '🛑', nextName: 'Desk Dabba Snack', nextTime: '4:00 PM' },
  { id: 'snack', type: 'eat', from: 16.0, to: 16.75, title: 'Desk Dabba Snack Window', emoji: '🥜', nextName: 'Pre-Dinner Rest', nextTime: '4:45 PM' },
  { id: 'pre_dinner', type: 'fast', from: 16.75, to: 18.5, title: 'Pre-Dinner Rest & Walk', emoji: '🚶', nextName: 'Dinner Window', nextTime: '6:30 PM' },
  { id: 'dinner', type: 'eat', from: 18.5, to: 19.75, title: 'Early Dinner Window', emoji: '🍲', nextName: 'Overnight Fast', nextTime: '7:45 PM' },
  { id: 'night_lock', type: 'fast', from: 19.75, to: 24.0, title: 'Kitchen Locked / Overnight Fast', emoji: '🔒', nextName: 'Breakfast (Tomorrow)', nextTime: '7:00 AM' },
];

const VRAT_WINDOWS = [
  { id: 'v_night', type: 'fast', from: 0, to: 7.0, title: 'Vrat Overnight Rest', emoji: '🔒', nextName: 'Morning Phalahar', nextTime: '7:00 AM' },
  { id: 'v_morning', type: 'eat', from: 7.0, to: 9.5, title: 'Phalahar & Dry Fruits Window', emoji: '🍎', nextName: 'Daytime Vrat Focus', nextTime: '9:30 AM' },
  { id: 'v_fast', type: 'fast', from: 9.5, to: 16.0, title: 'Daytime Sanyam & Hydration Fast', emoji: '🕉️', nextName: 'Afternoon Phalahar Energy', nextTime: '4:00 PM' },
  { id: 'v_snack', type: 'eat', from: 16.0, to: 16.75, title: 'Gajak / Makhana Energy Window', emoji: '🥜', nextName: 'Pre-Dinner Rest', nextTime: '4:45 PM' },
  { id: 'v_pre', type: 'fast', from: 16.75, to: 18.0, title: 'Pre-Dinner Rest & Walk', emoji: '🧘', nextName: 'Vrat Kholna / Dinner', nextTime: '6:00 PM' },
  { id: 'v_dinner', type: 'eat', from: 18.0, to: 19.75, title: 'Vrat Break / Hygienic Dinner Window', emoji: '🍲', nextName: 'Overnight Fast', nextTime: '7:45 PM' },
  { id: 'v_lock', type: 'fast', from: 19.75, to: 24.0, title: 'Kitchen Locked / Overnight Fast', emoji: '🔒', nextName: 'Morning (Tomorrow)', nextTime: '7:00 AM' },
];

function getCurrentWindow(dateStr, now = new Date()) {
  const isVrat = isVratDay(dateStr);
  const windows = isVrat ? VRAT_WINDOWS : REGULAR_WINDOWS;
  const h = now.getHours() + now.getMinutes() / 60;

  let current = windows.find(w => h >= w.from && h < w.to) || windows[windows.length - 1];
  let minsRemaining = Math.max(0, Math.round((current.to - h) * 60));
  let status = current.type === 'eat' ? 'eating' : 'digesting';

  if (current.type === 'fast' && minsRemaining <= 30) {
    status = 'approaching';
  }

  const x = dv(dateStr);
  const lastMeal = x.meals && x.meals.length ? x.meals[x.meals.length - 1] : null;

  return {
    status,
    current,
    minsRemaining,
    nextName: current.nextName,
    nextTime: current.nextTime,
    lastMeal,
    isVrat,
  };
}

function renderCopilotCard(d) {
  const win = getCurrentWindow(d);
  const r = scoreOf(d);
  const x = dv(d);
  const protDeficit = Math.max(0, r.targetProt - r.prot);

  let badgeColor = 'var(--red)';
  let badgeText = '🛑 Digestion Window (No Eating)';
  let bgClass = 'copilot-digesting';

  if (win.status === 'eating') {
    badgeColor = 'var(--green)';
    badgeText = '🟢 Eating Window Open';
    bgClass = 'copilot-eating';
  } else if (win.status === 'approaching') {
    badgeColor = 'var(--amber)';
    badgeText = '🟡 Window Opening Soon';
    bgClass = 'copilot-approaching';
  }

  let message = '';
  let subaction = '';

  if (win.status === 'eating') {
    if (win.isVrat) {
      if (win.current.id === 'v_dinner') {
        message = 'Vrat kholne ka time 🙏 Halka aur hygienic dinner lo (dal + lauki/palak + 1-2 sukhi roti). Overeating aur heavy oily fry se bacho!';
      } else {
        message = 'Phalahar window open hai! Fresh fruit, roasted makhana, thode badam/akhrot ya 1 piece gajak lo for clean energy.';
      }
    } else {
      if (win.current.id === 'breakfast') {
        message = `Breakfast window! Aaj ${r.targetProt}g protein target hai. Moong/besan chilla, sprouts chaat ya chana lo — poha avoid karo!`;
      } else if (win.current.id === 'lunch') {
        message = `Lunch window! Salad pehle khana (blood sugar spike kam hoga). Saath me dal + curd + 2 sukhi roti for solid ~22g protein.`;
      } else if (win.current.id === 'snack') {
        message = `Desk Dabba snack window! 30g bhuna chana ya roasted makhana with chai. Mathri/biscuit ko bilkul haath mat lagana 🙅`;
      } else if (win.current.id === 'dinner') {
        message = `Dinner 7:30 se pehle wrap up karo. Dal + sabzi + 1 sukhi roti. Raat ko liver ko LDL aur fats saaf karne ka time milta hai!`;
      } else {
        message = `Eating window open hai. Protein deficit abhi ${protDeficit}g hai. Clean protein food choose karo!`;
      }
    }
    subaction = `
      <div class="copilot-actions">
        <button class="copilot-btn" data-act="jumpToMeal" style="background:var(--green); color:#fff; border-color:var(--green);">🍽️ Log This Meal</button>
      </div>`;
  } else {
    // Digestion Window (Metabolic Rest)
    const lastMealInfo = win.lastMeal ? `Last eaten: <b>"${esc(win.lastMeal.text)}"</b> (${win.lastMeal.time})` : 'Stomach is in digestive rest.';
    message = `🛑 <b>Bhawesh, abhi khane ka time nahi hai!</b> ${lastMealInfo}. Tumhara body abhi digestion aur fat-burning kar raha hai. Next fuel: <b>${win.nextName} (${win.nextTime})</b> me milega.`;
    
    subaction = `
      <div class="copilot-actions">
        <button class="copilot-btn" data-act="logWater">💧 1 Glass Paani Piya (${x.waterGlasses || 0} logged)</button>
        <button class="copilot-btn alert" data-act="copilotUrge">🚨 Urge Ho Rahi Hai (Coach Help)</button>
      </div>`;
  }

  return `
    <div class="card copilot-card ${bgClass}">
      <div class="copilot-head">
        <div class="copilot-status-badge" style="background:${badgeColor}">
          <span class="live-dot"></span>
          <span>${badgeText}</span>
        </div>
        <span class="copilot-timer">⏳ ${win.minsRemaining} mins bache</span>
      </div>
      <div class="copilot-body">
        <div class="copilot-title">${win.current.emoji} ${win.current.title}</div>
        <p class="copilot-msg">${message}</p>
        ${subaction}
      </div>
    </div>`;
}
function phaseOn(d) {
  let n = 1;
  for (const p of S.phases) if (p.start <= d) n = p.n;
  return PHASES[n - 1];
}

function totalProteinOf(x) {
  const legacyP = (x.protein || []).reduce((a, p) => a + (p.g || 0), 0);
  const mealsP = (x.meals || []).reduce((a, m) => a + (m.protein || 0), 0);
  return legacyP + mealsP;
}

function weekCum(d, key) {
  let c = 0;
  for (let x = weekStart(d); x <= d; x = addDays(x, 1)) {
    c += dv(x).slips[key] || 0;
  }
  return c;
}

function overBudget(d, key, budget) {
  const curTot = weekCum(d, key);
  const prevTot = curTot - (dv(d).slips[key] || 0);
  return Math.max(0, curTot - budget) - Math.max(0, prevTot - budget);
}

function scoreOf(d) {
  const x = dv(d);
  const P = phaseOn(d);
  const isVrat = isVratDay(d);
  const activeHabits = (isVrat ? VRAT_HABITS : HABITS).filter(h => h.phase <= P.n);
  const doneHabits = activeHabits.filter(h => x.checks[h.id]).length;
  const prot = totalProteinOf(x);

  // Slips calculation
  const so = overBudget(d, 'sweets', P.sweets);
  const fo = overBudget(d, 'fried', P.fried);
  const go = Math.max(0, (x.ghee || 0) - P.ghee);
  const pa = P.strictGraze ? (x.slips.paratha || 0) : 0;
  const gr = P.strictGraze ? (x.slips.grazing || 0) : 0;
  const penalty = so * 8 + fo * 8 + go * 3 + pa * 5 + gr * 5;

  // Bonus for penances done, cravings beaten, and challenges
  const bonus = Math.min(15, (x.penances.filter(p => p.done).length + (x.beaten || 0)) * 2 + (x.challenge ? 3 : 0) + (x.prepMoong ? 2 : 0) + (x.prepDabba ? 1 : 0));

  // Habit score (up to 50 pts)
  const habitRatio = activeHabits.length ? doneHabits / activeHabits.length : 1;
  const habitPts = habitRatio * 50;

  // Protein score (up to 25 pts) - on Vrat days target is relaxed to 40g
  const targetProt = isVrat ? Math.min(40, P.protein) : P.protein;
  const protPts = Math.min(prot / targetProt, 1) * 25;

  // Cleanliness score (up to 25 pts minus penalties)
  const cleanPts = Math.max(0, 25 - penalty);

  const rawScore = habitPts + protPts + cleanPts + bonus;
  const finalScore = Math.max(0, Math.min(100, Math.round(rawScore)));

  return {
    score: finalScore,
    done: doneHabits,
    total: activeHabits.length,
    prot,
    targetProt,
    P,
    over: so + fo + pa + gr,
    go,
    isVrat,
  };
}

function streakInfo() {
  let d = today();
  if (!S.days[d] || scoreOf(d).score < 70) d = addDays(d, -1);
  let curRun = 0;
  while (S.days[d] && scoreOf(d).score >= 70) {
    curRun++;
    d = addDays(d, -1);
  }
  let best = 0, run = 0, prev = null;
  for (const x of loggedDays()) {
    const good = scoreOf(x).score >= 70;
    run = good ? (prev && diffDays(prev, x) === 1 ? run + 1 : 1) : 0;
    prev = good ? x : null;
    best = Math.max(best, run);
  }
  return { cur: curRun, best: Math.max(best, curRun) };
}

const totalXP = () => loggedDays().reduce((a, d) => a + scoreOf(d).score, 0);
function levelOf(xp) {
  let i = 0;
  while (i + 1 < LEVELS.length && xp >= LEVELS[i + 1][0]) i++;
  return { name: LEVELS[i][1], next: LEVELS[i + 1] ? LEVELS[i + 1][0] : null };
}
const taxTotal = () => loggedDays().reduce((a, d) => a + scoreOf(d).over, 0) * S.tax.rate;

function phaseStatus() {
  const curPhase = S.phases[S.phases.length - 1];
  const t = today();
  const daysIn = diffDays(curPhase.start, t) + 1;
  let good = 0;
  for (let i = 0; i < 14; i++) {
    const d = addDays(t, -i);
    if (d < curPhase.start) break;
    if (S.days[d] && scoreOf(d).score >= 70) good++;
  }
  return { cur: curPhase, daysIn, good, eligible: curPhase.n < 6 && daysIn >= 14 && good >= 11 };
}

/* ==========================================================================
   AI Coach & Freeform Meal Analyzer Engine
   ========================================================================== */

/**
 * Intelligent Local Heuristic Evaluator (runs offline or when no API key is set)
 */
function evaluateMealLocally(text, isVrat, timeStr) {
  const t = text.toLowerCase();
  let prot = 0;
  let slipType = null;
  let slipUnits = 0;
  let verdict = 'good';
  let comment = '';
  let pts = 0;

  // Protein checks
  if (t.includes('chilla') || t.includes('cheela')) prot += 12;
  if (t.includes('paneer')) prot += 10;
  if (t.includes('soya') || t.includes('soyabean')) prot += 15;
  if (t.includes('sprout') || t.includes('moong')) prot += 8;
  if (t.includes('chana') || t.includes('chole')) prot += 7;
  if (t.includes('dal') || t.includes('daal')) prot += 7;
  if (t.includes('curd') || t.includes('dahi') || t.includes('raita')) prot += 6;
  if (t.includes('chaas') || t.includes('buttermilk')) prot += 3;
  if (t.includes('milk') || t.includes('doodh')) prot += 8;
  if (t.includes('whey') || t.includes('protein powder')) prot += 24;
  if (t.includes('makhana')) prot += 3;
  if (t.includes('peanut') || t.includes('moongphali')) prot += 6;
  if (t.includes('egg') || t.includes('anda')) prot += 12;
  if (t.includes('tofu')) prot += 10;
  if (t.includes('roti') || t.includes('chapati')) prot += 3;

  // Slip / Risk checks
  if (t.includes('samosa') || t.includes('kachori') || t.includes('pakoda') || t.includes('mathri') || t.includes('namkeen') || t.includes('biscuit') || t.includes('chips') || t.includes('bhujia')) {
    slipType = 'fried';
    slipUnits = 1;
    verdict = 'slip';
    comment = 'Trans-fat / fried alert! Ye LDL badhata hai. Walk me 15 min extra daalo 🏃';
  } else if (t.includes('laddoo') || t.includes('mithai') || t.includes('gulab jamun') || t.includes('jalebi') || t.includes('barfi') || t.includes('halwa') || t.includes('rasgulla')) {
    slipType = 'sweets';
    slipUnits = 1;
    verdict = 'slip';
    comment = 'Mithai detected! Swad 30 second, par cholesterol dhyan rakho 🍬';
  } else if (t.includes('paratha') && (t.includes('leftover') || t.includes('bacha hua'))) {
    slipType = 'paratha';
    slipUnits = 1;
    verdict = 'slip';
    comment = 'Leftover paratha grazing! Ye aadat control karni hai 🫓';
  } else if (t.includes('gajak')) {
    // Vrat staple: til + gur
    prot += 4;
    verdict = isVrat ? 'vrat' : 'good';
    comment = 'Gajak: Til me healthy fats hain! Bas jaggery portion ka dhyan rakhna 🍯';
  } else if (t.includes('apple') || t.includes('seb') || t.includes('banana') || t.includes('kela') || t.includes('fruit') || t.includes('amrood')) {
    prot += 1;
    verdict = isVrat ? 'vrat' : 'good';
    comment = 'Fresh fruit = soluble fiber. LDL ko jhaadu maar ke nikalega 🍎🧹';
  } else if (prot >= 12) {
    verdict = 'champion';
    comment = `Shaandar! ~${prot}g solid protein mila. Dil aur muscles dono khush! 💪`;
    pts = 10;
  } else {
    verdict = 'good';
    comment = 'Meal note ho gaya! Paani peena mat bhoolna 💧';
    pts = 5;
  }

  // Afternoon grazing penalty if eating fried/unplanned snacks between 1 PM and 5 PM
  const nowHour = new Date().getHours();
  if (nowHour >= 13 && nowHour <= 17 && slipType) {
    comment += ' (⚠️ Danger zone continuous snacking caught by Snack Police!)';
  }

  return {
    protein: prot,
    verdict,
    slipType,
    slipUnits,
    comment,
    pts,
  };
}

/**
 * Call Google Gemini Flash API with automatic model fallback & clear error handling
 */
async function callGemini(promptText, systemInstruction = '', explicitKey = null) {
  const key = (explicitKey || S.aiKey || '').trim();
  if (!key) return { ok: false, error: 'API key is missing' };

  const payload = {
    contents: [{ parts: [{ text: promptText }] }],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 500,
    },
  };
  if (systemInstruction) {
    payload.systemInstruction = { parts: [{ text: systemInstruction }] };
  }

  // Models to try in order (Gemini 3.5 Flash-Lite first as recommended by Google AI Studio)
  const models = ['gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-1.5-flash'];
  let lastErr = '';

  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
        if (text) return { ok: true, text };
      } else {
        const errJson = await res.json().catch(() => null);
        const errMsg = errJson?.error?.message || `HTTP ${res.status}: ${res.statusText}`;
        lastErr = errMsg;
        // If model is deprecated, not found, or retired, try next model
        if (res.status === 404 || errMsg.toLowerCase().includes('no longer available') || errMsg.toLowerCase().includes('not found')) {
          continue;
        }
        return { ok: false, error: errMsg };
      }
    } catch (e) {
      lastErr = e.message || String(e);
    }
  }

  return { ok: false, error: lastErr || 'Failed to connect to Gemini API' };
}

/**
 * Evaluate Meal with Gemini or fallback to local heuristic
 */
async function evaluateMeal(mealText, dateStr) {
  const isVrat = isVratDay(dateStr);
  const localEval = evaluateMealLocally(mealText, isVrat);

  if (!S.aiKey || !S.aiKey.trim()) return localEval;

  const prompt = `Analyze this food eaten by Bhawesh, an Indian adult on 'Operation 227' to reduce LDL cholesterol from 149, increase HDL (currently 57), hit 65-80g vegetarian protein, and stop afternoon mindless continuous snacking.
Is today Vrat/fasting? ${isVrat ? 'YES (One-time evening meal fast; daytime is fruit/dry fruit/milk/gajak only; evening is regular dinner)' : 'NO (Regular day)'}.
Meal description: "${mealText}".
Current time: ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}.

Respond ONLY with a valid single JSON object with these keys:
{
  "protein": <estimated protein grams as a number>,
  "verdict": <"champion" | "good" | "neutral" | "slip" | "vrat">,
  "slipType": <"sweets" | "fried" | "paratha" | "grazing" | null>,
  "slipUnits": <number of slip units, e.g. 1 if mathri/samosa/mithai or 0 if clean>,
  "comment": "<short 1-2 sentence witty, encouraging Hinglish comment from Coach Chacha>",
  "pts": <points to allocate, 0 to 15>
}`;

  try {
    const aiRes = await callGemini(prompt, 'You are Coach Chacha, a witty, direct, supportive Indian fitness coach who knows Indian foods.');
    if (aiRes && aiRes.ok && aiRes.text) {
      const cleaned = aiRes.text.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (typeof parsed.protein === 'number') {
        return {
          protein: Math.max(0, parsed.protein),
          verdict: parsed.verdict || localEval.verdict,
          slipType: parsed.slipType || localEval.slipType,
          slipUnits: parsed.slipUnits || localEval.slipUnits,
          comment: parsed.comment || localEval.comment,
          pts: parsed.pts || localEval.pts,
        };
      }
    }
  } catch (e) {
    console.warn('Error in AI evaluation, using local evaluation:', e);
  }

  return localEval;
}

/* ==========================================================================
   UI Helpers & Navigation
   ========================================================================== */

let tab = 'today';
let cur = today();

let toastTimer;
function toast(msg, ms = 3200) {
  const t = $('#toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, ms);
}

function confetti() {
  for (let i = 0; i < 28; i++) {
    const s = document.createElement('span');
    s.className = 'confetti';
    s.textContent = pick(['🎉', '💪', '🥦', '❤️', '⭐', '🫘', '🦁', '🕉️']);
    s.style.left = Math.random() * 100 + 'vw';
    s.style.animationDelay = Math.random() * 0.6 + 's';
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 3400);
  }
}

function scoreMsg(s) {
  if (s >= 90) return 'Sher! 🦁 Aaj heart ka hero tum ho.';
  if (s >= 70) return 'Badhiya! LDL ko pasina aa raha hai 💦';
  if (s >= 40) return 'Theek-thaak. 70 cross karo, streak bachao 🔥';
  return 'Laddoo jeet raha hai abhi 😬 — par din abhi baaki hai!';
}

/* ---------- SVG Charting ---------- */
function svgChart({ labels, series, min = 0, max = null, target = null, type = 'line' }) {
  const W = 340, H = 170, L = 30, R = 8, T = 10, B = 22, iw = W - L - R, ih = H - T - B, n = labels.length;
  const vals = series.flatMap(s => s.values).filter(v => v != null);
  if (target != null) vals.push(target);
  if (!vals.length) return '<p class="muted">Abhi data nahi hai. Roz log karo, graph khud banega 📈</p>';
  const lo = min != null ? min : Math.min(...vals);
  const hi = max != null ? max : Math.max(lo + 1, ...vals) * 1.12;
  const y = v => T + ih - ((v - lo) / (hi - lo || 1)) * ih;
  let out = '';
  for (let k = 0; k <= 4; k++) {
    const v = lo + ((hi - lo) * k) / 4, yy = y(v);
    out += `<line x1="${L}" x2="${W - R}" y1="${yy}" y2="${yy}" class="grid"/><text x="${L - 4}" y="${yy + 3}" class="ax" text-anchor="end">${Math.round(v)}</text>`;
  }
  const step = Math.max(1, Math.ceil(n / 7));
  if (type === 'line') {
    const xx = i => L + (n === 1 ? iw / 2 : (i * iw) / (n - 1));
    for (const s of series) {
      let path = '', pen = false, dots = '';
      s.values.forEach((v, i) => {
        if (v == null) { pen = false; return; }
        path += `${pen ? 'L' : 'M'}${xx(i).toFixed(1)} ${y(v).toFixed(1)}`;
        pen = true;
        dots += `<circle cx="${xx(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="2.8" fill="${s.color}"/>`;
      });
      out += `<path d="${path}" fill="none" stroke="${s.color}" stroke-width="2.6" stroke-linejoin="round"/>${dots}`;
    }
    labels.forEach((l, i) => { if (i % step === 0 || i === n - 1) out += `<text x="${xx(i)}" y="${H - 6}" class="ax" text-anchor="middle">${l}</text>`; });
  } else {
    const band = iw / n, bw = (band * 0.8) / series.length;
    series.forEach((s, si) => s.values.forEach((v, i) => {
      if (v == null) return;
      const x0 = L + i * band + band * 0.1 + si * bw, yy = y(Math.max(v, lo));
      out += `<rect x="${x0.toFixed(1)}" y="${yy.toFixed(1)}" width="${Math.max(1, bw - 1).toFixed(1)}" height="${Math.max(0, T + ih - yy).toFixed(1)}" rx="3" fill="${s.color}"/>`;
    }));
    labels.forEach((l, i) => { if (i % step === 0 || i === n - 1) out += `<text x="${L + i * band + band / 2}" y="${H - 6}" class="ax" text-anchor="middle">${l}</text>`; });
  }
  if (target != null) out += `<line x1="${L}" x2="${W - R}" y1="${y(target)}" y2="${y(target)}" class="target"/>`;
  const legend = series.length > 1 || target != null
    ? `<div class="legend">${series.map(s => `<span><i style="background:${s.color}"></i>${s.name}</span>`).join('')}${target != null ? '<span><i style="background:#ef4444"></i>Target</span>' : ''}</div>`
    : '';
  return `<svg viewBox="0 0 ${W} ${H}" class="chart">${out}</svg>${legend}`;
}

/* ==========================================================================
   Coach Chacha Dynamic Questions & Living Feed
   ========================================================================== */

const daily = (arr, d) => arr[((diffDays('2026-01-01', d) % arr.length) + arr.length) % arr.length];
const RETEST = '2027-02-15';
const SNOOZE_MS = 45 * 60000;
const isPending = a => !a || (a.snooze && Date.now() - a.t > SNOOZE_MS);

function coachQuestions(d, now = new Date()) {
  const x = dv(d), P = phaseOn(d), A = x.asked || {};
  const h = now.getHours() + now.getMinutes() / 60;
  const isVrat = isVratDay(d);
  const active = id => (isVrat ? VRAT_HABITS : HABITS).some(k => k.id === id && k.phase <= P.n);
  const tick = id => y => { if (active(id)) y.checks[id] = true; };
  const slip = (id, n = 1) => y => { y.slips[id] = (y.slips[id] || 0) + n; };
  const none = () => {};
  const later = ['Baad me ⏰', 'SNOOZE'];
  const urgent = [], out = [];
  const q = (list, id, from, text, opts, cond = true) => {
    if (cond && h >= from && isPending(A[id])) list.push({ id, text, opts, from });
  };

  // 12:30–4:30 PM: Hourly Snack Police Craving Checks
  for (let hr = 13; hr <= 16; hr++) {
    const id = `crave${hr}`;
    if (h >= hr - 0.5 && h < hr + 0.5) {
      q(urgent, id, 0, `🚨 ${hr - 12} PM Snack Police: Abhi continuous grazing ya craving ka kya scene hai?`, [
        ['Sab control me hai 😎', none, 'Shabaash! Desk Dabba zindabad 🫘'],
        ['Mann ho raha hai 😬', 'SOS'],
        ['Kuch kha liya 🙈', none, 'Imaandari se log karo — neeche likho kya khaya 👇'],
      ]);
    }
  }

  // Morning Checks
  q(out, 'water', 5, isVrat ? '💧 Vrat ki shuruaat 2 glass paani se hui?' : '💧 Subah uthke 2 glass paani piya?', [
    ['Haan ✅', tick(isVrat ? 'vratWater' : 'water'), 'Engine on! 🚿'],
    ['Abhi peeta hoon 💧', tick(isVrat ? 'vratWater' : 'water'), 'Ek bada glass pee lo!'],
  ], !x.checks[isVrat ? 'vratWater' : 'water']);

  q(out, 'walk', 5.5, '🚶 Morning walk + yoga ho gaya?', [
    ['Haan poora ✅', tick('walk'), 'Sher! 🦁'],
    ['Thoda sa kiya', tick('walk'), 'Kuch nahi se bahut behtar 👍'],
    ['Aaj miss 😔', none, 'Dinner ke baad 15 min zaroor chalna 🫡'],
    later,
  ], !x.checks.walk);

  // Vrat Mode Daytime Check-ins
  if (isVrat) {
    q(out, 'vratDaytime', 11, '🍎 Vrat status: Din me sirf phalahar (fruit, dry fruit, makhana, gajak)?', [
      ['Haan, phalahar chal raha hai 🙏', tick('phalaharMorning'), 'Sanyam ka naam hi vrat hai 🕉️'],
      ['Paani peena bhool gaya', none, 'Abhi 2 glass paani lo — hydration zaroori hai 💧'],
      ['Gajak / dry fruit liya', tick('phalaharMorning'), 'Perfect energy boost! 🥜'],
    ], !x.checks.phalaharMorning);

    q(out, 'vratBreak', 18, '🍲 6 PM: Vrat kholne ka time! Shaam ka dinner kaisa plan hai?', [
      ['Halka aur hygienic ✅', tick('vratBreakEarly'), 'Smart move! Achanak heavy khane se bacho.'],
      ['Thoda heavy ho gaya 😅', none, 'Koi na, dinner ke baad 15 min tehlo 🚶'],
      later,
    ], !x.checks.vratBreakEarly);
  } else {
    // Regular Day Check-ins
    q(out, 'dabbaReady', 7.0, '🥜 Desk Dabba check: Aaj ke liye 30g bhuna chana + makhana + badaam desk pe rakh liya? Mathri door rakhna!', [
      ['Haan desk pe ready hai 🥜', y => { y.prepDabba = true; }, 'Champion move! 3 PM craving ka ilaaj ready hai 🏆'],
      ['Abhi pack karta hoon', y => { y.prepDabba = true; }, 'Sirf 2 minute lagenge — transparent dabba bhar lo!'],
      later,
    ], !x.prepDabba);

    q(out, 'breakfast', 7.5, '🍳 Breakfast me kya tha? (Protein focus)', [
      ['Chilla / Sprouts 🥞', tick('proteinBreakfast'), 'Protein breakfast! Champion move 🏆'],
      ['Poha / Regular', none, 'Poha theek hai, par kal chilla try karein? 😉'],
      ['Leftover paratha 🫓', slip('paratha'), 'Paratha ji phir aa gaye 😅 Grazing alert!'],
      later,
    ], !x.checks.proteinBreakfast);

    q(out, 'salad', 11, '🥗 Lunch me salad pehle khaya?', [
      ['Haan ✅', tick('saladFirst'), 'Salad pehle = lower insulin spike! 🥗'],
      ['Nahi 🥕', none, 'Kal plate me pehle kheera-gajar rakh dena'],
    ], P.n >= 4 && !x.checks.saladFirst);

    q(out, 'dinner', 18, '🍲 Dinner 7 PM se pehle ho gaya?', [
      ['Haan, jaldi kiya ✅', tick('dinnerEarly'), 'Early dinner = repair time for liver & arteries ❤️'],
      ['Thoda late 🕘', none, 'Kal 7 se pehle try karo ⏰'],
      later,
    ], !x.checks.dinnerEarly);
  }

  q(out, 'eveWalk', 19.5, '🌙 Dinner ke baad walk?', [
    ['Haan ✅', tick('eveningWalk'), 'Digestion masterstroke 🚶'],
    ['Abhi jaunga ⏰', 'SNOOZE'],
  ], !x.checks.eveningWalk);

  q(out, 'night', 21.5, '🔒 Kitchen band? Sirf paani / tulsi tea?', [
    ['Haan, kitchen locked 🔒', tick('nightFast'), 'Subah ka score upar jaayega! 🏆'],
    ['Thoda grazing ho gaya 😅', slip('grazing'), 'Noted. Kal kitchen door se door rehna 🚪'],
  ], P.n >= 2 && !x.checks.nightFast);

  q(out, 'nightChillaPrep', 20.0, '🌱 Kal ki tayyari: Kal ke breakfast ke liye moong/dal bhigoyi? Aur Desk Dabba check kiya?', [
    ['Haan, moong bhigoyi & dabba ready ✅', y => { y.prepMoong = true; y.prepDabba = true; }, 'Kal ka din jeetne ki tayyari aaj raat se shuru! 🥇 +2 bonus points'],
    ['Abhi bhigota hoon 🌱', y => { y.prepMoong = true; }, 'Kitchen me jao, 1 katori moong paani me daal do!'],
    later,
  ], !x.prepMoong);

  return urgent.concat(out.sort((a, b) => b.from - a.from));
}

function insights(d) {
  const P = phaseOn(d), out = [], y = addDays(d, -1), st = streakInfo();
  const dayNo = diffDays(S.start, d) + 1;
  const isVrat = isVratDay(d);

  if (isVrat) {
    out.push(`🕉️ Aaj Vrat Mode active hai (One-time evening meal). Din me sirf phalahar aur hydration!`);
  } else {
    out.push(`📅 Journey ka Day ${dayNo} · ${P.emoji} Phase ${P.n}: ${P.name}`);
  }

  if (st.cur >= 2) out.push(`🔥 ${st.cur} din ki streak!${st.cur >= st.best ? ' Ye tumhara RECORD hai 🏆' : ` Record ${st.best} hai!`}`);

  if (S.days[y]) {
    const s = scoreOf(y).score;
    out.push(s >= 70 ? `Kal ka score ${s} tha. Aaj bhi consistency barkaraar rakho 💪` : `Kal ${s} tha. Aaj usse upar le jaate hain ⬆️`);
  }

  const sl = P.sweets - weekCum(d, 'sweets');
  out.push(sl > 0 ? `🍬 Mithai budget: ${sl} piece bache hain.` : '🍬 Is hafte ka mithai budget khatam. Fruit pe shift karo 🍎');

  const fl = P.fried - weekCum(d, 'fried');
  if (fl <= 1) out.push(fl > 0 ? `🥨 Fried budget me sirf ${fl} katori bachi hai` : '🥨 Fried budget khatam — Desk Dabba zindabad 🫘');

  const toRetest = diffDays(d, RETEST);
  if (toRetest > 0) out.push(`🩸 Lipid retest me ${toRetest} din baaki. LDL 149 se 119 ka target!`);

  return out;
}

/* ==========================================================================
   Push / Phone Notifications Engine
   ========================================================================== */

async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    toast('Notifications is browser me supported nahi hai');
    return;
  }
  try {
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      S.notifications = true;
      save();
      toast('🔔 Daily Phone Reminders Enabled! 🚀');
      sendLocalNotification('Operation 227 🥊 Health Coach', '🔔 Reminders active! Kal ke chilla & Desk Dabba ka alert time pe aayega.');
      render();
    } else {
      toast('Notification permission allow nahi hui.');
    }
  } catch (e) {
    toast('Notification error: ' + (e.message || e));
  }
}

function sendLocalNotification(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(reg => {
          reg.showNotification(title, {
            body,
            icon: 'icon.svg',
            badge: 'icon.svg',
          });
        }).catch(() => {
          new Notification(title, { body, icon: 'icon.svg' });
        });
      } else {
        new Notification(title, { body, icon: 'icon.svg' });
      }
    } catch (e) {
      // fallback
    }
  }
}

function checkScheduledAlerts() {
  if (!S.notifications || !('Notification' in window) || Notification.permission !== 'granted') return;
  const now = new Date();
  const h = now.getHours() + now.getMinutes() / 60;
  const t = today();
  const x = dv(t);

  // Night Prep Alert (8:00 PM – 10:30 PM)
  if (h >= 20.0 && h <= 22.5 && !x.prepMoong && !x.asked.nightPrepAlert) {
    x.asked = x.asked || {};
    x.asked.nightPrepAlert = { t: Date.now() };
    save();
    sendLocalNotification('🌙 Kal Ki Tayyari (Night Prep)', '🌱 Kal ke breakfast ke liye moong/dal bhigo do aur 30g bhuna chana + makhana Desk Dabba me pack kar lo!');
  }

  // Morning Desk Dabba Alert (7:30 AM – 9:00 AM)
  if (h >= 7.5 && h <= 9.0 && !x.prepDabba && !x.asked.morningDabbaAlert) {
    x.asked = x.asked || {};
    x.asked.morningDabbaAlert = { t: Date.now() };
    save();
    sendLocalNotification('🥜 Desk Dabba Alert', 'Aaj ke liye Desk Dabba desk pe rakh lo! Mathri dabba door rakhna 🙏');
  }

  // Danger Zone Alert (1:00 PM)
  if (h >= 13.0 && h <= 13.5 && !x.asked.dangerZoneAlert) {
    x.asked = x.asked || {};
    x.asked.dangerZoneAlert = { t: Date.now() };
    save();
    sendLocalNotification('🚨 Snack Police Danger Zone (1–4 PM)', 'Continuous grazing band! Sirf paani piyo aur Desk Dabba pass rakho.');
  }
}

/* ==========================================================================
   Render Top Header & Living Feed
   ========================================================================== */

function renderHeader() {
  const P = phaseOn(today());
  const st = streakInfo();
  const xp = totalXP();
  const lv = levelOf(xp);
  const pending = Math.max(0, taxTotal() - S.tax.paid);
  const isVrat = isVratDay(today());

  $('#quote').textContent = daily(QUOTES, today());
  $('#chips').innerHTML = `
    <span class="chip-h">${isVrat ? '🕉️ Vrat Day' : `${P.emoji} Phase ${P.n}`}</span>
    <span class="chip-h">🔥 ${st.cur} din streak</span>
    <span class="chip-h">${lv.name}</span>
    <span class="chip-h">🫙 Tax ₹${pending}</span>`;
}

function renderBanner() {
  const needsBkp = loggedDays().length >= 3 && (!S.lastBackup || diffDays(S.lastBackup, today()) >= 7);
  $('#banner').innerHTML = needsBkp
    ? `<div class="banner"><span>💾 Weekly Backup reminder! Drive / WhatsApp pe save karein.</span><button class="btn" data-act="share">Backup Lo</button></div>`
    : '';
}

function renderCoachCard() {
  const now = new Date(), d = today();
  const qs = coachQuestions(d, now).slice(0, 2);
  const ins = insights(d);
  const topInsight = ins[0] || 'Consistency is victory 🐢';

  const qHtml = qs.length
    ? qs.map(q => `
        <div class="coach-bubble" data-qid="${q.id}">
          <b>${q.text}</b>
          <div class="coach-opts" data-qid="${q.id}">
            ${q.opts.map((o, i) => `<button class="coach-opt" data-act="coachOptToggle" data-q="${q.id}" data-o="${i}">${o[0]}</button>`).join('')}
          </div>
          <div style="margin-top:8px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
            <button class="coach-opt-done" data-act="submitQuestionMulti" data-q="${q.id}">Done / Save Selected ✅</button>
            <small class="muted" style="margin:0;">Multi-select kar sakte ho</small>
          </div>
          <div class="q-custom-wrap">
            <input type="text" class="q-custom-input" id="customInput_${q.id}" placeholder="Kuch alag khaya? Yahan likho (e.g. 2 besan chilla ya poha)...">
            <button class="q-custom-btn" data-act="submitQuestionCustom" data-q="${q.id}">AI Check 🤖</button>
          </div>
        </div>`).join('')
    : `<div class="coach-bubble" style="color:var(--green); font-weight:600;">
         ✅ Abhi ke sab sawaal update hain! Agla check-in time pe hoga. Focus on Desk Dabba & Paani 💧
       </div>`;

  return `
    <div class="card coach-feed">
      <div class="coach-header">
        <div class="coach-avatar">🧔‍♂️</div>
        <div class="coach-meta">
          <b>Coach Chacha · ${pad(now.getHours())}:${pad(now.getMinutes())}</b>
          <small>${topInsight}</small>
        </div>
      </div>
      ${qHtml}
    </div>`;
}

function renderGyaanCard(d) {
  if (typeof SUPERFOODS === 'undefined' || !SUPERFOODS.length) return '';
  const item = daily(SUPERFOODS, d);

  return `
    <div class="card gyaan-card">
      <div class="gyaan-header">
        <span class="gyaan-badge">${item.badge}</span>
        <span class="muted" style="font-size:0.75rem;">Daily Superfood Gyaan 💡</span>
      </div>
      <div class="gyaan-title">${item.icon} ${item.name}</div>
      <div class="gyaan-target">🎯 Target: ${item.target}</div>
      <p class="gyaan-fact"><b>Khaas Baat:</b> ${item.fact}</p>
      <div class="gyaan-box">
        <b>🔬 Scientific Reason:</b> ${item.science}
      </div>
      <div class="gyaan-box" style="margin-top:6px; background:rgba(255,255,255,0.7);">
        <b>🍳 Ghar Par Kaise Khayein:</b> ${item.howToEat}
      </div>
      <button class="gyaan-btn" data-act="askSuperfoodAi" data-food="${esc(item.name)}">
        🤖 Ask AI Coach about ${item.name}
      </button>
    </div>`;
}

/* ==========================================================================
   Render Tabs
   ========================================================================== */

function render() {
  updateThemeStyles(cur);
  renderHeader();
  renderBanner();
  document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.tab').forEach(s => { s.hidden = s.id !== tab; });

  const renderers = {
    today: renderToday,
    stats: renderStats,
    plan: renderPlan,
    backup: renderBackup,
  };
  if (renderers[tab]) renderers[tab]();
}

function renderToday() {
  const d = cur, x = dv(d), r = scoreOf(d), P = r.P, isToday = d === today();
  const activeHabits = (r.isVrat ? VRAT_HABITS : HABITS).filter(h => h.phase <= P.n);
  const ringColor = r.score >= 70 ? '#10b981' : r.score >= 40 ? '#f59e0b' : '#ef4444';

  // Checklist
  let checks = '', slot = '';
  for (const h of activeHabits) {
    if (h.slot !== slot) { checks += `<div class="slot">${h.slot}</div>`; slot = h.slot; }
    const on = !!x.checks[h.id];
    checks += `<label class="check ${on ? 'on' : ''}"><input type="checkbox" data-act="check" data-id="${h.id}" ${on ? 'checked' : ''}><span>${h.label}</span></label>`;
  }

  // Slips
  const slipsHtml = SLIPS.map(s => {
    const n = x.slips[s.id] || 0;
    let info = '';
    if (s.id === 'sweets' || s.id === 'fried') {
      const used = weekCum(d, s.id), budget = P[s.id];
      info = `<small class="${used > budget ? 'over' : ''}">Is hafte: ${used}/${budget} allowed</small>`;
    } else {
      info = `<small>${P.strictGraze ? 'Grazing penalty active 😈' : 'Tracking mode'}</small>`;
    }
    return `
      <div class="counter">
        <div><b>${s.emoji} ${s.label}</b>${info}</div>
        <div class="ctl">
          <button data-act="slip" data-id="${s.id}" data-d="-1">−</button>
          <span>${n}</span>
          <button data-act="slip" data-id="${s.id}" data-d="1">+</button>
        </div>
      </div>`;
  }).join('');

  // Logged Meals History
  const mealsList = (x.meals && x.meals.length)
    ? x.meals.map((m, i) => `
        <div class="meal-item ${m.verdict || 'good'}">
          <div class="meal-desc">
            <b>${esc(m.text)}</b>
            <small>${m.time || ''} · ${esc(m.comment || '')}</small>
          </div>
          <div class="meal-pills">
            ${m.protein ? `<span class="badge-prot">+${m.protein}g P</span>` : ''}
            ${m.slipType ? `<span class="badge-slip">${m.slipType}</span>` : ''}
            <button class="del-btn" data-act="delMeal" data-i="${i}" title="Delete">✕</button>
          </div>
        </div>`).join('')
    : '<p class="muted" style="margin:4px 0 0;">Abhi koi meal log nahi kiya. Neeche likho kya khaya 👇</p>';

  // Protein Progress
  const pct = Math.min(100, (r.prot / r.targetProt) * 100);

  // Penances
  const pens = x.penances.length
    ? x.penances.map((p, i) => `<label class="check ${p.done ? 'on' : ''}"><input type="checkbox" data-act="penance" data-i="${i}" ${p.done ? 'checked' : ''}><span>${esc(p.text)}</span></label>`).join('')
    : '<p class="muted">Koi saza pending nahi. Clean diet! 😇</p>';

  $('#today').innerHTML = `
    <!-- Date Navigator -->
    <div class="card datebar">
      <button class="icon-btn" data-act="prevDay">◀</button>
      <div style="text-align:center">
        <b>${isToday ? 'Aaj · ' : ''}${pretty(d)}</b>
        <small>${r.isVrat ? '🕉️ Vrat Day' : `${P.emoji} Phase ${P.n}: ${P.name}`}</small>
      </div>
      <button class="icon-btn" data-act="nextDay" ${isToday ? 'disabled' : ''}>▶</button>
    </div>

    <!-- Live Eating / Digestion Copilot Traffic Light -->
    ${isToday ? renderCopilotCard(d) : ''}

    <!-- Living Coach Dialogue -->
    ${isToday ? renderCoachCard() : ''}

    <!-- Score Card -->
    <div class="card scorecard">
      <div class="ring" style="--p:${r.score};--c:${ringColor}">
        <span>${r.score}</span>
      </div>
      <div style="flex:1;">
        <div class="score-msg">${scoreMsg(r.score)}</div>
        <small>Habits: ${r.done}/${r.total} · Protein: ${r.prot}/${r.targetProt}g</small>
        ${r.over ? `<small class="over">⚠️ ${r.over} slip budget se bahar</small>` : '<small style="color:var(--green)">✅ Diet budget under control</small>'}
      </div>
    </div>

    <!-- Craving Alert Button -->
    <button class="sos-banner" data-act="sos">
      <div class="sos-text">
        <span class="sos-title">🚨 CRAVING ALERT / SNACK POLICE</span>
        <span class="sos-sub">Mathri, laddoo, murukku bula raha hai? Pehle yahan tap karo!</span>
      </div>
      <span class="sos-pill">10 Min Delay</span>
    </button>

    <!-- Freeform AI Meal Logger -->
    <div class="card meal-logger">
      <h3>🍽️ Smart Meal Logger (AI Point Allocation)</h3>
      <div class="meal-input-wrap">
        <input type="text" id="mealInput" class="meal-input" placeholder="Kya khaya? (e.g. 2 besan chilla + dahi, ya gajak)...">
        <button class="meal-btn" data-act="logMeal">Log</button>
      </div>
      <div class="meal-quick-tags">
        <button class="quick-tag" data-act="quickMeal" data-txt="2 Moong chilla + dahi">+ 2 Chilla</button>
        <button class="quick-tag" data-act="quickMeal" data-txt="Roasted chana 30g Desk Dabba">+ Bhuna Chana</button>
        <button class="quick-tag" data-act="quickMeal" data-txt="Makhana katori Desk Dabba">+ Makhana</button>
        <button class="quick-tag" data-act="quickMeal" data-txt="Gajak 2 piece">+ Gajak</button>
        <button class="quick-tag" data-act="quickMeal" data-txt="Sprouts chaat katori">+ Sprouts</button>
        <button class="quick-tag" data-act="quickMeal" data-txt="1 Scoop whey protein">+ Whey</button>
      </div>
      <div class="meal-log-list">${mealsList}</div>
    </div>

    <!-- Daily Superfood & Science Spot -->
    ${renderGyaanCard(d)}

    <!-- Protein Progress Bar -->
    <div class="card">
      <div class="card-title-row">
        <h3 style="margin:0;">💪 Protein Meter: ${r.prot} / ${r.targetProt} g</h3>
        <span style="font-weight:700; color:var(--accent); font-size:0.9rem;">${Math.round(pct)}%</span>
      </div>
      <div class="bar"><i style="width:${pct}%"></i></div>
      <small>Target: ${r.targetProt}g ${r.isVrat ? '(Vrat relaxed target)' : '(HDL & lean mass booster)'}</small>
    </div>

    <!-- Habit Checklist -->
    <div class="card">
      <h3>${r.isVrat ? '🕉️ Vrat Day Checklist' : '✅ Aaj Ki Habits Checklist'}</h3>
      ${checks}
    </div>

    <!-- Daily Challenge -->
    <div class="card">
      <h3>🎯 Aaj Ka Challenge (+3 Bonus)</h3>
      <label class="check ${x.challenge ? 'on' : ''}">
        <input type="checkbox" data-act="challenge" ${x.challenge ? 'checked' : ''}>
        <span>${daily(CHALLENGES, d)}</span>
      </label>
      <small style="margin-top:8px;">💡 <b>Gyaan:</b> ${daily(TIPS, d)}</small>
    </div>

    <!-- Slips & Ghee Tracker -->
    <div class="card">
      <h3>🙈 Slips &amp; Grazing Counter</h3>
      ${slipsHtml}
      <div class="counter">
        <div><b>🧈 Ghee wali roti</b><small class="${r.go ? 'over' : ''}">Limit: ${P.ghee}/day</small></div>
        <div class="ctl">
          <button data-act="ghee" data-d="-1">−</button>
          <span>${x.ghee || 0}</span>
          <button data-act="ghee" data-d="1">+</button>
        </div>
      </div>
    </div>

    <!-- Saza List -->
    <div class="card">
      <h3>😈 Wheel of Penance (Saza List)</h3>
      ${pens}
      <div class="row" style="margin-top:10px;">
        <button class="btn alt" data-act="wheel">🎡 Wheel Ghumao</button>
      </div>
    </div>

    <!-- Night & Tomorrow Prep Card -->
    <div class="card" style="border-left: 4px solid var(--purple);">
      <div class="card-title-row">
        <h3 style="margin:0;">🌱 Kal Ki Tayyari (Chilla &amp; Desk Dabba Prep)</h3>
        <span class="badge-prot">+3 Bonus</span>
      </div>
      <p class="muted" style="margin:6px 0 10px;">Subah uthke sochoge toh galti hogi. Aaj raat prepare karo:</p>
      <label class="check ${x.prepMoong ? 'on' : ''}">
        <input type="checkbox" data-act="togglePrep" data-k="prepMoong" ${x.prepMoong ? 'checked' : ''}>
        <span>🌱 <b>Moong / Dal bhigo di</b> (Kal subah ke high-protein chilla ke liye)</span>
      </label>
      <label class="check ${x.prepDabba ? 'on' : ''}">
        <input type="checkbox" data-act="togglePrep" data-k="prepDabba" ${x.prepDabba ? 'checked' : ''}>
        <span>🥜 <b>Desk Dabba pack kiya</b> (30g bhuna chana + 1 katori makhana + 4 badaam/akhrot)</span>
      </label>
      <label class="check ${x.prepOutSight ? 'on' : ''}">
        <input type="checkbox" data-act="togglePrep" data-k="prepOutSight" ${x.prepOutSight ? 'checked' : ''}>
        <span>📦 <b>Mathri dabba desk se door</b> (Cupboard me upar shelf pe rakh diya)</span>
      </label>
    </div>

    <!-- Notes -->
    <div class="card">
      <h3>📝 Aaj Ka Note</h3>
      <textarea id="note" rows="2" placeholder="Trigger kya hua? Mood kaisa tha?">${esc(x.note || '')}</textarea>
    </div>`;
}

function renderStats() {
  const t = today();
  const days = loggedDays();
  const st = streakInfo();
  const last7 = [...Array(7)].map((_, i) => addDays(t, -i)).filter(d => S.days[d]);
  const avg7 = last7.length ? Math.round(last7.reduce((a, d) => a + scoreOf(d).score, 0) / last7.length) : 0;
  const protAvg = last7.length ? Math.round(last7.reduce((a, d) => a + totalProteinOf(dv(d)), 0) / last7.length) : 0;
  const beaten = days.reduce((a, d) => a + (S.days[d].beaten || 0), 0);
  const tax = taxTotal();

  const d30 = [...Array(30)].map((_, i) => addDays(t, i - 29));
  const scoreChart = svgChart({ labels: d30.map(short), series: [{ name: 'Score', color: '#0284c7', values: d30.map(d => S.days[d] ? scoreOf(d).score : null) }], min: 0, max: 100, target: 70 });

  const weeks = [...Array(12)].map((_, i) => addDays(weekStart(t), (i - 11) * 7));
  const wsum = (w, k) => { let c = 0; for (let i = 0; i < 7; i++) c += dv(addDays(w, i)).slips[k] || 0; return c; };
  const slipChart = svgChart({
    type: 'bar', labels: weeks.map(short),
    series: [
      { name: 'Mithai', color: '#ef4444', values: weeks.map(w => wsum(w, 'sweets')) },
      { name: 'Fried', color: '#f59e0b', values: weeks.map(w => wsum(w, 'fried')) },
    ],
  });

  const d14 = [...Array(14)].map((_, i) => addDays(t, i - 13));
  const protChart = svgChart({ type: 'bar', labels: d14.map(short), series: [{ name: 'Protein g', color: '#10b981', values: d14.map(d => S.days[d] ? totalProteinOf(S.days[d]) : null) }], target: phaseOn(t).protein });

  const ws = [...S.weights].sort((a, b) => a.date.localeCompare(b.date));
  const wkg = ws.map(w => w.kg);
  const weightChart = svgChart({ labels: ws.map(w => short(w.date)), series: [{ name: 'Weight', color: '#6366f1', values: wkg }], min: wkg.length ? Math.floor(Math.min(...wkg) - 3) : 0, max: wkg.length ? Math.ceil(Math.max(...wkg) + 3) : null });

  const lp = [...S.lipids].sort((a, b) => a.date.localeCompare(b.date));
  const lipChart = svgChart({
    labels: lp.map(l => short(l.date)),
    series: [{ name: 'LDL', color: '#ef4444', values: lp.map(l => l.ldl) }, { name: 'HDL', color: '#10b981', values: lp.map(l => l.hdl) }],
    min: 0, target: 100,
  });
  const lipRows = lp.map(l => `<tr><td>${short(l.date)}/${parseD(l.date).getFullYear() % 100}</td><td>${l.total ?? '–'}</td><td><b>${l.ldl ?? '–'}</b></td><td>${l.hdl ?? '–'}</td><td>${l.tg ?? '–'}</td><td><button data-act="delLipid" data-date="${l.date}">🗑️</button></td></tr>`).join('');

  $('#stats').innerHTML = `
    <div class="card">
      <h3>🏆 Scoreboard</h3>
      <div class="tiles">
        <div class="tile"><b>${days.length}</b><span>Din Log Kiye</span></div>
        <div class="tile"><b>${avg7}</b><span>Avg Score (7 Din)</span></div>
        <div class="tile"><b>🔥 ${st.cur} / ${st.best}</b><span>Streak Abhi / Best</span></div>
        <div class="tile"><b>${beaten}</b><span>Cravings Harayi 💪</span></div>
        <div class="tile"><b>${protAvg} g</b><span>Avg Protein / Din</span></div>
        <div class="tile"><b>₹${tax}</b><span>Murukku Tax (₹${S.tax.paid} Jar Me)</span></div>
      </div>
      <div class="row" style="margin-top:12px;"><button class="btn ghost" data-act="payTax">🫙 Jar Me Paise Daale</button></div>
    </div>

    <div class="card"><h3>📈 Daily Score (30 Din)</h3>${scoreChart}</div>
    <div class="card"><h3>🍬 Mithai &amp; 🥨 Fried Per Week</h3>${slipChart}</div>
    <div class="card"><h3>💪 Protein Trend (14 Din)</h3>${protChart}</div>
    
    <div class="card">
      <h3>⚖️ Weight Log</h3>
      ${weightChart}
      <div class="form-grid" style="margin-top:12px;">
        <div><label>Date</label><input type="date" id="wDate" value="${t}" max="${t}"></div>
        <div><label>Weight (kg)</label><input type="number" id="wKg" step="0.1" placeholder="82.9"></div>
      </div>
      <button class="btn" data-act="addWeight">Save Weight</button>
    </div>

    <div class="card">
      <h3>🩸 Lipid Profile (Target: LDL &lt; 100, HDL &gt; 60)</h3>
      ${lp.length > 1 ? lipChart : ''}
      <table>
        <tr><th>Date</th><th>Total</th><th>LDL</th><th>HDL</th><th>TG</th><th></th></tr>
        ${lipRows}
      </table>
      <div class="form-grid" style="margin-top:12px;">
        <div><label>Date</label><input type="date" id="lDate" value="${t}" max="${t}"></div>
        <div><label>Total</label><input type="number" id="lTotal" step="0.1"></div>
        <div><label>LDL</label><input type="number" id="lLdl" step="0.1"></div>
        <div><label>HDL</label><input type="number" id="lHdl" step="0.1"></div>
        <div><label>Triglycerides</label><input type="number" id="lTg" step="0.1"></div>
      </div>
      <button class="btn" data-act="addLipid">Add Lipid Report</button>
    </div>`;
}

function renderPlan() {
  const ps = phaseStatus();
  const phases = PHASES.map(p => `
    <div class="phase ${p.n === ps.cur.n ? 'cur' : p.n < ps.cur.n ? 'done' : ''}">
      <b>${p.n < ps.cur.n ? '✅' : p.n === ps.cur.n ? '👉' : '🔒'} Phase ${p.n}: ${p.emoji} ${p.name}</b>
      <small>${p.rule}</small>
    </div>`).join('');
  const options = PHASES.map(p => `<option value="${p.n}" ${p.n === ps.cur.n ? 'selected' : ''}>Phase ${p.n} – ${p.name}</option>`).join('');

  $('#plan').innerHTML = `
    <div class="card">
      <h3>🗺️ Phase Progression</h3>
      <p>Phase ${ps.cur.n} me <b>${ps.daysIn}</b> din · Pichle 14 din me <b>${ps.good}</b> din 70+ score.</p>
      <small>Next phase unlock: 14 din + 11 din 70+ score.</small>
      <div class="row" style="margin-top:12px;">
        <button class="btn good" data-act="nextPhase" ${ps.eligible ? '' : 'disabled'}>🔓 Next Phase Unlock Karo</button>
      </div>
      <details style="margin-top:12px;">
        <summary class="muted">Manually phase badlo</summary>
        <div class="row" style="margin-top:8px;">
          <select id="phaseSel">${options}</select>
          <button class="btn ghost" data-act="setPhase">Set</button>
        </div>
      </details>
    </div>

    <div class="card"><h3>📜 6 Phases Plan</h3>${phases}</div>

    <div class="card">
      <h3>🥜 Desk Dabba Protocol (1–4 PM Danger Zone)</h3>
      <ul class="clean">
        <li>Bhuna chana (30g) ya dry-roasted makhana</li>
        <li>Mutthi bhar roasted peanuts</li>
        <li>Kheera, gajar, seb, amrood</li>
        <li>Sprouts chaat (subah ready karke rakho)</li>
        <li>Chaas ki bottle 🥤</li>
      </ul>
      <small style="margin-top:6px;">Rule: Continuous eating control karne ke liye desk pe sirf yahi dabba hona chahiye. Mathri dabba out of sight!</small>
    </div>

    <div class="card">
      <h3>🕉️ Vrat Protocol (Tuesday &amp; Saturday)</h3>
      <ul class="clean">
        <li><b>Din bhar:</b> Sirf phalahar (fruit, dry fruit, makhana, gajak, milk, chaas) + 8 glass paani.</li>
        <li><b>Shaam 6–7 PM:</b> Vrat kholte waqt halka dinner. Overeating se bacho!</li>
      </ul>
    </div>`;
}

function renderBackup() {
  $('#backup').innerHTML = `
    <!-- AI Settings Box -->
    <div class="card ai-box">
      <h3>🤖 AI Coach Settings (Google Gemini)</h3>
      <p class="muted">Free Gemini Flash API key yahan daalo. Key sirf tumhare browser me save rehti hai.</p>
      <div style="margin:8px 0; display:flex; gap:6px;">
        <input type="password" id="geminiKey" value="${esc(S.aiKey || '')}" placeholder="AI Studio Key (AIzaSy...)" style="flex:1;">
        <button class="icon-btn" data-act="toggleKeyVis" title="Show/Hide Key" type="button" style="flex:none;">👁️</button>
      </div>
      <div class="row">
        <button class="btn" data-act="saveAiKey">Save AI Key</button>
        <button class="btn ghost" data-act="testAi">Test AI</button>
      </div>
      <small style="margin-top:8px;">Get a free key (1,500 requests/day free): <a href="https://aistudio.google.com/apikey" target="_blank" style="color:var(--accent);">aistudio.google.com/apikey</a></small>
    </div>

    <!-- Fasting / Vrat Settings -->
    <div class="card">
      <h3>🕉️ Fasting / Vrat Settings</h3>
      <p class="muted">Ek-time shaam ke khane wala vrat (din me sirf phalahar):</p>
      <label class="check on" style="cursor:default;">
        <input type="checkbox" checked disabled>
        <span>Tuesday (Mangalwar) Vrat — Always Active 🙏</span>
      </label>
      <label class="check ${S.vratSaturday ? 'on' : ''}">
        <input type="checkbox" data-act="toggleSatVrat" ${S.vratSaturday ? 'checked' : ''}>
        <span>Saturday (Shanivar) Vrat Enable Karein 🕉️</span>
      </label>
    </div>

    <!-- Phone Reminders -->
    <div class="card">
      <h3>🔔 Smart Reminders (Chilla &amp; Desk Dabba)</h3>
      <p class="muted">Night Prep (8:30 PM moong soaking) aur Morning Desk Dabba ke automatic phone alerts:</p>
      <div class="row">
        <button class="btn ${S.notifications ? 'good' : ''}" data-act="enableNotify">
          ${S.notifications ? '✅ Reminders Active' : '🔔 Enable Daily Reminders'}
        </button>
        ${S.notifications ? '<button class="btn ghost" data-act="testNotify">Test Alert 🔔</button>' : ''}
      </div>
    </div>

    <!-- Data Backup & Sync -->
    <div class="card">
      <h3>💾 Backup &amp; Restore</h3>
      <p class="muted">Data tumhare phone ke browser me save hai. Hafte me ek baar backup Google Drive / WhatsApp pe share karein.</p>
      <p>Last backup: <b>${S.lastBackup ? pretty(S.lastBackup) : 'Kabhi nahi 😬'}</b></p>
      <div class="row">
        <button class="btn alt" data-act="share">📤 Share Backup</button>
        <button class="btn ghost" data-act="export">⬇️ Download</button>
      </div>
      <div class="row" style="margin-top:8px;">
        <button class="btn ghost" data-act="import">⬆️ Import / Restore</button>
      </div>
    </div>

    <!-- Murukku Tax Rate -->
    <div class="card">
      <h3>🫙 Murukku Tax Rate</h3>
      <p class="muted">Har over-budget slip pe itne rupaye jar me:</p>
      <div class="row">
        <input type="number" id="taxRate" value="${S.tax.rate}" min="0" step="10">
        <button class="btn ghost" data-act="setTax">Save Rate</button>
      </div>
    </div>

    <!-- Danger Zone -->
    <div class="card">
      <h3>⚠️ Reset All Data</h3>
      <button class="btn bad" data-act="reset">Delete All Data</button>
    </div>`;
}

/* ==========================================================================
   Modals: Craving SOS & Punishment Wheel
   ========================================================================== */

let wheelRot = 0, spinning = false;
function drawWheel() {
  const c = $('#wheel'), ctx = c.getContext('2d'), n = PENANCES.length, seg = (2 * Math.PI) / n, r = 148;
  ctx.clearRect(0, 0, 300, 300);
  PENANCES.forEach((p, i) => {
    const a0 = -Math.PI / 2 + i * seg;
    ctx.beginPath(); ctx.moveTo(150, 150); ctx.arc(150, 150, r, a0, a0 + seg); ctx.closePath();
    ctx.fillStyle = WHEEL_COLORS[i % WHEEL_COLORS.length]; ctx.fill();
    ctx.save(); ctx.translate(150, 150); ctx.rotate(a0 + seg / 2);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'right';
    ctx.fillText(p.replace(/ \S+$/u, ''), r - 8, 4);
    ctx.restore();
  });
  ctx.beginPath(); ctx.arc(150, 150, 18, 0, 2 * Math.PI); ctx.fillStyle = '#fff'; ctx.fill();
}

function openWheel() {
  $('#wheelResult').textContent = '';
  $('#spinBtn').disabled = false;
  $('#wheelModal').hidden = false;
  drawWheel();
}

function spin() {
  if (spinning) return;
  spinning = true;
  $('#spinBtn').disabled = true;
  const n = PENANCES.length, seg = 360 / n, i = Math.floor(Math.random() * n);
  const target = (360 - (i * seg + seg / 2)) % 360;
  wheelRot += 360 * 5 + ((target - (wheelRot % 360)) + 360) % 360;
  $('#wheel').style.transform = `rotate(${wheelRot}deg)`;
  setTimeout(() => {
    spinning = false;
    day(cur).penances.push({ text: PENANCES[i], done: false });
    save();
    $('#wheelResult').textContent = `Saza: ${PENANCES[i]} — karo aur tick karo ✅`;
    render();
  }, 4100);
}

let sosTimer = null;
async function openSos() {
  const modal = $('#sosModal');
  const roastEl = $('#sosRoast');
  roastEl.textContent = pick(SOS_ROASTS);

  // If AI key is available, fetch dynamic roast
  if (S.aiKey) {
    callGemini('Generate a hilarious, 1-sentence sarcastic Hinglish roast for Bhawesh who is having a craving for murukku/mathri between meals. Urge him to drink water and open Desk Dabba instead.').then(reply => {
      if (reply && reply.ok && reply.text) roastEl.textContent = reply.text.trim();
    }).catch(() => {});
  }

  let left = 600;
  const show = () => { $('#sosTimer').textContent = `${pad(Math.floor(left / 60))}:${pad(left % 60)}`; };
  show();
  clearInterval(sosTimer);
  sosTimer = setInterval(() => {
    left--;
    show();
    if (left <= 0) {
      clearInterval(sosTimer);
      roastEl.textContent = '⏰ 10 minute ho gaye! Craving ki wave nikal gayi? Desk Dabba kholo! 😎';
    }
  }, 1000);
  modal.hidden = false;
}

function closeSos() { clearInterval(sosTimer); $('#sosModal').hidden = true; }

/* ==========================================================================
   Backup / Export / Import
   ========================================================================== */

const backupJson = () => JSON.stringify(S, null, 1);
const backupName = ext => `operation-227-backup-${today()}.${ext}`;
function markBackup() { S.lastBackup = today(); save(); render(); }

function downloadBackup() {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([backupJson()], { type: 'application/json' }));
  a.download = backupName('json');
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  markBackup();
  toast('Backup download ho gaya ⬇️');
}

async function shareBackup() {
  const candidates = [
    new File([backupJson()], backupName('json'), { type: 'application/json' }),
    new File([backupJson()], backupName('txt'), { type: 'text/plain' }),
  ];
  const file = navigator.canShare ? candidates.find(f => navigator.canShare({ files: [f] })) : null;
  if (!file) { downloadBackup(); return; }
  try {
    await navigator.share({ files: [file], title: 'Operation 227 Backup' });
    markBackup();
    toast('Backup share ho gaya 💾');
  } catch (e) {
    if (e.name !== 'AbortError') downloadBackup();
  }
}

function importBackup(file) {
  const rd = new FileReader();
  rd.onload = () => {
    try {
      const data = JSON.parse(rd.result);
      if (!data || typeof data.days !== 'object') throw new Error('bad file');
      if (!confirm(`Backup me ${Object.keys(data.days).length} din ka data mila. Restore karein?`)) return;
      S = Object.assign(defaultState(), data);
      save();
      cur = today();
      render();
      toast('Backup restore ho gaya ✅');
    } catch (e) {
      toast('Invalid backup file 🤔');
    }
  };
  rd.readAsText(file);
}

/* ==========================================================================
   Action & Event Handlers
   ========================================================================== */

async function onAction(act, el) {
  const d = cur;
  switch (act) {
    case 'jumpToMeal': {
      const input = $('#mealInput');
      if (input) {
        input.focus();
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    case 'logWater': {
      const x = day(cur);
      x.waterGlasses = (x.waterGlasses || 0) + 1;
      const isVrat = isVratDay(cur);
      if (x.waterGlasses >= 2) {
        x.checks[isVrat ? 'vratWater' : 'water'] = true;
      }
      save();
      toast(`💧 1 Glass Paani note ho gaya! Aaj total: ${x.waterGlasses} glass 🚿`);
      break;
    }
    case 'copilotUrge': {
      const win = getCurrentWindow(d);
      const userCraving = prompt('Coach Chacha Urge Check:\n\nAbhi kya mann kar raha hai? (e.g. "Mathri", "Chai ke sath kuch crunch", ya "Bhook lagi hai")', '') || '';
      toast('Coach analyzing your urge & hunger... 🧠');

      const lastMealInfo = win.lastMeal ? `Last eaten: "${win.lastMeal.text}" at ${win.lastMeal.time}` : 'No recent meal logged today';
      const promptText = `You are Coach Chacha, a compassionate, smart Indian fitness coach for Bhawesh (Target: reduce LDL 149, increase HDL 57, prevent continuous snacking).
Current time: ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}.
Current schedule window: "${win.current.title}" (${win.current.type === 'fast' ? 'Digestion/Rest window' : 'Eating window'}).
Next planned fuel: "${win.nextName}" at ${win.nextTime} (in ${win.minsRemaining} mins).
${lastMealInfo}.
User said: "${userCraving || 'I have a strong urge to eat something right now'}".

Instructions:
1. DO NOT simply say "No" or tell him to starve!
2. If he is craving a bad snack (mathri/biscuit/samosa/mithai), give him an instant SMART HEALTHY SWAP from Desk Dabba (e.g. roasted makhana with chaat masala, bhuna chana, or fruit).
3. If it has been more than 2.5 hours since his last meal, recognize genuine physical hunger and explicitly GIVE PERMISSION to have a safe bridge snack (makhana, chana, cucumber, or chaas) that protects his LDL.
4. If he ate very recently (<1.5 hrs), gently explain the dopamine/boredom trigger, suggest 1 glass of water, BUT reassure him that if he still needs to chew, raw cucumber or 10 makhanas are 100% guilt-free.
5. Keep it to 2-3 warm, witty, direct sentences in Hinglish.`;

      const aiRes = await callGemini(promptText, 'You are Coach Chacha, a witty, practical, empathetic Indian fitness coach who provides smart healthy alternatives instead of unrealistic restrictions.');
      if (aiRes && aiRes.ok && aiRes.text) {
        alert(`🧔‍♂️ Coach Chacha Urge Intercept:\n\n${aiRes.text.trim()}`);
      } else {
        // Smart Local Fallback
        if (userCraving.toLowerCase().includes('mathri') || userCraving.toLowerCase().includes('biscuit') || userCraving.toLowerCase().includes('namkeen')) {
          alert(`🧔‍♂️ Coach Chacha Urge Intercept:\n\nMathri/namkeen ka trans-fat LDL badhayega! Iski jagah Desk Dabba se 1 mutthi bhuna chana ya roasted makhana with chaat masala lo — crunch wahi milega, cholesterol zero! 🫘🍿`);
        } else if (userCraving.toLowerCase().includes('sweet') || userCraving.toLowerCase().includes('mithai') || userCraving.toLowerCase().includes('laddoo')) {
          alert(`🧔‍♂️ Coach Chacha Urge Intercept:\n\nMithai ki craving? Ek chhota piece gajak ya seb (apple) lo. Til aur fiber dil ke dost hain, refined sugar nahi! 🍎🍯`);
        } else {
          alert(`🧔‍♂️ Coach Chacha Urge Intercept:\n\nBhawesh, agar pet me genuine bhook hai toh bhookhe mat raho! Desk Dabba se bhuna chana (30g) ya makhana lo. Agar sirf boredom hai, pehle 1 glass thanda paani piyo aur 10 min ruko. Agla planned meal "${win.nextName}" ${win.minsRemaining} min me hai! 💪`);
        }
      }
      break;
    }
    case 'prevDay': cur = addDays(cur, -1); break;
    case 'nextDay': if (cur < today()) cur = addDays(cur, 1); break;
    case 'sos': openSos(); return;
    case 'sosClose': closeSos(); return;
    case 'sosWin':
      day(today()).beaten = (dv(today()).beaten || 0) + 1;
      save(); closeSos(); confetti();
      toast('Craving harayi! 🏆 +2 bonus points. Sher ho tum 🦁');
      cur = today();
      break;
    case 'sosLose':
      day(today()).lost = (dv(today()).lost || 0) + 1;
      save(); closeSos(); cur = today();
      toast('Koi na. Wheel ghumao aur saza poori karo 🎡', 4000);
      break;
    case 'wheel': openWheel(); return;
    case 'wheelClose': if (!spinning) $('#wheelModal').hidden = true; return;
    case 'spin': spin(); return;
    case 'logMeal': {
      const input = $('#mealInput');
      const text = input ? input.value.trim() : '';
      if (!text) { toast('Kuch likho toh sahi 🙂'); return; }
      input.value = '';
      toast('Analyzing meal with AI... 🤖');
      const evalResult = await evaluateMeal(text, d);
      const x = day(d);
      x.meals.push({
        id: Date.now(),
        text,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        protein: evalResult.protein,
        verdict: evalResult.verdict,
        slipType: evalResult.slipType,
        slipUnits: evalResult.slipUnits,
        comment: evalResult.comment,
        pts: evalResult.pts,
      });

      // If it is a slip, update slip counters
      if (evalResult.slipType && evalResult.slipUnits) {
        x.slips[evalResult.slipType] = (x.slips[evalResult.slipType] || 0) + evalResult.slipUnits;
      }

      save();
      if (evalResult.protein >= 12) confetti();
      toast(evalResult.comment || 'Meal log ho gaya!', 4000);
      break;
    }
    case 'quickMeal': {
      const text = el.dataset.txt;
      if (!text) break;
      toast('Logging meal... ⏳');
      const evalResult = await evaluateMeal(text, d);
      const x = day(d);
      x.meals.push({
        id: Date.now(),
        text,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        protein: evalResult.protein,
        verdict: evalResult.verdict,
        slipType: evalResult.slipType,
        slipUnits: evalResult.slipUnits,
        comment: evalResult.comment,
        pts: evalResult.pts,
      });
      if (evalResult.slipType && evalResult.slipUnits) {
        x.slips[evalResult.slipType] = (x.slips[evalResult.slipType] || 0) + evalResult.slipUnits;
      }
      save();
      toast(evalResult.comment || '+Logged!', 3000);
      break;
    }
    case 'delMeal': {
      const idx = Number(el.dataset.i);
      day(d).meals.splice(idx, 1);
      save();
      toast('Meal removed');
      break;
    }
    case 'slip': {
      const delta = Number(el.dataset.d), id = el.dataset.id, x = day(d);
      const before = scoreOf(d).over;
      x.slips[id] = Math.max(0, (x.slips[id] || 0) + delta);
      save();
      if (delta > 0) {
        if (scoreOf(d).over > before) {
          toast(pick(SLIP_ROASTS));
          setTimeout(openWheel, 700);
        } else {
          toast('Note kar liya 📝 Dhyan rahe!');
        }
      }
      break;
    }
    case 'ghee': {
      const x = day(d);
      x.ghee = Math.max(0, (x.ghee || 0) + Number(el.dataset.d));
      save();
      if (Number(el.dataset.d) > 0 && x.ghee > phaseOn(d).ghee) {
        toast('Ghee limit cross! 🧈 Sukhi roti try karo.');
      }
      break;
    }
    case 'coachOptToggle': {
      el.classList.toggle('selected');
      return;
    }
    case 'submitQuestionMulti': {
      const qid = el.dataset.q;
      const q = coachQuestions(d).find(z => z.id === qid);
      if (!q) break;
      const container = el.closest('.coach-bubble');
      const selectedBtns = container ? container.querySelectorAll(`.coach-opt[data-q="${qid}"].selected`) : [];
      if (!selectedBtns.length) {
        toast('Pehle option select karo ya neeche custom likho 🙂');
        return;
      }
      const x = day(d);
      x.asked = x.asked || {};
      let appliedCount = 0;
      for (const btn of selectedBtns) {
        const o = Number(btn.dataset.o);
        const [, effect] = q.opts[o];
        if (effect === 'SNOOZE') {
          x.asked[q.id] = { snooze: true, t: Date.now() };
          save();
          toast('45 min baad yaad dilaunga ⏰');
          render();
          return;
        }
        if (effect === 'SOS') {
          save(); render(); openSos(); return;
        }
        if (typeof effect === 'function') effect(x);
        appliedCount++;
      }
      x.asked[q.id] = { o: 0, t: Date.now() };
      save();
      toast(`✅ ${appliedCount} items note ho gaye! Shabaash.`);
      break;
    }
    case 'submitQuestionCustom': {
      const qid = el.dataset.q;
      const input = $(`#customInput_${qid}`);
      const customText = input ? input.value.trim() : '';
      if (!customText) {
        toast('Kuch type toh karo 🙂');
        return;
      }
      toast('AI Analyzing your meal... 🤖');
      const evalResult = await evaluateMeal(customText, d);
      const x = day(d);
      x.meals.push({
        id: Date.now(),
        text: customText,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        protein: evalResult.protein,
        verdict: evalResult.verdict,
        slipType: evalResult.slipType,
        slipUnits: evalResult.slipUnits,
        comment: evalResult.comment,
        pts: evalResult.pts,
      });
      if (evalResult.slipType && evalResult.slipUnits) {
        x.slips[evalResult.slipType] = (x.slips[evalResult.slipType] || 0) + evalResult.slipUnits;
      }
      if (qid === 'breakfast') x.checks['proteinBreakfast'] = true;
      if (qid === 'vratDaytime') x.checks['phalaharMorning'] = true;
      if (qid === 'vratBreak') x.checks['vratBreakEarly'] = true;
      if (qid === 'salad') x.checks['saladFirst'] = true;
      if (qid === 'dinner') x.checks['dinnerEarly'] = true;
      x.asked = x.asked || {};
      x.asked[qid] = { o: 99, custom: true, t: Date.now() };
      save();
      if (evalResult.protein >= 12) confetti();
      toast(`🤖 Coach: ${evalResult.comment || 'Meal note ho gaya!'}`, 4500);
      break;
    }
    case 'askSuperfoodAi': {
      const foodName = el.dataset.food;
      toast(`Asking Coach Chacha about ${foodName}... 🧠`);
      const prompt = `Give a 2-sentence practical, high-impact cooking/preparation tip in Hinglish for Bhawesh on how to prepare and eat ${foodName} at home to lower LDL cholesterol from 149, raise HDL from 57, and get maximum vegetarian protein.`;
      const aiRes = await callGemini(prompt, 'You are Coach Chacha, a master of Indian heart-healthy vegetarian nutrition.');
      if (aiRes && aiRes.ok && aiRes.text) {
        alert(`💡 Coach Chacha on ${foodName}:\n\n${aiRes.text.trim()}`);
      } else {
        const item = SUPERFOODS.find(s => s.name === foodName) || SUPERFOODS[0];
        alert(`💡 Coach Chacha on ${foodName}:\n\n${item.howToEat}`);
      }
      break;
    }
    case 'coach': {
      const q = coachQuestions(d).find(z => z.id === el.dataset.q);
      if (!q) break;
      const o = Number(el.dataset.o), [, effect, reaction] = q.opts[o];
      const x = day(d);
      x.asked = x.asked || {};
      if (effect === 'SNOOZE') {
        x.asked[q.id] = { snooze: true, t: Date.now() };
        save();
        toast('45 min baad yaad dilaunga ⏰');
        break;
      }
      if (effect === 'SOS') {
        save(); render(); openSos(); return;
      }
      x.asked[q.id] = { o, t: Date.now() };
      if (typeof effect === 'function') effect(x);
      save();
      toast(reaction || pick(PRAISE), 2500);
      break;
    }
    case 'toggleKeyVis': {
      const inp = $('#geminiKey');
      if (inp) inp.type = inp.type === 'password' ? 'text' : 'password';
      return;
    }
    case 'saveAiKey': {
      const val = ($('#geminiKey')?.value || '').trim();
      S.aiKey = val;
      save();
      toast(val ? 'Gemini API Key saved! 🤖' : 'API Key cleared (offline mode active)');
      break;
    }
    case 'testAi': {
      const inputVal = ($('#geminiKey')?.value || '').trim();
      if (inputVal) {
        S.aiKey = inputVal;
        save();
      }
      const key = (S.aiKey || '').trim();
      if (!key) {
        toast('Pehle API Key daalo 🙂');
        return;
      }
      toast('Testing Gemini API... ⏳');
      const testRes = await callGemini('Give a 1-sentence energetic greeting for Bhawesh who is fighting cholesterol.', '', key);
      if (testRes.ok) {
        toast(`AI Online! 🚀 "${testRes.text.trim()}"`, 5000);
      } else {
        toast(`API Error: ${testRes.error}`, 6000);
      }
      break;
    }
    case 'toggleSatVrat': {
      S.vratSaturday = !S.vratSaturday;
      save();
      toast(S.vratSaturday ? 'Saturday Vrat enabled! 🕉️' : 'Saturday Vrat disabled');
      break;
    }
    case 'payTax': {
      const pending = Math.max(0, taxTotal() - S.tax.paid);
      const v = prompt('Kitne rupaye jar me daale?', pending);
      const amt = Number(v);
      if (v !== null && amt > 0) {
        S.tax.paid += amt;
        save();
        toast(`₹${amt} jar me 🫙 Shabaash!`);
      }
      break;
    }
    case 'addWeight': {
      const date = $('#wDate').value, kg = Number($('#wKg').value);
      if (!date || !(kg > 30 && kg < 250)) { toast('Sahi weight daalo 🙂'); return; }
      S.weights = S.weights.filter(w => w.date !== date).concat({ date, kg });
      save(); toast('Weight saved ⚖️');
      break;
    }
    case 'addLipid': {
      const num = id => { const v = $(id).value; return v === '' ? null : Number(v); };
      const rec = { date: $('#lDate').value, total: num('#lTotal'), ldl: num('#lLdl'), hdl: num('#lHdl'), tg: num('#lTg') };
      if (!rec.date || rec.ldl == null) { toast('Kam se kam Date aur LDL daalo'); return; }
      S.lipids = S.lipids.filter(l => l.date !== rec.date).concat(rec);
      save();
      toast('Lipid report saved 🩸');
      break;
    }
    case 'delLipid': {
      if (confirm('Ye report delete karein?')) {
        S.lipids = S.lipids.filter(l => l.date !== el.dataset.date);
        save();
      }
      break;
    }
    case 'nextPhase': {
      const ps = phaseStatus();
      if (!ps.eligible) return;
      S.phases.push({ n: ps.cur.n + 1, start: today() });
      save(); confetti();
      toast(`🔓 Phase ${ps.cur.n + 1} Unlock!`, 4000);
      break;
    }
    case 'setPhase': {
      const n = Number($('#phaseSel').value), t = today();
      if (!confirm(`Aaj se Phase ${n} set karein?`)) return;
      S.phases = S.phases.filter(p => p.start < t).concat({ n, start: t });
      save(); toast(`Phase ${n} set ✅`);
      break;
    }
    case 'share': shareBackup(); return;
    case 'export': downloadBackup(); return;
    case 'import': $('#importFile').click(); return;
    case 'setTax': {
      const v = Number($('#taxRate').value);
      if (v >= 0) { S.tax.rate = v; save(); toast('Tax rate saved 🫙'); }
      break;
    }
    case 'enableNotify': {
      await requestNotificationPermission();
      break;
    }
    case 'testNotify': {
      sendLocalNotification('Operation 227 🥊 Health Coach', '🌱 Kal ki tayyari: Kal ke breakfast ke liye moong/dal bhigo do aur Desk Dabba pack kar lo!');
      toast('Test alert sent! 🔔');
      break;
    }
    case 'togglePrep': {
      const k = el.dataset.k;
      const x = day(cur);
      x[k] = el.checked;
      save();
      if (el.checked) {
        if (k === 'prepMoong') toast('🌱 Moong bhigoyi! Kal subah protein chilla pakka! 🥞');
        else if (k === 'prepDabba') toast('🥜 Desk Dabba pack ho gaya! Afternoon craving safe ho gayi.');
        else if (k === 'prepOutSight') toast('📦 Out of sight, out of mouth! Mathri safely door ho gayi.');
      }
      render();
      break;
    }
    case 'reset': {
      if (confirm('Pakka? Saara data delete ho jaayega!') && confirm('Last chance — backup liya hai?')) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(LEGACY_KEY);
        S = defaultState();
        save();
        cur = today();
        toast('Fresh start 🌱');
      }
      break;
    }
    default: return;
  }
  render();
}

/* ---------- Global Listeners ---------- */
document.addEventListener('click', e => {
  const tabBtn = e.target.closest('.tabs button');
  if (tabBtn) {
    tab = tabBtn.dataset.tab;
    render();
    window.scrollTo(0, 0);
    return;
  }
  const el = e.target.closest('button[data-act]');
  if (el) onAction(el.dataset.act, el);
});

document.addEventListener('change', e => {
  const el = e.target;
  if (el.dataset.act === 'check') {
    const x = day(cur);
    x.checks[el.dataset.id] = el.checked;
    save();
    const r = scoreOf(cur);
    if (el.checked && r.done === r.total) { confetti(); toast('Saari habits done! 🏆 Champion day!'); }
    render();
  } else if (el.dataset.act === 'challenge') {
    day(cur).challenge = el.checked;
    save();
    if (el.checked) { confetti(); toast('Challenge complete! +3 bonus 🎯'); }
    render();
  } else if (el.dataset.act === 'penance') {
    const p = day(cur).penances[Number(el.dataset.i)];
    if (p) p.done = el.checked;
    save();
    if (el.checked) toast('Saza poori! Hisaab barabar 🤝 +2 bonus');
    render();
  } else if (el.dataset.act === 'toggleSatVrat') {
    onAction('toggleSatVrat', el);
  } else if (el.id === 'importFile' && el.files[0]) {
    importBackup(el.files[0]);
    el.value = '';
  }
});

document.addEventListener('input', e => {
  if (e.target.id === 'note') { day(cur).note = e.target.value; save(); }
  if (e.target.id === 'geminiKey') { S.aiKey = e.target.value.trim(); save(); }
});

document.addEventListener('keydown', e => {
  if (e.target.id === 'mealInput' && e.key === 'Enter') {
    onAction('logMeal', e.target);
  }
  if (e.target.classList.contains('q-custom-input') && e.key === 'Enter') {
    const qid = e.target.id.replace('customInput_', '');
    const btn = document.querySelector(`button[data-act="submitQuestionCustom"][data-q="${qid}"]`);
    if (btn) onAction('submitQuestionCustom', btn);
  }
});

// Visibility and session resume
let lastDay = today();
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') return;
  if (cur === lastDay) cur = today();
  lastDay = today();
  updateThemeStyles();
  checkScheduledAlerts();
  render();
});

// Periodic coach update
setInterval(() => {
  const busy = !$('#sosModal').hidden || !$('#wheelModal').hidden || (document.activeElement || {}).tagName === 'INPUT';
  if (document.visibilityState === 'visible' && !busy && tab === 'today') {
    updateThemeStyles();
    checkScheduledAlerts();
    render();
  }
}, 4 * 60000);

/* ---------- Boot ---------- */
save();
updateThemeStyles();
render();

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
  navigator.serviceWorker.register('sw.js').catch(console.error);
}
