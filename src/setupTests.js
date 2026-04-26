import { beforeAll } from 'vitest';

const dom = `
<nav id="navbar"></nav>
<button id="menuBtn"></button>
<div id="navLinks"></div>
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
`;

document.body.innerHTML = dom;
window.IntersectionObserver = class {
  constructor() {}
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
