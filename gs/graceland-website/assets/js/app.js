/* Graceland Financial Solutions — main application logic */
const IMG={logo:"assets/img/logo.png",portrait:"assets/img/couple.jpg",couple:"assets/img/couple.jpg",team:"assets/img/team.jpg",advisors:"assets/img/advisors.jpg",fam:"assets/img/hero-family.jpg",sun:"assets/img/hero-sunset.jpg",hike:"assets/img/hero-hike.jpg",hero:["assets/img/hero-family.jpg","assets/img/hero-sunset.jpg","assets/img/hero-hike.jpg"],footer:"assets/img/hero-hike.jpg"};
const ROUTES=["home","about","services","planning","resources","booking","contact"];
const NAV={home:"nav_home",about:"nav_about",services:"nav_services",planning:"nav_planning",resources:"nav_resources",booking:"nav_booking",contact:"nav_contact"};
const ic=n=>`<svg class="ic"><use href="#i-${n}"/></svg>`;
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const store={get:k=>{try{return localStorage.getItem(k)}catch{return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch{}}};
let lang="en";
const T=k=>C[lang][k];

/* ===== Render ===== */
function render(){
  document.documentElement.lang=lang;
  $$("[data-t]").forEach(e=>e.textContent=T(e.dataset.t));
  $$("[data-ph]").forEach(e=>e.placeholder=T(e.dataset.ph));
  $$("[data-lang]").forEach(b=>b.classList.toggle("on",b.dataset.lang===lang));
  $("#nav").innerHTML=ROUTES.filter(r=>r!=="booking").map(r=>`<a href="#/${r}" data-r="${r}">${T(NAV[r])}</a>`).join("");
  $("#ftNav").innerHTML=ROUTES.map(r=>`<li><a href="#/${r}">${T(NAV[r])}</a></li>`).join("");
  $("#ftSvc").innerHTML=T("svc").slice(0,6).map(s=>`<li><a href="#/services">${s[1]}</a></li>`).join("");
  $("#stats").innerHTML=T("stats").map(s=>typeof s[0]==="number"?`<div><b data-n="${s[0]}" data-pre="${s[1]}" data-suf="${s[2]}">${s[1]}0${s[2]}</b><span>${s[3]}</span></div>`:`<div><b>${s[0]}</b><span>${s[3]}</span></div>`).join("");countUp();
  $("#svcGrid").innerHTML=T("svc").slice(0,6).map((s,i)=>`<article class="card"><span class="num">0${i+1}</span>${ic(s[0])}<h3>${s[1]}</h3><p>${s[2]}</p><a class="more" href="#/services">${T("more")}${ic("arrow")}</a></article>`).join("");
  const vals=T("vals").map(v=>`<li>${ic("check")}<span>${v}</span></li>`).join("");
  $("#vals").innerHTML=vals;$("#vals2").innerHTML=vals;
  $("#steps").innerHTML=T("steps").map(s=>`<div class="step"><h3>${s[0]}</h3><p>${s[1]}</p></div>`).join("");
  $("#svcList").innerHTML=T("svc").map(s=>`<div class="svc"><div>${ic(s[0]).replace('class="ic"','class="ic" style="width:42px;height:42px;color:var(--blue)"')}<h2 style="margin-top:14px">${s[1]}</h2></div><div><p class="lead" style="margin:0">${s[2]}</p><ul>${s[3].map(b=>`<li>${ic("check")}${b}</li>`).join("")}</ul><a class="btn" style="margin-top:24px" href="#/booking"><span>${T("book")}</span></a></div></div>`).join("");
  $("#faq").innerHTML=T("faq").map(f=>`<details><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join("");
    $("#cinfo").innerHTML=[["phone","cTel",`<a href="tel:+19317032312">(931) 703-2312</a>`],["mail","cMail",`<a href="mailto:caroline@gracelandfinancialsolutions.com">caroline@gracelandfinancialsolutions.com</a>`],["pin","cAddr",T("addr")],["clock","cHrs",T("hrsV")],["wa","WhatsApp",`<a href="https://wa.me/19317032312" target="_blank" rel="noopener">+1 (931) 703-2312</a>`]].map(c=>`<div class="card cc">${ic(c[0])}<div><h3>${T(c[1])||c[1]}</h3><p style="margin:2px 0 0">${c[2]}</p></div></div>`).join("");
  const stars="★★★★★";
  const cards=C[lang].rev.map((t,i)=>`<button class="rc" data-i="${i}"><div class="stars"><span>★★★★★</span><b>G</b></div><p>${t}</p><div class="who"><span class="av">${REVIEWERS[i][0][0]}</span><span>${REVIEWERS[i][0]}<small>${REVIEWERS[i][1]}</small></span></div></button>`).join("");
  $("#track").innerHTML=cards+cards;
  renderExtra();
  renderCal();
}

/* ===== Router ===== */
function route(){
  const r=(location.hash.replace("#/","")||"home");
  const id=ROUTES.includes(r)?r:"home";
  $$(".page").forEach(p=>p.classList.toggle("on",p.dataset.page===id));
  $$(".nav a").forEach(a=>a.classList.toggle("on",a.dataset.r===id));
  $("#nav").classList.remove("open");
  window.scrollTo({top:0,behavior:"instant"});
}
addEventListener("hashchange",route);

/* ===== Theme + language + menu ===== */
const setTheme=t=>{document.documentElement.dataset.theme=t;store.set("gfs-theme",t)};
setTheme(store.get("gfs-theme")||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"));
$("#theme").onclick=()=>setTheme(document.documentElement.dataset.theme==="dark"?"light":"dark");
$$("[data-lang]").forEach(b=>b.onclick=()=>{lang=b.dataset.lang;store.set("gfs-lang",lang);render();route();});
$("#burger").onclick=()=>$("#nav").classList.toggle("open");

/* ===== Hero slider ===== */
(function(){
  const box=$("#slides"),dots=$("#dots");let i=0,timer;
  IMG.hero.forEach((src,n)=>{box.insertAdjacentHTML("beforeend",`<div style="background-image:url(${src})"></div>`);dots.insertAdjacentHTML("beforeend",`<button aria-label="Slide ${n+1}"></button>`)});
  const go=n=>{i=n;$$("div",box).forEach((d,k)=>{d.classList.remove("on");if(k===n){void d.offsetWidth;d.classList.add("on")}});$$("button",dots).forEach((d,k)=>d.classList.toggle("on",k===n))};
  const loop=()=>{clearInterval(timer);timer=setInterval(()=>go((i+1)%IMG.hero.length),5500)};
  $$("button",dots).forEach((d,k)=>d.onclick=()=>{go(k);loop()});
  go(0);loop();
})();

/* ===== Reviews modal ===== */
const modal=$("#modal");
$("#track").addEventListener("click",e=>{
  const c=e.target.closest(".rc");if(!c)return;
  const i=+c.dataset.i;
  $("#mbox").innerHTML=`<div class="av">${REVIEWERS[i][0][0]}</div><h3>${REVIEWERS[i][0]}</h3><small style="color:var(--muted)">${REVIEWERS[i][1]}</small><div class="stars">★★★★★</div><p>${C[lang].rev[i]}</p><button class="btn" id="mclose"><span>OK</span></button>`;
  modal.classList.add("open");
});
modal.addEventListener("click",e=>{if(e.target===modal||e.target.closest("#mclose"))modal.classList.remove("open")});
addEventListener("keydown",e=>{if(e.key==="Escape")modal.classList.remove("open")});

/* ===== Booking calendar (demo) ===== */
const MIA="America/Chicago";
const BTZ=(()=>{try{return Intl.DateTimeFormat().resolvedOptions().timeZone}catch{return MIA}})();
const cal={y:0,m:0,sel:null,time:null,h24:false,tz:BTZ};
(function(){const n=new Date();cal.y=n.getFullYear();cal.m=n.getMonth()})();
const today=()=>{const d=new Date();d.setHours(0,0,0,0);return d};
const SLOTS=(()=>{const a=[];for(let m=9*60;m<18*60;m+=30)a.push(m);return a})();
/* Time zones: office slots are defined in Central Time (CT) and converted for display. */
const tzList=()=>{try{const l=Intl.supportedValuesOf("timeZone");return l.includes(BTZ)?l:[BTZ,...l]}catch{return[MIA,BTZ]}};
const offMin=(tz,ms)=>{const o={};new Intl.DateTimeFormat("en-US",{timeZone:tz,hourCycle:"h23",year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"numeric"}).formatToParts(ms).forEach(p=>o[p.type]=+p.value);return(Date.UTC(o.year,o.month-1,o.day,o.hour,o.minute)-Math.floor(ms/6e4)*6e4)/6e4};
const slotUtc=(d,m)=>{const g=Date.UTC(d.getFullYear(),d.getMonth(),d.getDate(),0,m);let u=g-offMin(MIA,g)*6e4;u=g-offMin(MIA,u)*6e4;return u};
const tf=(u,o)=>new Intl.DateTimeFormat(lang,{timeZone:cal.tz,...o}).format(u);
const tOpts=()=>cal.h24?{hour:"2-digit",minute:"2-digit",hourCycle:"h23"}:{hour:"numeric",minute:"2-digit",hour12:true};
const fmtSlot=m=>{const u=slotUtc(cal.sel,m),w=new Date(u+offMin(cal.tz,u)*6e4);const dd=Math.round((Date.UTC(w.getUTCFullYear(),w.getUTCMonth(),w.getUTCDate())-Date.UTC(cal.sel.getFullYear(),cal.sel.getMonth(),cal.sel.getDate()))/864e5);return tf(u,tOpts())+(dd?` <sup>${dd>0?"+":""}${dd}d</sup>`:"")};
const past=m=>slotUtc(cal.sel,m)<Date.now();
const taken=(d,m)=>((d.getDate()*7+m/30*13)%5)===0; /* deterministic fake availability */
function renderCal(){
  const first=new Date(cal.y,cal.m,1),days=new Date(cal.y,cal.m+1,0).getDate();
  const offset=(first.getDay()+6)%7, t=today();
  const month=first.toLocaleDateString(lang,{month:"long",year:"numeric"});
  const wk=[...Array(7)].map((_,i)=>new Date(2024,0,1+i).toLocaleDateString(lang,{weekday:"short"}));
  let cells=wk.map(w=>`<div class="dw">${w}</div>`).join("")+"<span></span>".repeat(offset);
  for(let d=1;d<=days;d++){
    const dt=new Date(cal.y,cal.m,d),wkd=dt.getDay(),off=dt<t||wkd===0||wkd===6;
    const cls=[cal.sel&&+cal.sel===+dt?"sel":"",+dt===+t?"today":""].join(" ");
    cells+=`<button class="${cls}" data-d="${d}" ${off?"disabled":""}>${d}</button>`;
  }
  const prevOff=cal.y===t.getFullYear()&&cal.m<=t.getMonth();
  let slots=`<p class="empty">${T("noSlots")}</p>`;
  if(cal.sel){
    slots=`<div class="sl">${SLOTS.map(m=>`<button data-m="${m}" class="${cal.time===m?"sel":""}" ${taken(cal.sel,m)||past(m)?"disabled":""}>${fmtSlot(m)}</button>`).join("")}</div>`;
  }
  const head=cal.sel?cal.sel.toLocaleDateString(lang,{weekday:"short",day:"numeric",month:"short"}):T("pick");
  $("#cal").innerHTML=`
   <div class="cal-info"><img data-img="portrait" alt=""><small style="opacity:.7">Graceland Financial Solutions</small><h3 style="margin-top:6px">${T("mTitle")}</h3>
     <ul><li>${ic("clock")}30 min</li><li>${ic("video")}${T("mWith")}</li><li>${ic("pin")}<select id="tz" aria-label="Time zone">${tzList().map(z=>`<option value="${z}" ${z===cal.tz?"selected":""}>${z.replace(/_/g," ")}</option>`).join("")}</select></li></ul><p class="tzn">${T("mTz")}</p></div>
   <div><div class="cm"><b>${month}</b><span><button id="cp" aria-label="Prev" ${prevOff?"disabled":""}>${ic("prev")}</button> <button id="cn" aria-label="Next">${ic("next")}</button></span></div><div class="cg">${cells}</div></div>
   <div class="slots"><h4><span>${head}</span><span class="fmt"><button data-f="12" class="${cal.h24?"":"on"}">12h</button><button data-f="24" class="${cal.h24?"on":""}">24h</button></span></h4>${slots}</div>`;
  $$("#cal [data-img]").forEach(i=>i.src=IMG[i.dataset.img]);
}
$("#cal").addEventListener("click",e=>{
  const b=e.target.closest("button");if(!b)return;
  if(b.id==="cp"||b.id==="cn"){cal.m+=b.id==="cn"?1:-1;if(cal.m>11){cal.m=0;cal.y++}if(cal.m<0){cal.m=11;cal.y--}}
  else if(b.dataset.d){cal.sel=new Date(cal.y,cal.m,+b.dataset.d);cal.time=null;$("#book").classList.remove("show")}
  else if(b.dataset.m){cal.time=+b.dataset.m;showBook()}
  else if(b.dataset.f){cal.h24=b.dataset.f==="24"}
  renderCal();
});
$("#cal").addEventListener("change",e=>{if(e.target.id!=="tz")return;cal.tz=e.target.value;cal.time=null;$("#book").classList.remove("show");renderCal()});
function showBook(){
  const box=$("#book"),u=slotUtc(cal.sel,cal.time),when=`${tf(u,{weekday:"long",day:"numeric",month:"long"})} · ${tf(u,tOpts())} (${cal.tz.replace(/_/g," ")})`;
  box.innerHTML=`<h3>${T("yourData")}</h3><p class="lead" style="margin-bottom:20px">${when}</p>
   <form class="frm" id="bform"><input required data-ph="fName" placeholder="${T("fName")}"><input required type="email" placeholder="${T("fEmail")}">
   <select class="full" aria-label="${T("service")}">${T("svc").map(s=>`<option>${s[1]}</option>`).join("")}</select>
   <button class="btn full" style="justify-content:center"><span>${T("confirm")}</span></button></form>`;
  box.classList.add("show");box.scrollIntoView({behavior:"smooth",block:"center"});
  $("#bform").onsubmit=e=>{e.preventDefault();box.innerHTML=`<div class="ok">${ic("check")}<h3>${T("done")}</h3><p class="lead" style="margin-inline:auto">${when}<br>${T("doneP")}</p></div>`};
}

/* ===== Contact form (opens mail client; swap for backend/endpoint in production) ===== */
$("#cform").onsubmit=e=>{
  e.preventDefault();const f=new FormData(e.target);
  location.href=`mailto:caroline@gracelandfinancialsolutions.com?subject=${encodeURIComponent("Web · "+f.get("n"))}&body=${encodeURIComponent(f.get("m")+"\n\n"+f.get("p")+"\n"+f.get("e"))}`;
  e.target.reset();alert(T("sent"));
};

/* ===== Animated counters ===== */
function countUp(){
  const els=$$("[data-n]");if(!els.length)return;
  const reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
  const run=el=>{
    const n=+el.dataset.n,{pre,suf}=el.dataset,dur=n<=10?n*450:2800,t0=performance.now();
    if(reduce){el.textContent=pre+n+suf;return}
    const tick=now=>{const p=Math.min((now-t0)/dur,1),e=n<=10?p:1-Math.pow(1-p,2.2);el.textContent=pre+Math.round(n*e)+suf;if(p<1)requestAnimationFrame(tick)};
    requestAnimationFrame(tick);
  };
  const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){io.unobserve(x.target);run(x.target)}}),{threshold:.6});
  els.forEach(e=>io.observe(e));
}

/* ===== Extra demo sections ===== */
function renderExtra(){
  $("#probs").innerHTML=T("probs").map(p=>`<li>${ic("check")}<span>${p}</span></li>`).join("");
  const acc=l=>l.map((x,i)=>`<details ${i?"":"open"}><summary>${x[0]}</summary>${x[1].map(p=>`<p>${p}</p>`).join("")}${x[2]?`<p><a href="${x[2]}" target="_blank" rel="noopener">Watch the short video →</a></p>`:""}</details>`).join("");
  $("#taxList").innerHTML=acc(T("tax"));$("#estList").innerHTML=acc(T("est"));
  $("#res").innerHTML=T("res").map(r=>`<article class="card res"><img src="${IMG[r[0]]}" alt="" loading="lazy"><div><small>${r[1]}</small><h3 style="margin-top:6px">${r[2]}</h3><p>${r[3]}</p><a class="more" href="${r[4]}" target="_blank" rel="noopener">Watch the video${ic("arrow")}</a></div></article>`).join("");
  $("#wwa").innerHTML=T("wwa").map(w=>`<article class="card wwa"><img src="${IMG[w[0]]}" alt="" loading="lazy"><div><h3>${w[1]}</h3><p style="margin-bottom:0">${w[2]}</p></div></article>`).join("");
  $("#why").innerHTML=T("why").map(w=>`<article class="card">${ic(w[0])}<h3>${w[1]}</h3><p style="margin-bottom:0">${w[2]}</p></article>`).join("");
  $("#tips").innerHTML=T("tips").map(a=>`<article class="card tip"><small>${a[0]} · ${a[3]}</small><h3>${a[1]}</h3><p>${a[2]}</p><a class="more" href="#/booking">${T("book")}${ic("arrow")}</a></article>`).join("");
  $("#faq3").innerHTML=T("faq").map(f=>`<details><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join("");
  $("#wwa2").innerHTML=$("#wwa").innerHTML;
  $("#mv").innerHTML=T("mv").map(w=>`<article class="card">${ic(w[0])}<h3>${w[1]}</h3><p style="margin-bottom:0">${w[2]}</p></article>`).join("");
  $("#tl").innerHTML=T("tl").map(w=>`<div><b>${w[0]}</b><h3 style="font-size:1.1rem">${w[1]}</h3><p style="color:var(--muted)">${w[2]}</p></div>`).join("");
  $("#perks").innerHTML=T("perks").map(v=>`<li>${ic("check")}<span>${v}</span></li>`).join("");
  $("#faq2").innerHTML=T("faq").map(f=>`<details><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join("");
}
$("#nl").onsubmit=e=>{e.preventDefault();e.target.innerHTML=`<p>${T("nlDone")}</p>`};

/* ===== Init ===== */
$$("[data-img]").forEach(i=>i.src=IMG[i.dataset.img]);
$("#ftr").style.backgroundImage=`url(${IMG.footer})`;
render();route();

/* ===== Tabs, sticky header state, back-to-top ===== */
document.addEventListener("click",e=>{const b=e.target.closest("[data-tab]");if(!b)return;$$("[data-tab]").forEach(x=>x.classList.toggle("on",x===b));$$(".tabpane").forEach(p=>p.classList.toggle("on",p.id===b.dataset.tab))});
addEventListener("scroll",()=>{$(".hdr").classList.toggle("sc",scrollY>40);$("#up").classList.toggle("on",scrollY>700)},{passive:true});
$("#up").onclick=()=>scrollTo({top:0,behavior:"smooth"});
