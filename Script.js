/* ==========================================================
   Romantic New Year 2026 – script.js
   Clean | State-driven | Cinematic | Mobile-safe
   ========================================================== */

/* =====================
   DOM Helpers
   ===================== */
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) =>
  Array.from(scope.querySelectorAll(selector));

/* =====================
   App Cache
   ===================== */
const APP = {
  body: document.body,

  pages: {
    password: $('#page-password'),
    main: $('#page-main'),
    messages: $('#page-messages')
  },

  transition: $('#transition-layer'),
  transitionText: $('.transition-text'),

  password: {
    input: $('#password-input'),
    button: $('#password-submit'),
    feedback: $('#password-feedback')
  },

  audio: {
    background: $('#global-music'),
    buttons: $$('.music-item')
  },

  navigation: {
    toMessages: $('#to-messages')
  },

  messages: {
    boxes: $$('.message-box')
  }
};

/* =====================
   Configuration
   ===================== */
const CONFIG = {
  PASSWORD: '1-5-2005',
  TRANSITION_DURATION: 1600,
  MUSIC_VOLUME: 0.45,
  MESSAGE_DELAY: 1300
};

const ERROR_MESSAGES = [
  'ليس كل القلوب يُسمح لها بالدخول 💔',
  'هذا السر لا يعرفه إلا قلب واحد',
  'الذكريات لا تُفتح بسهولة',
  'اقتربت… لكن ليس بعد'
];

/* =====================
   App State
   ===================== */
const STATE = {
  screen: 'locked',
  audioUnlocked: false,
  currentTrack: null
};

/* =====================
   State Control
   ===================== */
function setState(nextState) {
  STATE.screen = nextState;
  APP.body.dataset.appState = nextState;
}

function showPage(pageKey) {
  Object.values(APP.pages).forEach(page =>
    page.classList.remove('page-active')
  );

  APP.pages[pageKey]?.classList.add('page-active');
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
function unlockAudioOnce() {
  if (STATE.audioUnlocked) return;

  STATE.audioUnlocked = true;
  APP.audio.background.volume = CONFIG.MUSIC_VOLUME;
  APP.audio.background.play().catch(() => {});
}

function playTrack(src) {
  unlockAudioOnce();

  if (STATE.currentTrack === src) {
    APP.audio.background.pause();
    STATE.currentTrack = null;
    return;
  }

  STATE.currentTrack = src;
  APP.audio.background.src = src;
  APP.audio.background.play().catch(() => {});
}

/* =====================
   Password Logic
   ===================== */
function showError() {
  APP.password.feedback.textContent =
    ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)];

  APP.password.input.value = '';
  APP.password.input.focus();
}

async function unlockExperience() {
  APP.password.feedback.textContent = '';
  setState('unlocked');

  await playTransition('فتاتي مرحباً بكِ…');

  APP.pages.password.remove();
  showPage('main');
  unlockAudioOnce();
}

/* =====================
   Password Protection
   ===================== */
['paste', 'copy', 'cut', 'contextmenu'].forEach(event =>
  APP.password.input.addEventListener(event, e => e.preventDefault())
);

APP.password.input.addEventListener('input', () => {
  APP.password.input.type = 'password';
});

/* =====================
   Events – Password
   ===================== */
APP.password.button.addEventListener('click', () => {
  unlockAudioOnce();

  if (APP.password.input.value === CONFIG.PASSWORD) {
    unlockExperience();
  } else {
    showError();
  }
});

APP.password.input.addEventListener('keydown', e => {
  if (e.key === 'Enter') APP.password.button.click();
});

/* =====================
   Music Buttons
   ===================== */
APP.audio.buttons.forEach(button => {
  button.addEventListener('click', () => {
    playTrack(button.dataset.audioSrc);
  });
});

/* =====================
   Navigation
   ===================== */
APP.navigation.toMessages.addEventListener('click', async () => {
  setState('messages');

  await playTransition('إلى قلبك…');

  showPage('messages');
  revealMessages();
});

/* =====================
   Messages Animation
   ===================== */
function revealMessages() {
  APP.messages.boxes.forEach((box, index) => {
    box.style.opacity = '0';
    box.style.transform = 'translateY(20px)';

    setTimeout(() => {
      box.style.opacity = '1';
      box.style.transform = 'translateY(0)';
    }, index * CONFIG.MESSAGE_DELAY);
  });
}

/* =====================
   Global Safety Net
   ===================== */
window.addEventListener('error', () => {
  /* intentional silent fail */
});
