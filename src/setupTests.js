import { beforeAll } from 'vitest';

const dom = `
<nav id="navbar"></nav>
<button id="menuBtn"></button>
<div id="navLinks">
  <a href="#hero" class="nav-link">Home</a>
  <a href="#statsGrid" class="nav-link">Stats</a>
</div>
<div id="glossaryGrid"></div>
<input type="text" id="glossarySearch">
<div id="quizBar"></div><div id="quizStep"></div><div id="quizQuestion"></div>
<div id="quizOptions"></div><div id="quizExplanation"></div><button id="quizNextBtn"></button>
<div id="quizState"></div><div id="quizResult"></div><div id="resultEmoji"></div>
<div id="resultText"></div><button id="quizRestartBtn"></button>
<button id="loginBtn"></button>
<div id="chatLog"></div><form id="chatForm"></form>
<input id="chatInput"><button id="sendBtn"></button>
<button class="chip">What is a ballot?</button>
<div class="counter" data-target="100">0</div>
<div class="counter" data-target="50.5">0</div>
<div class="bar-fill" data-width="50"></div>
<button class="filter-btn" data-filter="All">All</button>
<button class="filter-btn" data-filter="Voting">Voting</button>
`;

document.body.innerHTML = dom;
window.IntersectionObservers = [];
window.IntersectionObserver = class {
  constructor(cb) {
    this.cb = cb;
    window.IntersectionObservers.push(cb);
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};
Object.defineProperty(global.navigator, 'serviceWorker', {
  value: {
    register: () => Promise.resolve(),
  },
  configurable: true,
});

beforeAll(() => {
});
