/* ===== UTIL ===== */
const $ = (sel) => document.querySelector(sel);
const teacherNameInput = $('#teacherName');
const createBtn = $('#createBtn');
const resetBtn = $('#resetBtn');
const closeBtn = $('#closeBtn');
const preview = $('#preview');
const wishBody = $('#wishBody');
const glitterCanvas = document.getElementById('glitter');
const confettiCanvas = document.getElementById('confetti');

/* Keep background stable on resize (no animation) */
function sizeCanvases() {
  glitterCanvas.width = innerWidth;
  glitterCanvas.height = innerHeight;
  confettiCanvas.width = innerWidth;
  confettiCanvas.height = innerHeight;
}
addEventListener('resize', sizeCanvases);
sizeCanvases();

function titleCase(str) {
  return str
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    .join(' ');
}

/* ===== QUOTES ===== */
const quotes = [
  "You are a guide, mentor and inspiration. 🔭",
  "Teaching is the one profession that creates all other professions. ✨",
  "A teacher plants the seeds of knowledge that grow forever. 🌱",
  "You don’t just teach — you inspire dreams. 🌟",
  "A teacher takes a hand, opens a mind, and touches a heart. 💖",
  "Knowledge shared by you is a treasure for life. 📚",
  "Great teachers shape great futures. 🚀",
  "Your wisdom lights the path for many. 🕯️",
  "A teacher’s impact lasts a lifetime. ⏳",
  "You teach not just lessons, but life. 🌍",
  "Every day you make a difference. 🌈",
  "Good teachers are the reason why ordinary students dream big. 💭",
  "Your guidance is a priceless gift. 🎁",
  "Teachers like you turn learning into joy. 🎶",
  "Behind every successful student is a caring teacher. 🌹",
  "You inspire curiosity, courage, and confidence. 🔑",
  "The world needs more teachers like you. 🌎",
  "A teacher is a compass that activates the magnets of curiosity. 🧭",
  "You don’t just educate, you empower. 💪",
  "Your lessons go beyond books and last a lifetime. 📖"
];

function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

/* ===== WISH GENERATION ===== */
function buildWish(name) {
  const n = name ? titleCase(name) : 'Teacher';
  const randomQuote = getRandomQuote();
  return `
    <p>🌸 <strong>Dear ${n}</strong>,</p>
    <p>${randomQuote}</p>
    <p>Wishing you a very <strong>Happy Teachers' Day!</strong> 🎉</p>
    <p>With respect and gratitude,</p>
    <p><strong>Coding Club — Department of Computer Applications</strong><br/>PSVASC</p>`;
}

function openPreview() {
  preview.classList.remove('hidden');
  confettiBurst(); // Fire poppers when wish opens
}

function closePreview() {
  preview.classList.add('hidden');
}

/* ===== EVENTS ===== */
createBtn.addEventListener('click', () => {
  const val = teacherNameInput.value.trim();
  wishBody.innerHTML = buildWish(val);
  openPreview();
});

resetBtn.addEventListener('click', () => {
  teacherNameInput.value = '';
  teacherNameInput.focus();
});

closeBtn.addEventListener('click', closePreview);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePreview();
});

/* Press Enter to create */
teacherNameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') createBtn.click();
});

/* ===== STATIC GLITTER BACKGROUND (subtle, non-animated) ===== */
(function drawGlitter() {
  const ctx = glitterCanvas.getContext('2d', { alpha: true });
  const w = glitterCanvas.width;
  const h = glitterCanvas.height;

  // Light dusted stars — draw once (no animation)
  const density = 0.00012;
  const count = Math.max(100, Math.floor(w * h * density));
  const TAU = Math.PI * 2;
  for (let i = 0; i < count; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = Math.random() * 0.9 + 0.3;
    ctx.beginPath();
    const grd = ctx.createRadialGradient(x, y, 0, x, y, r * 10);
    grd.addColorStop(0, 'rgba(255,255,255,0.9)');
    grd.addColorStop(0.3, 'rgba(255,240,210,0.35)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grd;
    ctx.arc(x, y, r * 10, 0, TAU);
    ctx.fill();
  }
})();

/* ===== CONFETTI BURST ===== */
function confettiBurst() {
  const ctx = confettiCanvas.getContext('2d');
  const w = confettiCanvas.width;
  const h = confettiCanvas.height;

  const palette = ['#8ab4ff', '#ff7ab6', '#6ee7b7', '#ffd166', '#c4b5fd'];
  const pieces = [];
  for (let i = 0; i < 240; i++) {
    pieces.push({
      x: w / 2,
      y: h / 2 - 40,
      vx: (Math.random() * 2 - 1) * (Math.random() * 8 + 3),
      vy: Math.random() * -8 - 4,
      g: 0.22 + Math.random() * 0.08,
      size: Math.random() * 6 + 3,
      rot: Math.random() * Math.PI,
      vr: Math.random() * 0.2 - 0.1,
      life: 120 + Math.random() * 40,
      shape: Math.random() < 0.3 ? 'circle' : 'rect',
      color: palette[Math.floor(Math.random() * palette.length)]
    });
  }

  let frames = 0;
  (function tick() {
    frames++;
    ctx.clearRect(0, 0, w, h);
    for (const p of pieces) {
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life--;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, p.life / 160);
      ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    if (frames < 220) requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, w, h);
  })();
  }
