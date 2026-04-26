/**
 * @fileoverview Main application logic for ElectEd
 * Provides interactive features such as the AI Assistant, Glossary, and Quiz.
 */
import './styles.css';
import { auth, db } from './firebase.js';
import { doc, getDocFromServer, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

const provider = new GoogleAuthProvider();

export function signInWithGoogle() {
  signInWithPopup(auth, provider).catch((error) => {
    console.error('Error signing in with Google:', error);
  });
}

onAuthStateChanged(auth, (user) => {
  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    if (user) {
      loginBtn.textContent = 'Signed in as ' + (user.displayName || 'User');
      loginBtn.disabled = true;
    } else {
      loginBtn.textContent = 'Sign In with Google to Save Scores';
      loginBtn.disabled = false;
      loginBtn.onclick = signInWithGoogle;
    }
  }
});

const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write',
};

function handleFirestoreError(error, operationType, path) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

import { GoogleGenAI } from "@google/genai";
const GEMINI_KEY = (import.meta && import.meta.env ? import.meta.env.VITE_GEMINI_API_KEY : '') || ''; 

const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });
export const glossaryData=["Absentee Ballot-Voting-A vote cast by mail when a voter cannot attend in person.","Ballot-Voting-The method by which voters record their choices in an election.","Candidate-People-A person who seeks election to a public office.","Canvass-Counting-Official review and tabulation of all votes after an election.","Caucus-Process-A party meeting to select candidates or decide policy positions.","Certification-Process-Formal legal confirmation of election results by authorities.","Constituency-Structure-The body of voters represented by a particular elected official.","Electoral College-Structure-Body of electors who formally elect the US President and VP.","Exit Poll-Stats-Survey of voters right after voting, used to forecast results.","Franchise-Rights-The legal right to vote in public elections; also called suffrage.","Gerrymandering-Politics-Manipulating district boundaries to advantage one political party.","Incumbent-People-The current officeholder running for re-election.","Polling Place-Voting-Official location where voters cast ballots on Election Day.","Precinct-Structure-A geographic subdivision used for electoral administration.","Primary Election-Process-An intra-party election to choose a party nominee.","Proportional Representation-Systems-Seats allocated based on each party's vote share.","Recount-Counting-Re-tabulation of votes when the margin is very slim.","Runoff Election-Process-Follow-up election when no candidate wins required majority.","Suffrage-Rights-The right to vote in political elections.","Voter Registration-Voting-Signing up on the official voter list before voting.","Voter Turnout-Stats-Percentage of eligible voters who actually cast a ballot.","Write-in Candidate-Voting-A candidate not on ballot whose name voters write manually."];
export const quizData=[{q:"What is the primary purpose of a primary election?",opts:["To elect the President directly","To choose a political party's nominee","To certify final election results","To recall an incumbent"],ans:1,exp:"Primaries narrow down the field of candidates within a party before the general election."},{q:"Which term refers to the official review of all votes cast?",opts:["Certification","Caucus","Canvass","Gerrymandering"],ans:2,exp:"A canvass is the formal, official tally and review of votes to ensure accuracy."},{q:"What must a citizen generally do before they are allowed to vote?",opts:["Join a political party","Register to vote","Pass a civics test","Pay a poll tax"],ans:1,exp:"Voter registration is required in most jurisdictions."},{q:"An 'incumbent' is:",opts:["A newly registered voter","An official election observer","The current officeholder running again","A candidate running third-party"],ans:2,exp:"Incumbents are candidates who already hold the office."},{q:"What is suffrage?",opts:["The legal right to vote","The suffering caused by long ballot lines","A type of voting machine","A tax levied on voters"],ans:0,exp:"Suffrage means the right to vote."},{q:"In an electoral system, a 'precinct' is:",opts:["A state boundary","A geographic subdivision for administration","A political party headquarters","A legislative body"],ans:1,exp:"Precincts are local voting districts."},{q:"If no candidate wins a required majority, what usually happens?",opts:["The election is canceled","A Runoff Election is held","The incumbent automatically stays","A coin toss decides"],ans:1,exp:"Runoff elections are held between top candidates."},{q:"What is an absentee ballot?",opts:["A ballot that is thrown out","A vote cast by mail","A vote for an independent candidate","A ballot with missing signatures"],ans:1,exp:"Absentee voting allows voters who cannot vote in person to participate."},{q:"Which practice manipulates district boundaries for political advantage?",opts:["Canvassing","Filibustering","Gerrymandering","Lobbying"],ans:2,exp:"Gerrymandering draws district lines to favor one party over another."},{q:"What signifies the formal end of the election process?",opts:["The debate phase","Election Day closing","Certification","Exit polling"],ans:2,exp:"Certification is the legal confirmation of the final results."}];
export const filterGlossary = (data, filter, search) => {
  const termStr = search.toLowerCase();
  return data.filter(item => {
    const [term, cat, def] = item.split('-');
    const matchesFilter = filter === 'All' || cat === filter;
    const matchesSearch = term.toLowerCase().includes(termStr) || def.toLowerCase().includes(termStr);
    return matchesFilter && matchesSearch;
  });
};
const navbar=document.getElementById('navbar');
const menuBtn=document.getElementById('menuBtn');
const navLinks=document.getElementById('navLinks');
const navItems=document.querySelectorAll('.nav-link');
const handleScroll=()=>{ if(window.scrollY>50)navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled'); };
const toggleMenu=()=>{ const isOpen=navLinks?.classList.toggle('open'); if (menuBtn) { menuBtn.setAttribute('aria-expanded',isOpen); menuBtn.textContent=isOpen?'✕':'☰'; }};
window.addEventListener('scroll',handleScroll); menuBtn?.addEventListener('click',toggleMenu);
navItems.forEach(link=>{ link.addEventListener('click',()=>{ if(window.innerWidth<=768)toggleMenu(); }); });
const obsOpts={root:null,rootMargin:'0px',threshold:0.15};
const scrollObs=new IntersectionObserver((entries)=>{ entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); if(e.target.id==='statsGrid')triggerCounters(); if(e.target.classList.contains('charts-container'))triggerBars(); }}); },obsOpts);
document.querySelectorAll('.animate-up').forEach(el=>scrollObs.observe(el));
const spyObs=new IntersectionObserver((entries)=>{ entries.forEach(e=>{ if(e.isIntersecting){ navItems.forEach(link=>{ link.classList.remove('active'); if(link.getAttribute('href').substring(1)===e.target.id)link.classList.add('active'); }); }}); },{threshold:0.5});
document.querySelectorAll('section').forEach(sec=>spyObs.observe(sec));
const glossaryGrid=document.getElementById('glossaryGrid');
const glossarySearch=document.getElementById('glossarySearch');
const glossaryFilters=document.querySelectorAll('.filter-btn');
let currentFilter='All';
const renderGlossary=(filter,search)=>{ glossaryGrid.innerHTML=''; const termStr=search.toLowerCase(); const filtered=glossaryData.filter(item=>{ const[term,cat,def]=item.split('-'); const matchesFilter=filter==='All'||cat===filter; const matchesSearch=term.toLowerCase().includes(termStr)||def.toLowerCase().includes(termStr); return matchesFilter&&matchesSearch; });
if(filtered.length===0){ glossaryGrid.innerHTML='<p class="muted" style="grid-column:1/-1;text-align:center;">No terms found.</p>'; return; }
filtered.forEach(item=>{ const[term,cat,def]=item.split('-'); const card=document.createElement('div'); card.className='term-card'; card.innerHTML=`<div class="term-header"><span class="term-title"></span><span class="term-cat"></span></div><div class="term-def"></div>`; card.querySelector('.term-title').textContent=term; card.querySelector('.term-cat').textContent=cat; card.querySelector('.term-def').textContent=def; glossaryGrid.appendChild(card); }); };
glossaryFilters.forEach(btn=>{ btn.addEventListener('click',(e)=>{ glossaryFilters.forEach(b=>b.classList.remove('active')); e.target.classList.add('active'); currentFilter=e.target.dataset.filter; renderGlossary(currentFilter,glossarySearch.value); }); });
glossarySearch.addEventListener('input',(e)=>renderGlossary(currentFilter,e.target.value)); renderGlossary('All','');
let currentQ=0,score=0,answered=false;
const qBar=document.getElementById('quizBar'),qStep=document.getElementById('quizStep'),qTitle=document.getElementById('quizQuestion'),qOptions=document.getElementById('quizOptions'),qExp=document.getElementById('quizExplanation'),qNextBtn=document.getElementById('quizNextBtn'),qState=document.getElementById('quizState'),qResult=document.getElementById('quizResult');
const renderQuestion=()=>{ answered=false; const q=quizData[currentQ]; qStep.textContent=`Question ${currentQ+1} of ${quizData.length}`; qBar.style.width=`${(currentQ/quizData.length)*100}%`; qTitle.textContent=q.q; qOptions.innerHTML=''; qExp.style.display='none'; qNextBtn.style.display='none'; q.opts.forEach((optText,index)=>{ const btn=document.createElement('button'); btn.className='quiz-option'; btn.textContent=optText; btn.onclick=()=>handleAnswer(index,btn); qOptions.appendChild(btn); }); };
const handleAnswer=(index,btn)=>{ if(answered)return; answered=true; const q=quizData[currentQ]; const buttons=qOptions.querySelectorAll('button'); buttons.forEach(b=>b.disabled=true); if(index===q.ans){ btn.classList.add('correct'); score++; }else{ btn.classList.add('wrong'); buttons[q.ans].classList.add('correct'); } qExp.textContent=q.exp; qExp.style.display='block'; qNextBtn.textContent=currentQ===quizData.length-1?'Show Results':'Next Question →'; qNextBtn.style.display='block'; };
if (qNextBtn) {
  qNextBtn.addEventListener('click',()=>{ currentQ++; if(currentQ<quizData.length)renderQuestion(); else showResults(); });
}
const showResults=async()=>{ 
  qState.style.display='none'; 
  qResult.style.display='block'; 
  const pct=score/quizData.length; 
  const emoji=document.getElementById('resultEmoji'); 
  const rText=document.getElementById('resultText'); 
  if(pct===1)emoji.textContent='🌟'; else if(pct>=0.7)emoji.textContent='👏'; else emoji.textContent='📚'; 
  rText.textContent=`You scored ${score} out of ${quizData.length}.`; 
  
  if (auth.currentUser) {
    try {
      const resultsRef = collection(db, 'quiz_results');
      await addDoc(resultsRef, {
        userId: auth.currentUser.uid,
        score: score,
        total: quizData.length,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'quiz_results');
    }
  }
};
if (document.getElementById('quizRestartBtn')) {
  document.getElementById('quizRestartBtn').addEventListener('click',()=>{ currentQ=0; score=0; qState.style.display='block'; qResult.style.display='none'; renderQuestion(); }); renderQuestion();
}
let countersTriggered=false;
const triggerCounters=()=>{ if(countersTriggered)return; countersTriggered=true; document.querySelectorAll('.counter').forEach(counter=>{ const target=parseFloat(counter.getAttribute('data-target')); const duration=2000,stepTime=20; const steps=duration/stepTime,inc=target/steps; let current=0; const timer=setInterval(()=>{ current+=inc; if(current>=target){ current=target; clearInterval(timer); } counter.textContent=Number.isInteger(target)?Math.floor(current):current.toFixed(1); },stepTime); }); };
let barsTriggered=false;
const triggerBars=()=>{ if(barsTriggered)return; barsTriggered=true; document.querySelectorAll('.bar-fill').forEach(bar=>{ const w=bar.getAttribute('data-width'); setTimeout(()=>{ bar.style.width=w+'%'; },200); }); };
const chatLog=document.getElementById('chatLog'),chatForm=document.getElementById('chatForm'),chatInput=document.getElementById('chatInput'),sendBtn=document.getElementById('sendBtn'),quickPrompts=document.querySelectorAll('.chip');
const systemPrompt="You are ElectEd, a friendly nonpartisan election education assistant. Explain concepts simply in 3-5 sentences. Never express political opinions.";
const appendMessage=(role,text)=>{ const div=document.createElement('div'); div.className=`chat-msg ${role==='user'?'msg-user':'msg-bot'}`; div.textContent=text; chatLog.appendChild(div); chatLog.scrollTop=chatLog.scrollHeight; };
const showLoading=()=>{ const div=document.createElement('div'); div.className='chat-msg msg-bot typing-indicator'; div.innerHTML=`<div class="typing-dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`; chatLog.appendChild(div); chatLog.scrollTop=chatLog.scrollHeight; return div; };
let chatInstance = null;
const callGemini=async(userText)=>{ if(!GEMINI_KEY||GEMINI_KEY==="YOUR_GEMINI_API_KEY")return "Note: Please configure your GEMINI_KEY in the script to enable AI responses.";
  try {
    if (!chatInstance) {
      chatInstance = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: systemPrompt,
        }
      });
    }
    const response = await chatInstance.sendMessage({ message: userText });
    return response.text;
  } catch(err) {
    console.error(err); return "I'm sorry, I'm having trouble connecting right now. Please try again later.";
  }
};
const handleSend=async(text)=>{ if(!text.trim())return; chatInput.value=''; chatInput.disabled=true; sendBtn.disabled=true; appendMessage('user',text); const loader=showLoading(); const reply=await callGemini(text); loader.remove(); appendMessage('bot',reply); chatInput.disabled=false; sendBtn.disabled=false; chatInput.focus(); };
if (chatForm) {
  chatForm.addEventListener('submit',(e)=>{ e.preventDefault(); handleSend(chatInput.value.trim().substring(0,500)); });
}
quickPrompts.forEach(chip=>{ chip.addEventListener('click',()=>handleSend(chip.textContent)); });
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

