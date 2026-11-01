/* Graceland Financial Solutions — live chat assistant (rule-based, English only). Leads are stored locally; set CHAT_CFG.endpoint to forward them. */
const CHAT_CFG={endpoint:"",wa:"19317032312"};
const TEL='<a href="tel:+19317032312">(931) 703-2312</a>';
const CH={en:{
 title:"Graceland Assistant",status:"Online · replies instantly",ph:"Type your message…",wa:"WhatsApp",call:"Call",
 waMsg:"Hello Graceland Financial Solutions, I would like to learn more about your services.",
 chips:["Our services","Free discovery call","Tax strategies","Estate planning","Contact me"],
 hi:"Hi, I’m the virtual assistant of Graceland Financial Solutions. I can tell you about life insurance, retirement, tax and estate planning, book a free 30-minute discovery call, or take your details so Caroline’s team can contact you. What would you like to know?",
 ask:{name:"Happy to. What is your name?",contact:n=>`Thanks, ${n}. What is the best email or phone number to reach you?`,retry:"I couldn’t read a valid email or phone number. Could you type it again?"},
 saved:n=>`Done${n?", "+n:""}. I saved your details and a Graceland advisor will contact you soon. You can also message us on WhatsApp.`,
 A:{
  greet:"Hello! How can I help you protect your family and plan your future today?",
  name:"I’m the virtual assistant of Graceland Financial Solutions. To speak with a person, use the WhatsApp or Call button below.",
  about:"Graceland Financial Solutions was founded by Caroline I. Paugh. We help families and business owners with life insurance, retirement, tax and estate planning — “a graceful solution to your future.” <a href=\"#/about\">About us</a>.",
  services:"We offer whole life, term life, critical illness, Medicare, tax-free retirement plans, annuities, living benefits, children’s life policies and mortgage protection. <a href=\"#/services\">See all 9 solutions</a>.",
  whole:"Whole life insurance gives lifetime protection and builds cash value you can use in the future. Term life covers a set period at a lower cost — ideal while raising children or paying a mortgage.",
  critical:"Critical illness insurance pays a lump sum if you’re diagnosed with a covered serious illness, so you can focus on recovery. Living benefits let you access part of your life insurance while alive.",
  medicare:"We help seniors compare Medicare coverage to get quality care and reduce out-of-pocket medical costs.",
  retire:"Our tax-free retirement strategies and annuities are designed to protect you from the two biggest retirement costs: inflation and taxes. A steady income for life is possible.",
  tax:"Our Tax Strategies team helps business owners with the Tax Reduction Solution, Capital Gains Planning and Business Growth Planning. <a href=\"#/planning\">Explore tax strategies</a>.",
  estate:"We help you create a revocable living trust, pour-over will, powers of attorney and a living will — attorney-drafted for your state, so your assets bypass probate. <a href=\"#/planning\">Explore estate planning</a>.",
  probate:"Probate can delay and add cost to what your heirs receive. A funded revocable living trust lets assets pass directly to your heirs. A will alone is not enough.",
  mortgage:"Mortgage protection insurance keeps your home safe by covering mortgage payments if you pass away or become critically ill or disabled.",
  kids:"Children’s life policies are affordable, build cash value and secure your child’s insurability for life.",
  hours:"We are open Monday to Friday, 9:00 AM to 6:00 PM Central Time.",
  address:"We’re based in Shelbyville, Tennessee and meet clients by video call, wherever you live.",
  phone:`You can call us at ${TEL}.`,
  email:"Our email is <a href=\"mailto:caroline@gracelandfinancialsolutions.com\">caroline@gracelandfinancialsolutions.com</a>.",
  price:"The 30-minute discovery call is free and without obligation. Costs for each solution depend on your situation and are explained clearly up front.",
  book:"You can pick a day and time in our <a href=\"#/booking\">booking calendar</a> — it takes about a minute.",
  reviews:"Graceland is rated 5.00 from 26 Google reviews and holds an A+ rating with the BBB.",
  resources:"We share free short videos and lessons on life insurance, estate planning and tax-free retirement. <a href=\"#/resources\">Browse resources</a>.",
  wa:"Tap the green WhatsApp button below to message us directly.",
  docs:"Nothing is needed for the first call. If we move forward, we’ll tell you exactly what to gather, such as current policies or tax returns.",
  thanks:"You’re welcome. Anything else I can help with?",bye:"See you soon. We’re here to help.",
  fallback:"I’m not sure I understood. Pick an option below, leave your details, or message us on WhatsApp."}}};
const RULES=[
 [/^\s*(hello|hi|hey|good (morning|afternoon|evening))\b/i,"greet"],
 [/your name|who are you/i,"name"],
 [/contact me|call me|reach me|speak (with|to)|talk to|advisor|caroline|callback|call back/i,"lead"],
 [/about (us|you|graceland)|company|who is graceland|founder/i,"about"],
 [/medicare/i,"medicare"],
 [/critical|illness|living benefit|disab/i,"critical"],
 [/whole|term|life insurance|life policy/i,"whole"],
 [/mortgage|home protect/i,"mortgage"],
 [/child|kid/i,"kids"],
 [/retire|annuit|tax[- ]free|inflation/i,"retire"],
 [/probate|will\b/i,"probate"],
 [/estate|trust|power of attorney|living will|directive/i,"estate"],
 [/tax|irs|capital gain|business/i,"tax"],
 [/service|offer|what do you do|solutions/i,"services"],
 [/hours|open|schedule|when/i,"hours"],
 [/address|location|where|office|tennessee/i,"address"],
 [/phone|number|call/i,"phone"],
 [/e-?mail/i,"email"],
 [/price|cost|how much|fee|free/i,"price"],
 [/book|appointment|discovery|schedule a|meeting/i,"book"],
 [/review|rating|bbb|trust/i,"reviews"],
 [/video|resource|learn|education/i,"resources"],
 [/whatsapp/i,"wa"],
 [/document|bring/i,"docs"],
 [/thank/i,"thanks"],
 [/bye|goodbye/i,"bye"]
];
const CHIP_KEY=["services","book","tax","estate","lead"];
const EMAIL=/[^\s@]+@[^\s@]+\.[^\s@]+/, PHONE=/\+?\d[\d\s().-]{7,}\d/;
const chat={step:null,lead:{},started:false};
const cEl=id=>document.getElementById(id);
const ct=()=>CH[lang];

function addMsg(html,who){
  const m=document.createElement("div");m.className="msg "+who;
  who==="me"?m.textContent=html:m.innerHTML=html;
  cEl("chatLog").appendChild(m);cEl("chatLog").scrollTop=1e5;return m;
}
function botSay(html,delay=650){
  const t=addMsg("<i></i><i></i><i></i>","bot typing");
  return new Promise(res=>setTimeout(()=>{t.remove();addMsg(html,"bot");res()},delay));
}
function saveLead(l){
  const all=JSON.parse(store.get("gfs-leads")||"[]");all.push({...l,lang,at:new Date().toISOString()});
  store.set("gfs-leads",JSON.stringify(all));
  if(CHAT_CFG.endpoint)fetch(CHAT_CFG.endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(l)}).catch(()=>{});
}
async function reply(text){
  const c=ct(),email=(text.match(EMAIL)||[])[0],phone=(text.match(PHONE)||[])[0];
  if(chat.step==="name"){chat.lead.name=text.slice(0,60);chat.step="contact";return botSay(c.ask.contact(chat.lead.name))}
  if(chat.step==="contact"||email||phone){
    if(!email&&!phone)return botSay(c.ask.retry);
    Object.assign(chat.lead,{email,phone});saveLead(chat.lead);const n=chat.lead.name;chat.step=null;chat.lead={};
    return botSay(c.saved(n));
  }
  const hit=RULES.find(r=>r[0].test(text));
  if(hit&&hit[1]==="lead"){chat.step="name";return botSay(c.ask.name)}
  return botSay(hit?c.A[hit[1]]:c.A.fallback);
}
function send(text){
  text=text.trim();if(!text)return;
  addMsg(text,"me");reply(text);
}
function drawChips(){
  cEl("chatChips").innerHTML=ct().chips.map((x,i)=>`<button data-k="${i}">${x}</button>`).join("");
}
function applyChatLang(){
  const c=ct();
  document.querySelectorAll("[data-c]").forEach(e=>e.textContent=c[e.dataset.c]);
  cEl("chatIn").placeholder=c.ph;
  cEl("chatWa").href=`https://wa.me/${CHAT_CFG.wa}?text=${encodeURIComponent(c.waMsg)}`;
  drawChips();
}
function toggleChat(open){
  const p=cEl("chat");p.classList.toggle("open",open);p.setAttribute("aria-hidden",!open);
  cEl("chatBtn").setAttribute("aria-expanded",open);
  if(open&&!chat.started){chat.started=true;botSay(ct().hi,500)}
  if(open)setTimeout(()=>cEl("chatIn").focus(),300);
}
cEl("chatBtn").onclick=()=>toggleChat(!cEl("chat").classList.contains("open"));
cEl("chatX").onclick=()=>toggleChat(false);
addEventListener("keydown",e=>{if(e.key==="Escape")toggleChat(false)});
cEl("chatForm").onsubmit=e=>{e.preventDefault();const i=cEl("chatIn");send(i.value);i.value=""};
cEl("chatChips").onclick=e=>{
  const b=e.target.closest("button");if(!b)return;
  const k=CHIP_KEY[+b.dataset.k];addMsg(b.textContent,"me");
  if(k==="lead"){chat.step="name";botSay(ct().ask.name)}else botSay(ct().A[k]);
};
document.querySelectorAll("[data-lang]").forEach(b=>b.addEventListener("click",applyChatLang));
applyChatLang();
