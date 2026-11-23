'use strict';

/* ---------- Config ---------- */
const KEY = 'laddooVsMe.v1';

const PHASES = [
  { n: 1, name: 'Mithai Diplomacy', emoji: '🍬', sweets: 3, fried: 7, ghee: 4, protein: 55, strictGraze: false,
    rule: 'Mithai max 3 piece/week, sirf lunch ke baad. Mathri/namkeen/biscuit max 1 chhoti katori/day. Ghee wali roti max 4.' },
  { n: 2, name: 'Grazing Band', emoji: '🚫', sweets: 3, fried: 4, ghee: 4, protein: 55, strictGraze: true,
    rule: '1–4 PM sirf EK snack slot — Desk Dabba se. Leftover paratha / random grazing ab penalty dega. Fried max 4/week.' },
  { n: 3, name: 'Protein Subah', emoji: '🥞', sweets: 3, fried: 3, ghee: 3, protein: 65, strictGraze: true,
    rule: 'Poha ki jagah chilla / sprouts / chana. Lunch me curd ya chaas. Ghee roti max 3. Protein 65g.' },
  { n: 4, name: 'Salad Pehle, Atta Badlo', emoji: '🥗', sweets: 3, fried: 3, ghee: 3, protein: 80, strictGraze: true,
    rule: 'Lunch me salad pehle. Jau / jowar / oats mixed atta. 1 scoop whey. Protein 80g.' },
  { n: 5, name: 'Brisk & Seeds', emoji: '🏃', sweets: 3, fried: 2, ghee: 2, protein: 80, strictGraze: true,
    rule: 'Walk me 25 min brisk (saans phoole). Daily seed mix. Ghee roti max 2. Fried max 2/week.' },
  { n: 6, name: 'LDL Slayer Mode', emoji: '🗡️', sweets: 2, fried: 1, ghee: 1, protein: 80, strictGraze: true,
    rule: 'Mithai 2/week, fried 1/week, ghee roti max 1. Feb 2027 me lipid test dobara!' },
];

// Ordered by time of day; `phase` = phase in which the habit unlocks.
const HABITS = [
  { id: 'water', slot: '🌅 5:30 AM', label: '2 glass paani uthte hi', phase: 1 },
  { id: 'walk', slot: '🌅 5:30 AM', label: 'Morning walk + yoga (1 hr)', phase: 1 },
  { id: 'brisk', slot: '🌅 5:30 AM', label: '25 min BRISK walk (HDL booster)', phase: 5 },
  { id: 'seeds', slot: '🥛 6:30 AM', label: 'Seed mix: alsi + pumpkin seeds + 4–5 badaam/akhrot', phase: 5 },
  { id: 'proteinBreakfast', slot: '🥞 7:30 AM', label: 'Protein breakfast (chilla / sprouts / chana) — poha nahi', phase: 3 },
  { id: 'saladFirst', slot: '🍛 11 AM Lunch', label: 'Salad pehle khaya', phase: 4 },
  { id: 'millet', slot: '🍛 11 AM Lunch', label: 'Jau / jowar / oats mixed atta roti', phase: 4 },
  { id: 'curd', slot: '🍛 11 AM Lunch', label: 'Curd / raita / chaas li', phase: 3 },
  { id: 'deskDabba', slot: '🥜 1–4 PM', label: 'Sirf EK snack slot, Desk Dabba se (no grazing)', phase: 2 },
  { id: 'whey', slot: '💪 Anytime', label: '1 scoop whey protein', phase: 4 },
  { id: 'dinnerEarly', slot: '🍲 6 PM Dinner', label: 'Dinner 6–7 PM tak ho gaya', phase: 1 },
  { id: 'eveningWalk', slot: '🌙 Night', label: 'Dinner ke baad walk', phase: 1 },
  { id: 'nightFast', slot: '🌙 Night', label: 'Dinner ke baad kitchen band (sirf paani / tulsi tea)', phase: 2 },
];

const SLIPS = [
  { id: 'sweets', emoji: '🍬', label: 'Mithai / laddoo (piece)' },
  { id: 'fried', emoji: '🥨', label: 'Mathri / namkeen / biscuit (katori)' },
  { id: 'paratha', emoji: '🫓', label: 'Leftover paratha (piece)' },
  { id: 'grazing', emoji: '🐐', label: 'Random grazing (baar)' },
];

const FOODS = [
  ['milk', '🥛 Toned milk glass', 8], ['curd', '🥣 Curd katori', 6], ['chaas', '🥤 Chaas glass', 3],
  ['chilla', '🥞 2 Chilla (moong/besan)', 12], ['sprouts', '🌱 Sprouts katori', 7], ['chana', '🫘 Roasted chana 30g', 6],
  ['soya', '🟤 Soya chunks 30g', 15], ['paneer', '🧀 Paneer 50g', 9], ['dal', '🍲 Dal katori', 7],
  ['rajma', '🍛 Rajma / chole katori', 8], ['roti', '🫓 1 Roti', 3], ['idli', '⚪ 2 Idli + sambar', 7],
  ['peanuts', '🥜 Peanuts mutthi', 7], ['tofu', '⬜ Tofu 100g', 10], ['whey', '💪 Whey scoop', 24],
];
const FOOD_MAP = Object.fromEntries(FOODS.map(([k, l, g]) => [k, { l, g }]));

const PENANCES = [
  '20 squats 🦵', '10 min extra walk 🚶', 'Kal mithai band 🚫', '2 glass paani abhi 💧',
  '30 sec plank x2 🧱', 'Kal ghee-free roti 🫓', '15 min brisk walk 🏃', 'Namkeen packet donate 🎁',
];
const WHEEL_COLORS = ['#f97316', '#16a34a', '#2563eb', '#db2777', '#7c3aed', '#0891b2', '#ca8a04', '#dc2626'];

const LEVELS = [
  [0, 'Laddoo Addict 🍬'], [300, 'Mathri Muncher (Reformed) 🥨'], [900, 'Chana Challenger 🫘'],
  [1800, 'Chilla Champion 🥞'], [3000, 'Sprout Samurai 🌱'], [4500, 'Protein Pehelwan 💪'],
  [6500, 'LDL Slayer 🗡️'], [9000, 'Heart Ka Hero ❤️‍🔥'],
];

/* ---------- Date helpers ---------- */
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

/* ---------- State ---------- */
function defaultState() {
  const t = today();
  return {
    v: 1,
    start: t,
    phases: [{ n: 1, start: t }],
    days: {},
    weights: [{ date: t, kg: 82.9 }],
    lipids: [{ date: '2026-11-12', total: 227.2, ldl: 149.32, hdl: 57.1, tg: 103.9 }],
    tax: { rate: 50, paid: 0 },
    lastBackup: null,
  };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return Object.assign(defaultState(), JSON.parse(raw));
  } catch (e) { console.error(e); }
  return defaultState();
}

let S = load();
const save = () => localStorage.setItem(KEY, JSON.stringify(S));

const EMPTY_DAY = { checks: {}, slips: {}, ghee: 0, protein: [], penances: [], beaten: 0, lost: 0, note: '', asked: {}, challenge: false, mood: null };
const dv = d => S.days[d] || EMPTY_DAY;
function day(d) {
  if (!S.days[d]) S.days[d] = JSON.parse(JSON.stringify(EMPTY_DAY));
  return S.days[d];
}
const loggedDays = () => Object.keys(S.days).sort();

/* ---------- Scoring ---------- */
function phaseOn(d) {
  let n = 1;
  for (const p of S.phases) if (p.start <= d) n = p.n;
  return PHASES[n - 1];
}

function weekCum(d, key) {
  let c = 0;
  for (let x = weekStart(d); x <= d; x = addDays(x, 1)) c += dv(x).slips[key] || 0;
  return c;
}

// How many of this day's units pushed the week over budget.
function overBudget(d, key, budget) {
  const cur = weekCum(d, key);
  const prev = cur - (dv(d).slips[key] || 0);
  return Math.max(0, cur - budget) - Math.max(0, prev - budget);
}

const proteinOf = x => x.protein.reduce((a, p) => a + p.g, 0);

function scoreOf(d) {
  const x = dv(d), P = phaseOn(d);
  const active = HABITS.filter(h => h.phase <= P.n);
  const done = active.filter(h => x.checks[h.id]).length;
  const prot = proteinOf(x);
  const so = overBudget(d, 'sweets', P.sweets);
  const fo = overBudget(d, 'fried', P.fried);
  const go = Math.max(0, (x.ghee || 0) - P.ghee);
  const pa = P.strictGraze ? (x.slips.paratha || 0) : 0;
  const gr = P.strictGraze ? (x.slips.grazing || 0) : 0;
  const penalty = so * 8 + fo * 8 + go * 3 + pa * 5 + gr * 5;
  const bonus = Math.min(12, (x.penances.filter(p => p.done).length + (x.beaten || 0)) * 2 + (x.challenge ? 3 : 0));
  const raw = (done / active.length) * 50 + Math.min(prot / P.protein, 1) * 25 + Math.max(0, 25 - penalty) + bonus;
  return { score: Math.max(0, Math.min(100, Math.round(raw))), done, total: active.length, prot, P, over: so + fo + pa + gr, go };
}

function streakInfo() {
  let d = today();
  if (!S.days[d] || scoreOf(d).score < 70) d = addDays(d, -1);
  let cur = 0;
  while (S.days[d] && scoreOf(d).score >= 70) { cur++; d = addDays(d, -1); }
  let best = 0, run = 0, prev = null;
  for (const x of loggedDays()) {
    const good = scoreOf(x).score >= 70;
    run = good ? (prev && diffDays(prev, x) === 1 ? run + 1 : 1) : 0;
    prev = good ? x : null;
    best = Math.max(best, run);
  }
  return { cur, best: Math.max(best, cur) };
}

const totalXP = () => loggedDays().reduce((a, d) => a + scoreOf(d).score, 0);
function levelOf(xp) {
  let i = 0;
  while (i + 1 < LEVELS.length && xp >= LEVELS[i + 1][0]) i++;
  return { name: LEVELS[i][1], next: LEVELS[i + 1] ? LEVELS[i + 1][0] : null };
}
const taxTotal = () => loggedDays().reduce((a, d) => a + scoreOf(d).over, 0) * S.tax.rate;

function phaseStatus() {
  const cur = S.phases[S.phases.length - 1];
  const t = today();
  const daysIn = diffDays(cur.start, t) + 1;
  let good = 0;
  for (let i = 0; i < 14; i++) {
    const d = addDays(t, -i);
    if (d < cur.start) break;
    if (S.days[d] && scoreOf(d).score >= 70) good++;
  }
  return { cur, daysIn, good, eligible: cur.n < 6 && daysIn >= 14 && good >= 11 };
}

function needsBackup() {
  if (loggedDays().length < 3) return false;
  return !S.lastBackup || diffDays(S.lastBackup, today()) >= 7;
}

/* ---------- UI helpers ---------- */
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
    s.textContent = pick(['🎉', '💪', '🥦', '❤️', '⭐', '🫘', '🦁']);
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
        dots += `<circle cx="${xx(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="2.6" fill="${s.color}"/>`;
      });
      out += `<path d="${path}" fill="none" stroke="${s.color}" stroke-width="2.4" stroke-linejoin="round"/>${dots}`;
    }
    labels.forEach((l, i) => { if (i % step === 0 || i === n - 1) out += `<text x="${xx(i)}" y="${H - 6}" class="ax" text-anchor="middle">${l}</text>`; });
  } else {
    const band = iw / n, bw = (band * 0.8) / series.length;
    series.forEach((s, si) => s.values.forEach((v, i) => {
      if (v == null) return;
      const x0 = L + i * band + band * 0.1 + si * bw, yy = y(Math.max(v, lo));
      out += `<rect x="${x0.toFixed(1)}" y="${yy.toFixed(1)}" width="${Math.max(1, bw - 1).toFixed(1)}" height="${Math.max(0, T + ih - yy).toFixed(1)}" rx="2" fill="${s.color}"/>`;
    }));
    labels.forEach((l, i) => { if (i % step === 0 || i === n - 1) out += `<text x="${L + i * band + band / 2}" y="${H - 6}" class="ax" text-anchor="middle">${l}</text>`; });
  }
  if (target != null) out += `<line x1="${L}" x2="${W - R}" y1="${y(target)}" y2="${y(target)}" class="target"/>`;
  const legend = series.length > 1 || target != null
    ? `<div class="legend">${series.map(s => `<span><i style="background:${s.color}"></i>${s.name}</span>`).join('')}${target != null ? '<span><i style="background:#dc2626"></i>Target</span>' : ''}</div>`
    : '';
  return `<svg viewBox="0 0 ${W} ${H}" class="chart">${out}</svg>${legend}`;
}

/* ---------- Coach (time-aware, data-aware) ---------- */
const daily = (arr, d) => arr[((diffDays('2026-01-01', d) % arr.length) + arr.length) % arr.length];
const RETEST = '2027-02-15';
const SNOOZE_MS = 45 * 60000;
const isPending = a => !a || (a.snooze && Date.now() - a.t > SNOOZE_MS);
let openSeed = Math.random();

function greeting(h) {
  if (h < 4.5) return 'Itni raat ko jaag rahe ho? 🦉 So jao — neend bhi LDL control karti hai';
  if (h < 7) return 'Good morning, sher! 🌅 Walk ka time';
  if (h < 10) return 'Subah ki Ram Ram ☀️ Breakfast me protein?';
  if (h < 12.5) return 'Lunch time 🍛 Salad pehle, yaad hai na?';
  if (h < 16.5) return '⚠️ Danger zone: craving hours! Main nazar rakh raha hoon 👀';
  if (h < 18) return 'Shaam ho gayi ☕ Chai ke saath biscuit nahi!';
  if (h < 20.5) return 'Dinner time 🍲 Halka aur jaldi';
  return 'Din khatam, hisaab time 📒';
}

// Returns pending questions for the given time. Option = [label, effect | 'SNOOZE' | 'SOS' | 'WEIGHT', reaction?]
function coachQuestions(d, now = new Date()) {
  const x = dv(d), P = phaseOn(d), A = x.asked || {};
  const h = now.getHours() + now.getMinutes() / 60;
  const active = id => HABITS.some(k => k.id === id && k.phase <= P.n);
  const tick = id => y => { if (active(id)) y.checks[id] = true; };
  const prot = (...ks) => y => ks.forEach(k => y.protein.push({ k, g: FOOD_MAP[k].g }));
  const slip = (id, n = 1) => y => { y.slips[id] = (y.slips[id] || 0) + n; };
  const ghee = n => y => { y.ghee = Math.max(y.ghee || 0, n); };
  const all = (...fs) => y => fs.forEach(f => f(y));
  const none = () => {};
  const later = ['Baad me ⏰', 'SNOOZE'];
  const urgent = [], out = [];
  const q = (list, id, from, text, opts, cond = true) => {
    if (cond && h >= from && isPending(A[id])) list.push({ id, text, opts, from });
  };

  // A fresh craving check-in every hour of the 12:30–4:30 PM danger zone.
  for (let hr = 13; hr <= 16; hr++) {
    const id = `crave${hr}`;
    if (h >= hr - 0.5 && h < hr + 0.5) {
      q(urgent, id, 0, `⚠️ ${hr - 12} baje ka craving check! Abhi kya scene hai?`, [
        ['Sab chill 😎', none], ['Mann ho raha hai 😬', 'SOS'], ['Kuch kha liya 🙈', none, 'Koi na, batao kya khaya 👇'],
      ]);
    }
    q(urgent, `ate${hr}`, 0, '🙈 Kya khaya? Imaandari se 🙏', [
      ['Mathri / namkeen 🥨', slip('fried')], ['Biscuit 🍪', slip('fried')], ['Mithai 🍬', slip('sweets')],
      ['Leftover paratha 🫓', slip('paratha')], ['Desk Dabba item 🥜', all(prot('chana'), tick('deskDabba')), 'Desk Dabba se khaya? Ye toh jeet hai! 🏆'],
      ['Fruit 🍎', tick('deskDabba'), 'Fruit = smart snack 🍎👏'],
    ], !!(A[id] && A[id].o === 2));
  }

  const lastW = S.weights.reduce((m, w) => (w.date > m ? w.date : m), '');
  q(out, 'weigh', 5.5, '⚖️ Hafte ka weigh-in! Khaali pet weight kitna hai?', [['Weight daalo', 'WEIGHT'], ['Aaj skip', none, 'Theek hai, kal pakka ⚖️']],
    !lastW || diffDays(lastW, d) >= 7);
  q(out, 'water', 5, '💧 Subah uthke 2 glass paani piya?', [['Haan ✅', tick('water'), 'Body ka engine on! 🚿'], ['Bhool gaya', none, 'Abhi ek glass pee lo — late is better than never 💧']], !x.checks.water);
  q(out, 'walk', 5.5, '🚶 Morning walk + yoga ho gaya?', [
    ['Haan, poora ✅', tick('walk')], ['Thoda sa', tick('walk'), 'Kuch nahi se bahut behtar 👍'],
    ['Aaj miss 😔', none, 'Koi na — dinner ke baad 15 min extra walk 🫡'], later,
  ], !x.checks.walk);
  q(out, 'brisk', 6.5, '🏃 Walk me 25 min brisk kiya? (saans phooli?)', [['Haan 🔥', tick('brisk')], ['Nahi, normal tha', none, 'Kal 10 min brisk se shuru karo 🏃']], P.n >= 5 && !x.checks.brisk);
  q(out, 'seeds', 6.5, '🌰 Seed mix (alsi + pumpkin + badaam/akhrot) liya?', [['Haan', tick('seeds')], ['Nahi', none, 'Kal ke liye abhi dabba bhar do 🌰']], P.n >= 5 && !x.checks.seeds);
  q(out, 'milk', 6.5, '🥛 Subah doodh piya?', [
    ['Haan, toned', prot('milk'), '+8g protein 💪'], ['Haan, buffalo/full cream', prot('milk'), 'Protein mila, fat bhi 😅 Toned packet try karo'],
    ['Nahi', none, 'Theek hai, protein baaki meals se poora karenge'],
  ]);
  q(out, 'breakfast', 7.5, '🍳 Breakfast me kya tha?', [
    ['Chilla 🥞', all(prot('chilla'), tick('proteinBreakfast')), 'Protein breakfast! Champion move 🏆'],
    ['Sprouts / chana 🌱', all(prot('sprouts'), tick('proteinBreakfast')), 'Sprouts = superpower 🌱💪'],
    ['Poha 🍚', none, 'Poha theek hai, par kal chilla try karein? 😉'],
    ['Leftover paratha 🫓', slip('paratha'), 'Paratha ji phir aa gaye 😅'],
    ['Kuch nahi', none, 'Lunch jaldi hai, chalega 👍'], later,
  ]);
  q(out, 'whey', 8, '💪 Aaj whey scoop liya?', [['Haan', all(prot('whey'), tick('whey'))], ['Nahi', none, 'Shaam tak le lo — +24g 💪']], P.n >= 4 && !x.checks.whey);
  q(out, 'lunch', 11, '🍛 Lunch me kya kya tha?', [
    ['Dal + roti + curd 💯', all(prot('dal', 'curd', 'roti', 'roti'), tick('curd')), 'Perfect thali! 💯'],
    ['Dal + roti', prot('dal', 'roti', 'roti'), 'Achha! Kal curd bhi add karo 🥣'],
    ['Rajma / chole 🍛', prot('rajma', 'roti', 'roti'), 'Protein + fiber combo 💪'],
    ['Sirf sabzi roti', prot('roti', 'roti'), 'Protein kam reh gaya — shaam ko chana/sprouts 🫘'], later,
  ]);
  q(out, 'salad', 11, '🥗 Lunch me salad pehle khaya?', [['Haan', tick('saladFirst')], ['Nahi', none, 'Kal kheera-gajar plate me pehle rakh dena 🥕']], P.n >= 4 && !x.checks.saladFirst);
  q(out, 'millet', 11, '🌾 Roti jau / jowar / oats mixed atte ki thi?', [['Haan', tick('millet')], ['Nahi', none, 'Ghar pe atte me jau mix karwa do 🌾']], P.n >= 4 && !x.checks.millet);
  q(out, 'lunchSweet', 11, '🍬 Lunch ke baad mithai li?', [
    ['Nahi! 💪', none, 'Laddoo ro raha hai, tum jeet gaye 🏆'], ['1 piece', slip('sweets'), '1 piece budget me ho toh chalega 😌'],
    ['2 ya zyada 😅', slip('sweets', 2)],
  ]);
  q(out, 'ghee', 11.5, '🧈 Ab tak kitni ghee wali roti?', [
    ['0', ghee(0), 'Sukhi roti hero! 🫓🏆'], ['1', ghee(1)], ['2', ghee(2)], ['3', ghee(3)], ['4+', ghee(4), 'Noted 📝 Kal ek kam?'],
  ]);
  q(out, 'mood', 12, '🧠 Aaj mood kaisa hai?', [
    ['😄 Mast', y => { y.mood = 'good'; }, 'Mast mood = kam craving 😎'],
    ['😐 Theek-thaak', y => { y.mood = 'ok'; }, 'Ek chhoti walk se mood upgrade karo 🚶'],
    ['😫 Stressed', y => { y.mood = 'stress'; }, 'Stress = mithai craving. 5 lambi saans 🧘 SOS button ready hai'],
  ]);
  q(out, 'tea', 16.5, '☕ Shaam ki chai ke saath kya tha?', [
    ['Sirf chai', none, 'Clean chai! ☕👏'], ['Biscuit / namkeen 🍪', slip('fried')],
    ['Makhana / chana 🫘', prot('chana'), 'Smart choice! 🫘'], ['Chai nahi li', none],
  ]);
  q(out, 'dinner', 18, '🍲 Dinner ho gaya?', [['Haan, 7 se pehle ✅', tick('dinnerEarly')], ['Haan, late 🕘', none, 'Kal 7 se pehle try karo ⏰'], ['Abhi nahi ⏰', 'SNOOZE']]);
  q(out, 'dinnerWhat', 18, '🍽️ Dinner me kya tha?', [
    ['Dal + sabzi + roti', prot('dal', 'roti', 'roti')], ['Idli sambar', prot('idli')], ['Dal chawal / khichdi', prot('dal')],
    ['Dhokla + dal', prot('dal', 'chilla'), 'Besan + dal = protein party 🎉'], ['Dal bati / heavy 🧈', prot('dal'), 'Joy meal? Hafte me ek baar theek hai 😉'], later,
  ], !!(A.dinner && !A.dinner.snooze));
  q(out, 'eveWalk', 19, '🌙 Dinner ke baad walk kiya?', [['Haan ✅', tick('eveningWalk')], ['Nahi', none, '10 min ghar me hi tehlo — chalega 🚶'], ['Abhi jaunga', 'SNOOZE']], !x.checks.eveningWalk);
  q(out, 'night', 21, '🔒 Dinner ke baad kitchen band raha?', [['Haan 🔒', tick('nightFast')], ['Thoda kha liya 😅', slip('grazing')]], P.n >= 2 && !x.checks.nightFast);
  q(out, 'challenge', 20, `🎯 Aaj ka challenge poora hua? "${daily(CHALLENGES, d)}"`, [['Haan! 🏆', y => { y.challenge = true; }, '+3 bonus! 🎯'], ['Nahi 😅', none, 'Kal pakka! 💪']], !x.challenge);
  // Most recent time-slot first; missed earlier ones follow.
  return urgent.concat(out.sort((a, b) => b.from - a.from));
}

function insights(d) {
  const P = phaseOn(d), out = [], y = addDays(d, -1), st = streakInfo();
  const dayNo = diffDays(S.start, d) + 1;
  out.push(`📅 Journey ka Day ${dayNo}${dayNo === 1 ? ' — shuruaat mubarak! 🎉' : ''}`);
  if (st.cur >= 2) out.push(`🔥 ${st.cur} din ki streak!${st.cur >= st.best ? ' Ye tumhara RECORD hai 🏆' : ` Record ${st.best} hai — ${st.best - st.cur + 1} din aur!`}`);
  if (S.days[y]) {
    const s = scoreOf(y).score, py = proteinOf(S.days[y]);
    out.push(s >= 70 ? `Kal ka score ${s} tha. Aaj bhi waisa hi 💪` : `Kal ${s} tha. Aaj usse upar le jaate hain ⬆️`);
    if (py < P.protein) out.push(`Kal protein ${py}g tha (target ${P.protein}g). Aaj breakfast me chilla/sprouts? 🥞`);
  }
  const sl = P.sweets - weekCum(d, 'sweets');
  out.push(sl > 0 ? `🍬 Is hafte ${sl} mithai bachi hai. Weekend ke liye bacha ke rakho? 😉` : '🍬 Is hafte ka mithai budget khatam. Ab sirf fruit 🍎');
  const fl = P.fried - weekCum(d, 'fried');
  if (fl <= 1) out.push(fl > 0 ? `🥨 Fried budget me sirf ${fl} bacha hai` : '🥨 Fried budget khatam — Desk Dabba zindabad 🫘');
  if ([1, 2, 3].every(i => (dv(addDays(d, -i)).slips.fried || 0) > 0)) out.push('👀 3 din se lagatar fried. Aaj break karte hain?');
  const toRetest = diffDays(d, RETEST);
  if (toRetest > 0) out.push(`🩸 Lipid retest me ${toRetest} din baaki. LDL ko surprise do!`);
  const ps = phaseStatus();
  if (ps.cur.n < 6) out.push(ps.eligible ? '🔓 Next phase unlock ready hai! Plan tab dekho' : `🗺️ Phase ${ps.cur.n + 1} unlock: ${Math.max(0, 14 - ps.daysIn)} din + ${Math.max(0, 11 - ps.good)} aur 70+ wale din`);
  const w = [...S.weights].sort((a, b) => a.date.localeCompare(b.date));
  if (w.length > 1 && w[w.length - 1].kg < w[0].kg) out.push(`⚖️ Start se ${(w[0].kg - w[w.length - 1].kg).toFixed(1)} kg kam! 👏`);
  const beaten = loggedDays().reduce((a, k) => a + (S.days[k].beaten || 0), 0);
  if (beaten) out.push(`💪 Ab tak ${beaten} cravings ko haraya hai!`);
  return out;
}

function weekReport(d) {
  if ((parseD(d).getDay() + 6) % 7 > 1) return ''; // only Monday & Tuesday
  const stats = w => {
    const ds = [...Array(7)].map((_, i) => addDays(w, i)).filter(k => S.days[k]);
    if (!ds.length) return null;
    const sum = f => ds.reduce((a, k) => a + f(k), 0);
    return {
      n: ds.length,
      avg: Math.round(sum(k => scoreOf(k).score) / ds.length),
      sweets: sum(k => S.days[k].slips.sweets || 0),
      fried: sum(k => S.days[k].slips.fried || 0),
      prot: Math.round(sum(k => proteinOf(S.days[k])) / ds.length),
    };
  };
  const lastW = addDays(weekStart(d), -7);
  const a = stats(lastW), b = stats(addDays(lastW, -7));
  if (!a || a.n < 3) return '';
  const grade = a.avg >= 85 ? 'A+ 🏆' : a.avg >= 75 ? 'A 🌟' : a.avg >= 60 ? 'B 👍' : a.avg >= 45 ? 'C 😐' : 'D 😬';
  const cmp = (k, lowerBetter) => !b || a[k] === b[k] ? '' : ((a[k] < b[k]) === lowerBetter ? ' ✅' : ' 🔻');
  return `<div class="card"><h3>📒 Pichle hafte ka report card: ${grade}</h3>
    <div class="tiles">
      <div class="tile"><b>${a.avg}${cmp('avg', false)}</b><span>Avg score</span></div>
      <div class="tile"><b>${a.n}/7</b><span>Din log kiye</span></div>
      <div class="tile"><b>${a.sweets}${cmp('sweets', true)}</b><span>Mithai</span></div>
      <div class="tile"><b>${a.fried}${cmp('fried', true)}</b><span>Fried</span></div>
      <div class="tile"><b>${a.prot}g${cmp('prot', false)}</b><span>Avg protein / din</span></div>
    </div></div>`;
}

function renderCoach() {
  const now = new Date(), d = today();
  const qs = coachQuestions(d, now).slice(0, 2);
  const ins = insights(d), k = Math.floor(openSeed * ins.length);
  const lines = [...new Set([ins[k], ins[(k + 1) % ins.length]])];
  const qHtml = qs.length
    ? qs.map(q => `<div class="q"><p>${q.text}</p><div class="opts">${q.opts.map((o, i) =>
        `<button class="opt" data-act="coach" data-q="${q.id}" data-o="${i}">${o[0]}</button>`).join('')}</div></div>`).join('')
    : '<p class="q-done">✅ Abhi ke liye sab update hai! Thodi der baad aana — naye sawaal ready rahenge 😉</p>';
  return `<div class="card coach">
    <div class="coach-head"><span class="avatar">🧔‍♂️</span><div><b>${greeting(now.getHours() + now.getMinutes() / 60)}</b>
      <small>${pad(now.getHours())}:${pad(now.getMinutes())} · Coach Chacha</small></div></div>
    <ul class="insights">${lines.map(l => `<li>${l}</li>`).join('')}</ul>${qHtml}</div>`;
}

/* ---------- Render ---------- */
function render() {
  renderHeader();
  renderBanner();
  document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.tab').forEach(s => { s.hidden = s.id !== tab; });
  ({ today: renderToday, stats: renderStats, plan: renderPlan, backup: renderBackup })[tab]();
}

function renderHeader() {
  const P = phaseOn(today());
  const st = streakInfo();
  const xp = totalXP();
  const lv = levelOf(xp);
  const pending = Math.max(0, taxTotal() - S.tax.paid);
  $('#quote').textContent = daily(QUOTES, today());
  $('#chips').innerHTML = `
    <span class="chip-h">${P.emoji} Phase ${P.n}</span>
    <span class="chip-h">🔥 ${st.cur} din</span>
    <span class="chip-h">${lv.name} · ${xp} XP</span>
    <span class="chip-h">🫙 Tax ₹${pending}</span>`;
}

function renderBanner() {
  $('#banner').innerHTML = needsBackup()
    ? `<div class="banner"><span>💾 Backup time! ${S.lastBackup ? 'Last: ' + short(S.lastBackup) : 'Abhi tak ek bhi nahi liya'}</span><button class="btn" data-act="share">Backup lo</button></div>`
    : '';
}

function renderToday() {
  const d = cur, x = dv(d), r = scoreOf(d), P = r.P, isToday = d === today();
  const active = HABITS.filter(h => h.phase <= P.n);
  const next = HABITS.filter(h => h.phase === P.n + 1);

  let checks = '', slot = '';
  for (const h of active) {
    if (h.slot !== slot) { checks += `<div class="slot">${h.slot}</div>`; slot = h.slot; }
    const on = !!x.checks[h.id];
    checks += `<label class="check ${on ? 'on' : ''}"><input type="checkbox" data-act="check" data-id="${h.id}" ${on ? 'checked' : ''}><span>${h.label}</span></label>`;
  }
  if (next.length) checks += `<div class="locked">🔒 Phase ${P.n + 1} me unlock: ${next.map(h => h.label).join(' · ')}</div>`;

  const slips = SLIPS.map(s => {
    const n = x.slips[s.id] || 0;
    let info;
    if (s.id === 'sweets' || s.id === 'fried') {
      const used = weekCum(d, s.id), budget = P[s.id];
      info = `<small class="${used > budget ? 'over' : ''}">Is hafte: ${used}/${budget} allowed</small>`;
    } else {
      info = `<small>${P.strictGraze ? 'Har ek = penalty 😈' : 'Phase 1: sirf track, penalty nahi'}</small>`;
    }
    return `<div class="counter"><div><b>${s.emoji} ${s.label}</b>${info}</div>
      <div class="ctl"><button data-act="slip" data-id="${s.id}" data-d="-1">−</button><span>${n}</span><button data-act="slip" data-id="${s.id}" data-d="1">+</button></div></div>`;
  }).join('');

  const pct = Math.min(100, (r.prot / P.protein) * 100);
  const foods = FOODS.map(([k, l, g]) => `<button class="food" data-act="prot" data-k="${k}">${l} <b>+${g}g</b></button>`).join('');
  const eaten = x.protein.map((p, i) => `<button class="chip" data-act="unprot" data-i="${i}">${FOOD_MAP[p.k] ? FOOD_MAP[p.k].l : p.k} ✕</button>`).join('');

  const pens = x.penances.length
    ? x.penances.map((p, i) => `<label class="penance"><input type="checkbox" data-act="penance" data-i="${i}" ${p.done ? 'checked' : ''}><span>${esc(p.text)}</span></label>`).join('')
    : '<p class="muted">Koi saza pending nahi. Waah! 😇</p>';

  const ringColor = r.score >= 70 ? '#16a34a' : r.score >= 40 ? '#f97316' : '#dc2626';

  $('#today').innerHTML = `
    <div class="card datebar">
      <button class="icon-btn" data-act="prevDay">◀</button>
      <div style="text-align:center"><b>${isToday ? 'Aaj · ' : ''}${pretty(d)}</b><small>${P.emoji} Phase ${P.n}: ${P.name}</small></div>
      <button class="icon-btn" data-act="nextDay" ${isToday ? 'disabled' : ''}>▶</button>
    </div>

    ${isToday ? weekReport(d) + renderCoach() : ''}

    <div class="card scorecard">
      <div class="ring" style="--p:${r.score};--c:${ringColor}"><span>${r.score}</span></div>
      <div>
        <div class="score-msg">${scoreMsg(r.score)}</div>
        <small>Habits ${r.done}/${r.total} · Protein ${r.prot}/${P.protein}g${r.over ? ` · <span class="over">${r.over} slip over budget</span>` : ''}</small>
        <small>70+ = streak day 🔥</small>
      </div>
    </div>

    <button class="sos" data-act="sos">🚨 CRAVING SOS — mathri bula rahi hai!</button>

    <div class="card"><h3>🎯 Aaj ka challenge (+3 bonus)</h3>
      <label class="check ${x.challenge ? 'on' : ''}"><input type="checkbox" data-act="challenge" ${x.challenge ? 'checked' : ''}><span>${daily(CHALLENGES, d)}</span></label>
      <p class="tip">💡 <b>Aaj ka gyaan:</b> ${daily(TIPS, d)}</p>
    </div>

    <div class="card"><h3>✅ Aaj ki checklist</h3>${checks}</div>

    <div class="card"><h3>🙈 Imaandari wala corner (slips)</h3>${slips}
      <div class="counter"><div><b>🧈 Ghee wali roti</b><small class="${r.go ? 'over' : ''}">Limit: ${P.ghee}/day</small></div>
        <div class="ctl"><button data-act="ghee" data-d="-1">−</button><span>${x.ghee || 0}</span><button data-act="ghee" data-d="1">+</button></div></div>
    </div>

    <div class="card"><h3>💪 Protein meter: ${r.prot} / ${P.protein} g</h3>
      <div class="bar"><i style="width:${pct}%"></i></div>
      <div class="foods">${foods}</div>
      ${eaten ? `<div class="eaten">${eaten}</div>` : ''}
    </div>

    <div class="card"><h3>😈 Saza list</h3>${pens}
      <div class="row" style="margin-top:8px"><button class="btn alt" data-act="wheel">🎡 Wheel ghumao</button></div>
    </div>

    <div class="card"><h3>📝 Note</h3>
      <textarea id="note" rows="2" placeholder="Aaj kaisa raha? Kya trigger hua?">${esc(x.note || '')}</textarea>
    </div>`;
}

function renderStats() {
  const t = today();
  const days = loggedDays();
  const st = streakInfo();
  const last7 = [...Array(7)].map((_, i) => addDays(t, -i)).filter(d => S.days[d]);
  const avg7 = last7.length ? Math.round(last7.reduce((a, d) => a + scoreOf(d).score, 0) / last7.length) : 0;
  const protAvg = last7.length ? Math.round(last7.reduce((a, d) => a + proteinOf(dv(d)), 0) / last7.length) : 0;
  const beaten = days.reduce((a, d) => a + (S.days[d].beaten || 0), 0);
  const tax = taxTotal();

  const d30 = [...Array(30)].map((_, i) => addDays(t, i - 29));
  const scoreChart = svgChart({ labels: d30.map(short), series: [{ name: 'Score', color: '#f97316', values: d30.map(d => S.days[d] ? scoreOf(d).score : null) }], min: 0, max: 100, target: 70 });

  const weeks = [...Array(12)].map((_, i) => addDays(weekStart(t), (i - 11) * 7));
  const wsum = (w, k) => { let c = 0; for (let i = 0; i < 7; i++) c += dv(addDays(w, i)).slips[k] || 0; return c; };
  const slipChart = svgChart({
    type: 'bar', labels: weeks.map(short),
    series: [
      { name: 'Mithai', color: '#db2777', values: weeks.map(w => wsum(w, 'sweets')) },
      { name: 'Fried', color: '#ca8a04', values: weeks.map(w => wsum(w, 'fried')) },
    ],
  });

  const d14 = [...Array(14)].map((_, i) => addDays(t, i - 13));
  const protChart = svgChart({ type: 'bar', labels: d14.map(short), series: [{ name: 'Protein g', color: '#16a34a', values: d14.map(d => S.days[d] ? proteinOf(S.days[d]) : null) }], target: phaseOn(t).protein });

  const ws = [...S.weights].sort((a, b) => a.date.localeCompare(b.date));
  const wkg = ws.map(w => w.kg);
  const weightChart = svgChart({ labels: ws.map(w => short(w.date)), series: [{ name: 'Weight', color: '#2563eb', values: wkg }], min: wkg.length ? Math.floor(Math.min(...wkg) - 3) : 0, max: wkg.length ? Math.ceil(Math.max(...wkg) + 3) : null });

  const lp = [...S.lipids].sort((a, b) => a.date.localeCompare(b.date));
  const lipChart = svgChart({
    labels: lp.map(l => short(l.date)),
    series: [{ name: 'LDL', color: '#dc2626', values: lp.map(l => l.ldl) }, { name: 'HDL', color: '#16a34a', values: lp.map(l => l.hdl) }],
    min: 0, target: 100,
  });
  const lipRows = lp.map(l => `<tr><td>${short(l.date)}/${parseD(l.date).getFullYear() % 100}</td><td>${l.total ?? '–'}</td><td><b>${l.ldl ?? '–'}</b></td><td>${l.hdl ?? '–'}</td><td>${l.tg ?? '–'}</td><td><button data-act="delLipid" data-date="${l.date}">🗑️</button></td></tr>`).join('');

  $('#stats').innerHTML = `
    <div class="card"><h3>🏆 Scoreboard</h3>
      <div class="tiles">
        <div class="tile"><b>${days.length}</b><span>Din log kiye</span></div>
        <div class="tile"><b>${avg7}</b><span>Avg score (7 din)</span></div>
        <div class="tile"><b>🔥 ${st.cur} / ${st.best}</b><span>Streak abhi / best</span></div>
        <div class="tile"><b>${beaten}</b><span>Cravings harayi 💪</span></div>
        <div class="tile"><b>${protAvg} g</b><span>Avg protein (7 din)</span></div>
        <div class="tile"><b>₹${tax}</b><span>Murukku Tax total (₹${S.tax.paid} jar me)</span></div>
      </div>
      <div class="row" style="margin-top:10px"><button class="btn ghost" data-act="payTax">🫙 Jar me paise daale</button></div>
    </div>
    <div class="card"><h3>📈 Daily score (30 din)</h3>${scoreChart}</div>
    <div class="card"><h3>🍬 Mithai & 🥨 Fried per week</h3>${slipChart}</div>
    <div class="card"><h3>💪 Protein (14 din)</h3>${protChart}</div>
    <div class="card"><h3>⚖️ Weight</h3>${weightChart}
      <div class="form-grid" style="margin-top:10px">
        <div><label>Date</label><input type="date" id="wDate" value="${t}" max="${t}"></div>
        <div><label>Weight (kg)</label><input type="number" id="wKg" step="0.1" placeholder="82.9"></div>
      </div>
      <button class="btn" data-act="addWeight">Save weight</button>
    </div>
    <div class="card"><h3>🩸 Lipid reports (LDL target &lt; 100)</h3>${lp.length > 1 ? lipChart : ''}
      <table><tr><th>Date</th><th>Total</th><th>LDL</th><th>HDL</th><th>TG</th><th></th></tr>${lipRows}</table>
      <div class="form-grid" style="margin-top:10px">
        <div><label>Date</label><input type="date" id="lDate" value="${t}" max="${t}"></div>
        <div><label>Total</label><input type="number" id="lTotal" step="0.1"></div>
        <div><label>LDL</label><input type="number" id="lLdl" step="0.1"></div>
        <div><label>HDL</label><input type="number" id="lHdl" step="0.1"></div>
        <div><label>Triglycerides</label><input type="number" id="lTg" step="0.1"></div>
      </div>
      <button class="btn" data-act="addLipid">Add report</button>
    </div>`;
}

function renderPlan() {
  const ps = phaseStatus();
  const phases = PHASES.map(p => `<div class="phase ${p.n === ps.cur.n ? 'cur' : p.n < ps.cur.n ? 'done' : ''}">
      <b>${p.n < ps.cur.n ? '✅' : p.n === ps.cur.n ? '👉' : '🔒'} Phase ${p.n}: ${p.emoji} ${p.name}</b><small>${p.rule}</small></div>`).join('');
  const options = PHASES.map(p => `<option value="${p.n}" ${p.n === ps.cur.n ? 'selected' : ''}>Phase ${p.n} – ${p.name}</option>`).join('');

  $('#plan').innerHTML = `
    <div class="card"><h3>🗺️ Phase progress</h3>
      <p>Phase ${ps.cur.n} me <b>${ps.daysIn}</b> din · last 14 din me <b>${ps.good}</b> din 70+ score.</p>
      <small>Next phase unlock: kam se kam 14 din + 14 me se 11 din 70+ score.</small>
      <div class="row" style="margin-top:10px">
        <button class="btn good" data-act="nextPhase" ${ps.eligible ? '' : 'disabled'}>🔓 Next phase unlock karo</button>
      </div>
      <details style="margin-top:10px"><summary class="muted">Manually phase badlo</summary>
        <div class="row" style="margin-top:8px"><select id="phaseSel">${options}</select><button class="btn ghost" data-act="setPhase">Set</button></div>
      </details>
    </div>
    <div class="card"><h3>📜 6 Phases (har 2 hafte ek naya rule)</h3>${phases}</div>
    <div class="card"><h3>⏰ Tumhara din (final target)</h3>
      <ul class="clean">
        <li><b>5:30</b> — 2 glass paani → 1 hr walk + yoga (25 min brisk).</li>
        <li><b>6:30</b> — Toned packet milk (buffalo nahi) + seed mix: 1 tsp pisi alsi, 1 tbsp pumpkin seeds, 4–5 badaam/akhrot.</li>
        <li><b>7:30</b> — Moong/besan chilla + curd, ya sprouts/kala chana. Poha max 2x/week.</li>
        <li><b>10:30–11</b> — Salad pehle → 2–3 jau/jowar mix roti, sabzi, dal, curd. Mithai (budget me ho toh) sirf yahin, 1 piece.</li>
        <li><b>1–4 PM</b> — Sirf EK snack, Desk Dabba se. Chai: 1 cup, cheeni 1 → ½ chammach.</li>
        <li><b>6 PM</b> — Dal + lauki/palak/bhindi + 2 roti, ya idli-sambar, ya steamed dhokla (kam tel). Dal bati / chole / rajma / aloo paratha = weekly Joy Meal.</li>
        <li><b>After dinner</b> — Walk, phir kitchen band. Sirf paani / tulsi tea.</li>
        <li><b>Saturday Joy Meal</b> 🎉 — ek meal bina guilt. Strict diet hi binge karwati hai.</li>
      </ul>
    </div>
    <div class="card"><h3>🥜 Desk Dabba (1–4 PM craving ka ilaaj)</h3>
      <ul class="clean">
        <li>Roasted chana (30g) / dry-roasted makhana</li>
        <li>Peanuts — sirf ek mutthi</li>
        <li>Kheera, gajar, amrood, seb, nashpati</li>
        <li>Sprouts chaat (subah bana ke rakh lo)</li>
        <li>Chaas ki bottle 🥤</li>
      </ul>
      <small>Golden rule: "Kuch bhi chahiye" wali bhook ke liye <b>jo saamne pada hai</b> wahi badlo. Mathri ka dabba desk se door, family ko bol do 🙏</small>
    </div>
    <div class="card"><h3>🩺 Report (12 Nov 2026)</h3>
      <p>LDL <b class="over">149</b> (borderline high) · HDL <b>57</b> ✅ · TG <b>104</b> ✅ · BMI 23.2 ✅</p>
      <p>Target: LDL &lt; 130 by Feb 2027, phir &lt; 100. Lipid test dobara ~<b>mid-Feb 2027</b>.</p>
      <small>Ye medical advice nahi hai — doctor se zaroor discuss karo, khaaskar whey aur supplements se pehle.</small>
    </div>`;
}

function renderBackup() {
  $('#backup').innerHTML = `
    <div class="card"><h3>💾 Backup</h3>
      <p class="muted">Data sirf is phone ke browser me save hai. Hafte me ek baar backup file Google Drive / WhatsApp (Message Yourself) pe bhej do.</p>
      <p>Last backup: <b>${S.lastBackup ? pretty(S.lastBackup) : 'Kabhi nahi 😬'}</b></p>
      <div class="row">
        <button class="btn alt" data-act="share">📤 Share backup</button>
        <button class="btn ghost" data-act="export">⬇️ Download</button>
      </div>
      <div class="row" style="margin-top:8px"><button class="btn ghost" data-act="import">⬆️ Import / Restore backup</button></div>
    </div>
    <div class="card"><h3>🫙 Murukku Tax rate</h3>
      <p class="muted">Har over-budget slip pe itne rupaye jar me. Jar ke paise se kuch healthy kharido (shoes, whey, fruits).</p>
      <div class="row"><input type="number" id="taxRate" value="${S.tax.rate}" min="0" step="10"><button class="btn ghost" data-act="setTax">Save</button></div>
    </div>
    <div class="card"><h3>⚠️ Danger zone</h3>
      <button class="btn bad" data-act="reset">Sab data delete karo</button>
    </div>
    <p class="muted" style="text-align:center">Install: browser menu → "Add to Home screen" 📱</p>`;
}

/* ---------- Wheel ---------- */
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

/* ---------- SOS ---------- */
let sosTimer = null;
function openSos() {
  $('#sosRoast').textContent = pick(SOS_ROASTS);
  let left = 600;
  const show = () => { $('#sosTimer').textContent = `${pad(Math.floor(left / 60))}:${pad(left % 60)}`; };
  show();
  clearInterval(sosTimer);
  sosTimer = setInterval(() => {
    left--;
    show();
    if (left <= 0) { clearInterval(sosTimer); $('#sosRoast').textContent = '⏰ 10 minute ho gaye! Craving ab bhi hai? Mujhe toh nahi lagta 😎'; }
  }, 1000);
  $('#sosModal').hidden = false;
}
function closeSos() { clearInterval(sosTimer); $('#sosModal').hidden = true; }

/* ---------- Backup ---------- */
const backupJson = () => JSON.stringify(S, null, 1);
const backupName = ext => `laddoo-vs-me-backup-${today()}.${ext}`;
function markBackup() { S.lastBackup = today(); save(); render(); }

function downloadBackup() {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([backupJson()], { type: 'application/json' }));
  a.download = backupName('json');
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  markBackup();
  toast('Backup download ho gaya ⬇️ Ab Drive / WhatsApp pe bhej do.');
}

async function shareBackup() {
  const candidates = [
    new File([backupJson()], backupName('json'), { type: 'application/json' }),
    new File([backupJson()], backupName('txt'), { type: 'text/plain' }),
  ];
  const file = navigator.canShare ? candidates.find(f => navigator.canShare({ files: [f] })) : null;
  if (!file) { downloadBackup(); return; }
  try {
    await navigator.share({ files: [file], title: 'Laddoo vs Me backup' });
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
      if (!data || typeof data.days !== 'object' || !Array.isArray(data.phases)) throw new Error('bad');
      if (!confirm(`Backup me ${Object.keys(data.days).length} din ka data hai. Current data replace karein?`)) return;
      S = Object.assign(defaultState(), data);
      save();
      cur = today();
      render();
      toast('Backup restore ho gaya ✅');
    } catch (e) {
      toast('Ye valid backup file nahi lag rahi 🤔');
    }
  };
  rd.readAsText(file);
}

/* ---------- Events ---------- */
function onAction(act, el) {
  const d = cur;
  switch (act) {
    case 'prevDay': cur = addDays(cur, -1); break;
    case 'nextDay': if (cur < today()) cur = addDays(cur, 1); break;
    case 'slip': {
      const delta = Number(el.dataset.d), id = el.dataset.id, x = day(d);
      const before = scoreOf(d).over;
      x.slips[id] = Math.max(0, (x.slips[id] || 0) + delta);
      save();
      if (delta > 0) {
        if (scoreOf(d).over > before) { toast(pick(SLIP_ROASTS)); setTimeout(openWheel, 700); }
        else if (id === 'sweets' || id === 'fried') toast(`Budget me hai, enjoy karo 😌 (hafte ka ${weekCum(d, id)}/${phaseOn(d)[id]})`);
        else toast('Note kar liya 📝 Phase 2 se ispe saza milegi 😈');
      }
      break;
    }
    case 'ghee': {
      const x = day(d);
      x.ghee = Math.max(0, (x.ghee || 0) + Number(el.dataset.d));
      save();
      if (Number(el.dataset.d) > 0 && x.ghee > phaseOn(d).ghee) toast('Ghee limit cross! 🧈 Kal sukhi roti try karo.');
      break;
    }
    case 'prot': {
      const f = FOOD_MAP[el.dataset.k];
      const x = day(d);
      const was = proteinOf(x);
      x.protein.push({ k: el.dataset.k, g: f.g });
      save();
      const target = phaseOn(d).protein;
      if (was < target && proteinOf(x) >= target) { confetti(); toast('Protein target hit! 💪 Pehelwan ban rahe ho!'); }
      else toast(`+${f.g}g protein 💪`, 1500);
      break;
    }
    case 'unprot': day(d).protein.splice(Number(el.dataset.i), 1); save(); break;
    case 'sos': openSos(); return;
    case 'coach': {
      const q = coachQuestions(d).find(z => z.id === el.dataset.q);
      if (!q) break;
      const o = Number(el.dataset.o), [, effect, reaction] = q.opts[o];
      const x = day(d);
      x.asked = x.asked || {};
      if (effect === 'SNOOZE') { x.asked[q.id] = { snooze: true, t: Date.now() }; save(); toast('Theek hai, 45 min baad phir poochunga ⏰'); break; }
      if (effect === 'WEIGHT') {
        const kg = Number(prompt('Aaj ka weight (kg)?', ''));
        if (!(kg > 30 && kg < 250)) { toast('Sahi weight daalo 🙂'); return; }
        S.weights = S.weights.filter(w => w.date !== d).concat({ date: d, kg });
        const first = [...S.weights].sort((a, b) => a.date.localeCompare(b.date))[0];
        toast(kg < first.kg ? `Start se ${(first.kg - kg).toFixed(1)} kg kam! 🎉` : 'Weight saved ⚖️');
        x.asked[q.id] = { o, t: Date.now() };
        save();
        break;
      }
      const before = scoreOf(d).over;
      x.asked[q.id] = { o, t: Date.now() };
      if (effect === 'SOS') { save(); render(); openSos(); return; }
      if (typeof effect === 'function') effect(x);
      save();
      if (scoreOf(d).over > before) { toast(pick(SLIP_ROASTS)); setTimeout(openWheel, 700); }
      else toast(reaction || pick(PRAISE), 2500);
      break;
    }
    case 'sosClose': closeSos(); return;
    case 'sosWin': day(today()).beaten = (dv(today()).beaten || 0) + 1; save(); closeSos(); confetti(); toast('Craving harayi! 🏆 +2 bonus. Sher ho tum 🦁'); cur = today(); break;
    case 'sosLose': day(today()).lost = (dv(today()).lost || 0) + 1; save(); closeSos(); cur = today(); toast('Koi na. Imaandari se slip me + karo, phir wheel ghumao 🎡', 4000); break;
    case 'wheel': openWheel(); return;
    case 'wheelClose': if (!spinning) $('#wheelModal').hidden = true; return;
    case 'spin': spin(); return;
    case 'payTax': {
      const pending = Math.max(0, taxTotal() - S.tax.paid);
      const v = prompt('Kitne rupaye jar me daale?', pending);
      const amt = Number(v);
      if (v !== null && amt > 0) { S.tax.paid += amt; save(); toast(`₹${amt} jar me 🫙 Shabaash!`); }
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
      if (!rec.date || rec.ldl == null) { toast('Kam se kam date aur LDL daalo'); return; }
      S.lipids = S.lipids.filter(l => l.date !== rec.date).concat(rec);
      save();
      const first = [...S.lipids].sort((a, b) => a.date.localeCompare(b.date))[0];
      if (first && rec.ldl < first.ldl) { confetti(); toast(`LDL ${Math.round(first.ldl - rec.ldl)} points kam! 🎉🩸`); }
      else toast('Report saved 🩸');
      break;
    }
    case 'delLipid': if (confirm('Ye report delete karein?')) { S.lipids = S.lipids.filter(l => l.date !== el.dataset.date); save(); } break;
    case 'nextPhase': {
      const ps = phaseStatus();
      if (!ps.eligible) return;
      S.phases.push({ n: ps.cur.n + 1, start: today() });
      save(); confetti();
      toast(`🔓 Phase ${ps.cur.n + 1} unlock! ${PHASES[ps.cur.n].name} ${PHASES[ps.cur.n].emoji}`, 4000);
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
    case 'reset':
      if (confirm('Pakka? Saara data delete ho jaayega!') && confirm('Last chance — backup liya hai?')) {
        localStorage.removeItem(KEY); S = defaultState(); save(); cur = today(); toast('Fresh start 🌱');
      }
      break;
    default: return;
  }
  render();
}

document.addEventListener('click', e => {
  const tabBtn = e.target.closest('.tabs button');
  if (tabBtn) { tab = tabBtn.dataset.tab; render(); window.scrollTo(0, 0); return; }
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
    if (el.checked && r.done === r.total) { confetti(); toast('Saari habits done! 🎉 Aaj tum champion ho!'); }
    render();
  } else if (el.dataset.act === 'challenge') {
    day(cur).challenge = el.checked;
    save();
    if (el.checked) { confetti(); toast('Challenge complete! +3 bonus 🎯'); }
    render();
  } else if (el.dataset.act === 'penance') {
    const p = day(cur).penances[Number(el.dataset.i)];
    p.done = el.checked;
    save();
    if (el.checked) toast('Saza poori! Hisaab barabar 🤝 +2 bonus');
    render();
  } else if (el.id === 'importFile' && el.files[0]) {
    importBackup(el.files[0]);
    el.value = '';
  }
});

document.addEventListener('input', e => {
  if (e.target.id === 'note') { day(cur).note = e.target.value; save(); }
});

// Each time the app is reopened: jump to today, fresh insights, time-relevant questions.
let lastToday = today();
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') return;
  if (cur === lastToday) cur = today();
  lastToday = today();
  openSeed = Math.random();
  render();
});

// Keep the coach current if the app stays open (skipped while typing or a popup is open).
setInterval(() => {
  const busy = !$('#sosModal').hidden || !$('#wheelModal').hidden || (document.activeElement || {}).tagName === 'TEXTAREA' || (document.activeElement || {}).tagName === 'INPUT';
  if (document.visibilityState === 'visible' && !busy && tab === 'today') render();
}, 5 * 60000);

/* ---------- Boot ---------- */
if (!localStorage.getItem(KEY)) save();
render();

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
  navigator.serviceWorker.register('sw.js').catch(console.error);
}
if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
