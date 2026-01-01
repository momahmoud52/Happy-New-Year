/* ==========================================================
   Romantic New Year 2026 – script.js (PRO)
   State-driven | Cinematic | Secure | Mobile-safe
   ========================================================== */

/* =====================
   DOM Cache
   ===================== */
const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];
const APP = {
  body: document.body,
  pages: {
    password: $('#page-password'),
    main: $('#page-main'),
    messages: $('#page-messages')
  },
  transition: $('#transition-layer'),
  transitionText: $('.transition-text'),
  passwordInput: $('#password-input'),
  passwordBtn: $('#password-submit'),
  passwordFeedback: $('#password-feedback'),
  globalMusic: $('#global-music'),
  musicItems: $$('.music-item'),
  toMessagesBtn: $('#to-messages'),
  messageBoxes: $$('.message-box')
};
/* =====================
   Config (EDIT HERE)
   ===================== */
const CONFIG = {
  PASSWORD_HASH: '1-5-2005', // غيّره لاحقاً
  TRANSITION_DURATION: 1600,
  MUSIC_VOLUME: 0.45,
  MESSAGE_DELAY: 1300
};

const ERRORS = [
  'ليس كل القلوب يُسمح لها بالدخول 💔',
  'هذا السر لا يعرفه إلا قلب واحد',
  'الذكريات لا تُفتح بسهولة',
  'اقتربت… لكن ليس بعد'
];

/* =====================
   State
   ===================== */
const State = {
  current: 'locked',
  audioUnlocked: false,
  currentTrack: null
};

/* =====================
   Core – State Machine
   ===================== */
function setState(next) {
  State.current = next;
  APP.body.setAttribute('data-app-state', next);
}

function showPage(key) {
  Object.values(APP.pages).forEach(p => p.classList.remove('page-active'));
  APP.pages[key]?.classList.add('page-active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* =====================
   Transition Layer
   ===================== */
function playTransition(text = '...') {
  APP.transitionText.textContent = text;
  APP.transition.classList.add('active');

  return new Promise(resolve => {
    setTimeout(() => {
      APP.transition.classList.remove('active');
      resolve();
    }, CONFIG.TRANSITION_DURATION);
  });
}

/* =====================
   Audio System
   ===================== */
function unlockAudio() {
  if (State.audioUnlocked) return;
  State.audioUnlocked = true;
  APP.globalMusic.volume = CONFIG.MUSIC_VOLUME;
  APP.globalMusic.play().catch(() => {});
}

function playMusic(src) {
  unlockAudio();

  if (State.currentTrack === src) {
    APP.globalMusic.pause();
    State.currentTrack = null;
    return;
  }

  State.currentTrack = src;
  APP.globalMusic.src = src;
  APP.globalMusic.play().catch(() => {});
}

/* =====================
   Security – Password
   ===================== */
function deny() {
  APP.passwordFeedback.textContent =
    ERRORS[Math.floor(Math.random() * ERRORS.length)];
  APP.passwordInput.value = '';
  APP.passwordInput.focus();
}


async function accept() {
  APP.passwordFeedback.textContent = '';
  setState('unlocked');

  await playTransition(' فتاتي مرحباً بكِ…');

  /* إزالة صفحة كلمة المرور نهائياً */
  APP.pages.password.remove();

  showPage('main');
  unlockAudio();
}


/* Prevent paste / reveal / inspect helpers */
['paste', 'copy', 'cut', 'contextmenu'].forEach(evt =>
  APP.passwordInput.addEventListener(evt, e => e.preventDefault())
);

APP.passwordInput.addEventListener('input', () => {
  APP.passwordInput.type = 'password';
});

/* =====================
   Events – Password
   ===================== */
APP.passwordBtn.addEventListener('click', () => {
  unlockAudio();

  if (APP.passwordInput.value === CONFIG.PASSWORD_HASH) {
    accept();
  } else {
    deny();
  }
});

APP.passwordInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') APP.passwordBtn.click();
});

/* =====================
   Music Buttons
   ===================== */
APP.musicItems.forEach(btn => {
  btn.addEventListener('click', () => {
    playMusic(btn.dataset.audioSrc);
  });
});

/* =====================
   Navigation
   ===================== */
APP.toMessagesBtn.addEventListener('click', async () => {
  setState('messages');

  await playTransition('إلى قلبك…');

  showPage('messages');
  revealMessages();
});

/* =====================
   Messages Animation
   ===================== */
function revealMessages() {
  APP.messageBoxes.forEach((box, i) => {
    box.style.opacity = '0';
    box.style.transform = 'translateY(20px)';

    setTimeout(() => {
      box.style.opacity = '1';
      box.style.transform = 'translateY(0)';
    }, i * CONFIG.MESSAGE_DELAY);
  });
}

/* =====================
   Global Safety
   ===================== */
window.addEventListener('error', () => {
  /* silent fail – keep magic alive */
});
