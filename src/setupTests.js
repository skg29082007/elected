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
`;

document.body.innerHTML = dom;
window.IntersectionObserver = class {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

beforeAll(() => {
});
