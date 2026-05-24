/* =========================================================
   TYPES 數位消費人格測驗 v2 — MarTech 智慧型 CRM 閉環
   新增:KNN/決策樹模擬、AdWords ROAS、決策矩陣、社群擴散監測、AI Chatbot
========================================================= */

// ---------- 資料 ----------
const QUESTIONS = [
  { context:"📱 情境一・早晨 08:30 通勤路上",
    question:"在擁擠的捷運上滑 IG,突然跳出一則限時動態廣告,你的大腦第一反應是?",
    options:[
      {text:"立刻被視覺生火,點進連結看看有沒有「限時折扣」!",type:"impulse"},
      {text:"迅速滑過,我只相信自己主動搜尋的資訊,對廣告免疫。",type:"rational"},
      {text:"發現是喜歡的 KOL 推薦,馬上轉發到好姐妹群組討論。",type:"social"},
      {text:"留意到品牌的包裝很環保,點進去看看他們的品牌故事。",type:"loyal"} ]},
  { context:"☕️ 情境二・上午 11:00 辦公室茶水間",
    question:"同事端著一個超有質感的保溫杯走進來,你被吸引了,會怎麼做?",
    options:[
      {text:"腦波一弱直接問在哪買,可能下午就跟著衝動下單。",type:"impulse"},
      {text:"默默記下型號,晚點去 PTT/Dcard 查實測評價與比價。",type:"rational"},
      {text:"稱讚他很有品味!這拿來發辦公室限動一定很好看。",type:"social"},
      {text:"問他這是不是某個標榜永續、設計師原創的小眾品牌?",type:"loyal"} ]},
  { context:"🎁 情境三・中午 12:30 午休時間",
    question:"朋友下週生日,你正在挑選禮物,會以什麼作為核心準則?",
    options:[
      {text:"感覺對了就買!拆開當下的「驚喜感」最重要。",type:"impulse"},
      {text:"挑選他平常可以用到,實用性極高且保值的好東西。",type:"rational"},
      {text:"買網路上現在討論度最高、最難搶的限量話題商品。",type:"social"},
      {text:"挑選背後有特殊意義,或會將收益捐助公益的品牌。",type:"loyal"} ]},
  { context:"🛒 情境四・晚上 21:00 沙發購物時間",
    question:"準備結帳購物車,發現還差 100 元就能「免運費」,你會?",
    options:[
      {text:"隨便抓個結帳區的小廢物湊滿額,免運就是爽快!",type:"impulse"},
      {text:"冷靜計算運費跟硬湊商品哪個划算,不合理就付運費。",type:"rational"},
      {text:"發動態問有沒有朋友要一起湊單,順便增加互動。",type:"social"},
      {text:"只買我真正需要的,不為了免運去違背自己的理念。",type:"loyal"} ]},
  { context:"📦 情境五・幾天後 收到包裹",
    question:"包裹終於送達了!你拆開包裹後的第一個動作是?",
    options:[
      {text:"迫不及待撕開包裝直接試用,享受多巴胺的瞬間!",type:"impulse"},
      {text:"仔細檢查商品外觀有無瑕疵,確認保固與退換貨標籤。",type:"rational"},
      {text:"先佈置背景,拍一張美美的開箱照上傳並 Tag 品牌。",type:"social"},
      {text:"小心拆解包裝回收,仔細閱讀品牌附贈的手寫感謝卡。",type:"loyal"} ]},
];

const PERSONAS = {
  impulse:{code:"DOPA",ip:"多巴胺浪人",title:"視覺系感性買手",percent:"35%",
    desc:"你的大腦對「限時、限量、高顏值」訊號毫無抵抗力,決策極快,享受多巴胺衝擊。",
    reco:"強調視覺衝擊與設計感的選物",brand:"Pinkoi",link:"https://www.pinkoi.com/",
    avatar:"🏄",grad:"var(--grad-imp)",accent:"var(--impulse)",
    traits:["衝動","視覺先決","限時折扣","高顏值","多巴胺","嘗鮮","感性","快決策"],
    // ML 推估:價格敏感度低、廣告耐受度高(易被打中)、深夜活躍
    ml:{ priceSens:25, adTolerance:85, peakHour:"21:00–23:00", impulseScore:88 } },
  rational:{code:"LOGI",ip:"規格解碼者",title:"人間清醒精算師",percent:"25%",
    desc:"你自帶超強廣告濾鏡,只接收硬核數據、規格表與實測轉換率。",
    reco:"規格透明、性價比極高的實用 3C",brand:"PChome 24h",link:"https://24h.pchome.com.tw/",
    avatar:"🦉",grad:"var(--grad-rat)",accent:"var(--rational)",
    traits:["理性","比價王","重 CP","硬核數據","查評價","保固控","冷靜","高效能"],
    ml:{ priceSens:92, adTolerance:18, peakHour:"12:30–14:00", impulseScore:14 } },
  social:{code:"ECHO",ip:"社群共振儀",title:"口碑傳播節點",percent:"25%",
    desc:"高度依賴 KOL 背書與社群信任機制,是口碑行銷最愛的超級傳播者。",
    reco:"具備社群話題度與打卡潛力的潮流品",brand:"CASETiFY",link:"https://www.casetify.com/",
    avatar:"🦄",grad:"var(--grad-soc)",accent:"var(--social)",
    traits:["KOL","話題度","打卡控","高分享","限動","群組討論","潮流","外向"],
    ml:{ priceSens:55, adTolerance:65, peakHour:"19:00–22:00", impulseScore:62 } },
  loyal:{code:"ROOT",ip:"價值守護者",title:"品牌靈魂信徒",percent:"15%",
    desc:"極度看重品牌 ESG 永續理念,一旦共鳴將成為最忠誠的鐵粉。",
    reco:"具備透明供應鏈與環保理念的純淨保養",brand:"綠藤生機",link:"https://www.greenvines.com.tw/",
    avatar:"🕊️",grad:"var(--grad-loy)",accent:"var(--loyal)",
    traits:["永續","ESG","品牌故事","忠誠","理念派","深思","信徒","高黏著"],
    ml:{ priceSens:40, adTolerance:35, peakHour:"08:00–10:00", impulseScore:22 } },
};

// ---------- 狀態 ----------
const state = {
  screen:"welcome", qi:0, scores:{impulse:0,rational:0,social:0,loyal:0},
  selectedIdx:null, locked:false, loadStep:0,
  completions:892, jumpClicks:324, heroIdx:0,
};
const personaOrder = ["rational","impulse","social","loyal"];
const app = document.getElementById("app");

// ---------- 工具 ----------
const h = (tag, attrs={}, ...kids) => {
  const el = document.createElement(tag);
  for (const [k,v] of Object.entries(attrs)){
    if(k==="class")el.className=v;
    else if(k==="style")el.style.cssText=v;
    else if(k.startsWith("on"))el.addEventListener(k.slice(2).toLowerCase(),v);
    else if(v===true)el.setAttribute(k,"");
    else if(v!==false&&v!=null)el.setAttribute(k,v);
  }
  kids.flat().forEach(k=>{if(k==null||k===false)return;el.append(k.nodeType?k:document.createTextNode(k));});
  return el;
};
const winnerType = () => Object.keys(state.scores).reduce((a,b)=>state.scores[a]>=state.scores[b]?a:b);

// ===== KNN 模擬:回傳前 3 個鄰居距離 =====
function knnNeighbors(scoresArr){
  const refs = {
    impulse:[5,0,0,0],rational:[0,5,0,0],social:[0,0,5,0],loyal:[0,0,0,5],
    "mix-social-impulse":[2,0,3,0],"mix-rational-loyal":[0,3,0,2],
  };
  const dist = (a,b)=>Math.sqrt(a.reduce((s,v,i)=>s+(v-b[i])**2,0));
  const arr = Object.entries(refs).map(([k,v])=>({k,d:dist(scoresArr,v)}));
  return arr.sort((a,b)=>a.d-b.d).slice(0,3);
}

// ---------- 渲染 ----------
function render(){
  document.body.scrollTop=0;
  app.innerHTML="";
  if(state.screen==="dashboard"){ renderDashboard(); return; }

  const header = h("header",{class:"header wrap"},
    h("div",{class:"logo"},
      h("div",{class:"logo-mark"},"🧠"),
      h("div",{},"TYPES",h("small",{},"數位消費人格 v2"))),
    h("button",{class:"btn-ghost",onclick:()=>{state.screen="dashboard";render();}},"⚙ MarTech 後台"));
  app.append(header);

  if(state.screen==="welcome")renderWelcome();
  else if(state.screen==="quiz")renderQuiz();
  else if(state.screen==="loading")renderLoading();
  else if(state.screen==="result")renderResult();

  app.append(h("footer",{class:"footer"},"© 2026 MarTech 數位消費人格 v2 · 智慧型 CRM 閉環 Prototype"));
}

function personaHero(p){
  return h("div",{class:"persona-card fade-up",style:`background:${p.grad}`},
    h("div",{style:"display:flex;justify-content:space-between;font-size:11px;font-weight:800;letter-spacing:.18em;opacity:.85"},
      h("span",{},"MARTECH PERSONA PROTOTYPE"),h("span",{},p.code)),
    h("div",{style:"margin-top:14px"},
      h("div",{class:"code"},p.code),
      h("div",{style:"margin-top:6px;font-size:14px;opacity:.92"},`${p.ip} · ${p.title}`)),
    h("div",{class:"face"},
      h("div",{class:"blob float",style:"width:60px;height:60px;top:0;left:30%"}),
      h("div",{class:"blob",style:"width:90px;height:90px;top:20px;left:44%;display:grid;place-items:center;font-size:28px"},p.avatar),
      h("div",{class:"blob float",style:"width:40px;height:40px;top:60px;left:18%;animation-delay:.6s"}),
      h("div",{class:"blob",style:"width:28px;height:28px;bottom:0;right:22%"})),
    h("div",{class:"traits"},...p.traits.map(t=>h("span",{class:"trait"},t))));
}

function renderWelcome(){
  const p = PERSONAS[personaOrder[state.heroIdx]];
  const sec = h("section",{class:"split wrap"},
    h("div",{},personaHero(p)),
    h("div",{class:"fade-up"},
      h("div",{class:"eyebrow"},"MarTech × AI 顧客行為原型"),
      h("h1",{class:"display",style:"margin-top:14px"},"更準的免費",h("br"),"數位消費人格測驗"),
      h("p",{class:"lead"},"每天面對上萬則廣告,你的大腦如何過濾行銷訊號?本測驗結合 ",
        h("strong",{},"KNN / 決策樹輕量級分類模型"),",5 題情境解碼你潛意識中的決策精靈 IP。"),
      h("div",{style:"margin-top:24px;display:flex;flex-direction:column;gap:10px;max-width:520px"},
        h("div",{class:"pill-row"},"🤖 即時 ML 推估:價格敏感度 / 廣告耐受度 / 衝動指數"),
        h("div",{class:"pill-row"},"💬 完成測驗後,專屬 AI 購物導航小助理自動上線"),
        h("div",{class:"pill-row"},"📊 企業後台:AdWords ROAS 追蹤 + 決策矩陣")),
      h("div",{style:"margin-top:24px"},
        h("button",{class:"cta-btn",onclick:startQuiz},h("span",{class:"dot"}),"立即開始測驗 →")),
      h("div",{class:"mini-meta"},
        h("span",{},"⚡ 約 60 秒"),h("span",{},"·"),h("span",{},"📊 4 種 IP 人格"),
        h("span",{},"·"),h("span",{},"🎁 專屬優惠"))));
  app.append(sec);
}

function startQuiz(){
  state.qi=0; state.scores={impulse:0,rational:0,social:0,loyal:0};
  state.selectedIdx=null; state.locked=false; state.screen="quiz"; render();
}

function renderQuiz(){
  const q = QUESTIONS[state.qi];
  const pct = ((state.qi+1)/QUESTIONS.length)*100;
  const sec = h("section",{class:"quiz fade-up"},
    h("div",{style:"display:flex;justify-content:space-between;font-size:12px;font-weight:800;margin-bottom:6px"},
      h("span",{class:"eyebrow"},`Q${String(state.qi+1).padStart(2,"0")} / ${String(QUESTIONS.length).padStart(2,"0")}`),
      h("span",{style:"color:var(--muted)"},`${Math.round(pct)}% 完成`)),
    h("div",{class:"progress"},h("div",{style:`width:${pct}%`})),
    h("p",{class:"q-context"},q.context),
    h("h2",{class:"q-title"},q.question),
    h("div",{class:"options"},...q.options.map((opt,i)=>{
      const b=h("button",{class:"opt",disabled:state.locked,onclick:()=>pick(opt.type,i)},
        h("span",{class:"letter"},String.fromCharCode(65+i)),h("span",{},opt.text));
      if(state.selectedIdx===i)b.dataset.selected="true";
      return b;
    })));
  app.append(sec);
}

function pick(type,idx){
  if(state.locked)return;
  state.locked=true; state.selectedIdx=idx;
  state.scores[type]++;
  setTimeout(()=>{
    if(state.qi+1<QUESTIONS.length){state.qi++;state.selectedIdx=null;state.locked=false;render();}
    else{state.completions++; state.screen="loading"; state.loadStep=0; render();
      [600,1200,1800].forEach((t,i)=>setTimeout(()=>{state.loadStep=i+1;render();},t));
      setTimeout(()=>{state.screen="result";render();showChatbot();},2400);}
  },380);
}

function renderLoading(){
  const steps=[
    "擷取 5 段情境決策訊號…",
    "丟入 KNN 分類器比對 1,245 位受測者向量…",
    "輸出 IP 原型 + 價格敏感度 / 廣告耐受度推估…",
  ];
  app.append(h("section",{class:"loading fade-up"},
    h("div",{class:"loader"},h("div",{class:"emoji"},"🧬")),
    h("div",{class:"eyebrow"},"AI MarTech ANALYSIS"),
    h("h2",{style:"font-size:24px;font-weight:900;margin:8px 0"},"大數據分析中"),
    h("p",{style:"color:var(--muted);font-size:13px"},"正在解析你的行銷濾鏡與決策基因"),
    h("ul",{class:"steps"},...steps.map((t,i)=>{
      const li=h("div",{class:"step"+(state.loadStep>i?" on":"")},
        h("span",{class:"badge"},state.loadStep>i?"✓":i+1),h("span",{},t));
      return li;
    }))));
}

function renderResult(){
  const t = winnerType();
  const p = PERSONAS[t];
  const scoresArr=[state.scores.impulse,state.scores.rational,state.scores.social,state.scores.loyal];
  const knn = knnNeighbors(scoresArr);
  const confidence = Math.round((1/(1+knn[0].d))*100);

  // 主結果
  const main = h("section",{class:"split wrap"},
    h("div",{},personaHero(p)),
    h("div",{class:"fade-up"},
      h("div",{class:"eyebrow"},`YOUR MARTECH PERSONA · ${p.code}`),
      h("h1",{class:"display",style:"margin-top:14px"},p.title),
      h("div",{style:`margin-top:6px;font-size:18px;font-weight:800;color:${p.accent}`},
        `${p.ip} · 全網僅 ${p.percent} 的人是這個分身`),
      h("p",{class:"lead"},p.desc),
      h("div",{class:"module",style:"margin-top:24px"},
        h("div",{class:"eyebrow"},"🎯 MarTech 個人化演算推薦"),
        h("div",{style:"font-size:13px;color:var(--muted);margin:6px 0"},"最容易打動你的品牌調性"),
        h("div",{style:"font-size:18px;font-weight:900"},p.reco),
        h("div",{style:"margin-top:8px;font-size:14px"},"推薦品牌:",
          h("strong",{style:`color:${p.accent};margin-left:6px`},p.brand))),
      h("div",{style:"margin-top:18px;display:flex;flex-wrap:wrap;gap:10px"},
        h("button",{class:"cta-btn",onclick:copyCoupon,id:"couponBtn"},
          h("span",{class:"dot"}),"領取專屬優惠序號"),
        h("button",{class:"outline-btn",onclick:()=>{state.jumpClicks++;window.open(p.link,"_blank");}},
          `前往 ${p.brand} 實測 →`)),
      h("div",{style:"margin-top:14px;display:flex;gap:18px;font-size:13px;color:var(--muted)"},
        h("button",{onclick:()=>navigator.clipboard?.writeText(location.href),
          style:"text-decoration:underline;color:inherit"},"🔗 分享比對"),
        h("button",{onclick:startQuiz,style:"text-decoration:underline;color:inherit"},"🔄 重新測驗"))));
  app.append(main);

  // ===== ML 推估面板 =====
  const mlPanel = h("section",{class:"wrap"},
    h("div",{class:"module"},
      h("div",{class:"eyebrow"},"🤖 AI 顧客分析 · 輕量級 ML 推估"),
      h("h3",{style:"margin-top:6px"},"KNN 分類器決策報告"),
      h("p",{class:"sub"},
        `信心度 ${confidence}% · 鄰近 3 個 cluster 已計算 · 模型版本:knn-v0.3 / decision-tree-fallback`),
      h("div",{class:"score-grid"},
        scoreCell("價格敏感度",p.ml.priceSens,"%","var(--rational)"),
        scoreCell("廣告耐受度",p.ml.adTolerance,"%","var(--impulse)"),
        scoreCell("衝動指數",p.ml.impulseScore,"/100","var(--social)"),
        scoreCell("活躍時段",p.ml.peakHour,"","var(--loyal)",true)),
      h("h4",{style:"margin-top:18px;font-size:13px;font-weight:800;letter-spacing:.05em"},"🧪 KNN 鄰居距離(歐式)"),
      (()=>{
        const tb = h("table",{class:"knn-table"},
          h("thead",{},h("tr",{},h("th",{},"#"),h("th",{},"鄰近 cluster"),h("th",{},"距離"),h("th",{},"標籤"))));
        const body = h("tbody",{});
        knn.forEach((n,i)=>{
          const isWin = n.k===t || n.k.startsWith("mix")&&n.k.includes(t.slice(0,3));
          body.append(h("tr",{},
            h("td",{},`#${i+1}`),h("td",{},n.k),h("td",{},n.d.toFixed(2)),
            h("td",{},h("span",{class:"chip",style:`background:${isWin?p.accent:"#eee"};color:${isWin?"#fff":"#666"}`},
              i===0?"匹配":"參考"))));
        });
        tb.append(body);
        return tb;
      })()));
  app.append(mlPanel);
}

function scoreCell(k,v,unit,color,isText){
  const cell = h("div",{class:"score-cell"},
    h("div",{class:"k"},k),
    h("div",{class:"v",style:`color:${color}`},isText?v:`${v}${unit}`));
  if(!isText){
    cell.append(h("div",{class:"bar"},h("div",{style:`width:${v}%;background:${color}`})));
  }
  return cell;
}

function copyCoupon(){
  navigator.clipboard?.writeText("MARTECH2026").catch(()=>{});
  const b=document.getElementById("couponBtn");
  if(b){b.innerHTML="✓ 已複製 MARTECH2026";b.style.background="var(--loyal)";
    setTimeout(()=>{b.innerHTML='<span class="dot"></span>領取專屬優惠序號';b.style.background="";},2200);}
}

// ============= AI Chatbot =============
const cbScripts = {
  impulse:[
    {role:"bot",text:"哈囉浪人 🌊!偵測到你正進入多巴胺活躍期 ✨"},
    {role:"bot",text:"⏰ 限時快閃倒數:你的命定包包只剩最後 3 件!"},
    {role:"bot",text:"點下方 👉 5 秒內帶走多巴胺快樂,折扣碼已自動填入。"} ],
  rational:[
    {role:"bot",text:"哈囉 🦉,我已為你比對 7 家通路。"},
    {role:"spec",text:"規格比較",spec:[
      ["商品","WH-1000XM5"],["最低價","NT$ 9,490 (PChome)"],
      ["保固","12 個月原廠"],["評價","4.7/5 · 12,431 則"],["CP 值","★★★★☆"]]},
    {role:"bot",text:"以上為硬核數據,無情緒包裝,請理性決策。"} ],
  social:[
    {role:"bot",text:"🦄 嗨!你的限動受眾正在等你開箱~"},
    {role:"bot",text:"📸 推薦 CASETiFY × Hello Kitty 聯名款 (IG 討論度 +320%)"},
    {role:"bot",text:"分享此頁到 IG 限動,自動再 +5% 折扣 🎁"} ],
  loyal:[
    {role:"bot",text:"🕊️ 哈囉,為你準備了一個有溫度的故事。"},
    {role:"bot",text:"綠藤生機・每一瓶都來自台灣有機農場,通過 B Corp 認證。"},
    {role:"bot",text:"購買即捐 3% 至「海洋廢棄物清除計畫」。"} ],
};
function showChatbot(){
  const t = winnerType();
  const cb = document.getElementById("chatbot");
  const body = document.getElementById("cbBody");
  const toggle = document.getElementById("cbToggle");
  body.innerHTML="";
  cbScripts[t].forEach((m,i)=>setTimeout(()=>{
    const el = h("div",{class:"msg "+m.role},m.text);
    if(m.role==="spec"&&m.spec){
      const tbl = h("table",{});
      m.spec.forEach(r=>tbl.append(h("tr",{},h("td",{},r[0]),h("td",{},r[1]))));
      el.append(tbl);
    }
    body.append(el); body.scrollTop=body.scrollHeight;
  },i*700));
  cb.classList.remove("hidden");
  toggle.classList.add("hidden");
}
document.getElementById("cbClose").onclick=()=>{
  document.getElementById("chatbot").classList.add("hidden");
  document.getElementById("cbToggle").classList.remove("hidden");
};
document.getElementById("cbToggle").onclick=()=>showChatbot();
document.getElementById("cbSend").onclick=cbSend;
document.getElementById("cbInput").addEventListener("keydown",e=>{if(e.key==="Enter")cbSend();});
function cbSend(){
  const inp = document.getElementById("cbInput");
  const txt = inp.value.trim(); if(!txt)return;
  const body = document.getElementById("cbBody");
  body.append(h("div",{class:"msg user"},txt));
  inp.value="";
  setTimeout(()=>{
    body.append(h("div",{class:"msg bot"},"✨ (Demo) 動態內容生成中:已記錄此偏好,將用於下一次個人化推薦。"));
    body.scrollTop=body.scrollHeight;
  },500);
  body.scrollTop=body.scrollHeight;
}

// ============= Dashboard =============
function renderDashboard(){
  const t = winnerType();
  const p = PERSONAS[t];
  const completionRate = ((state.completions/(state.completions+412))*100).toFixed(1);
  const jumpRate = ((state.jumpClicks/state.completions)*100).toFixed(1);
  const couponRate = 36.0;

  const aside = h("aside",{},
    h("h2",{},"🧠 ",h("span",{},"MarTech CRM")),
    h("nav",{},
      h("button",{class:"active"},"📊 總覽"),
      h("button",{},"👥 受測者"),
      h("button",{},"🔀 漏斗分析"),
      h("button",{},"📣 品牌活動"),
      h("button",{},"💰 AdWords ROAS"),
      h("button",{},"📲 社群擴散"),
      h("button",{},"🤖 AI 洞察"),
      h("button",{},"⚙ 設定")));

  const top = h("div",{class:"dash-top"},
    h("div",{},
      h("h1",{},"企業總覽 · 智慧型 CRM 閉環"),
      h("div",{style:"font-size:12px;color:#7b8299;margin-top:4px"},"最後同步:剛剛 · 數據範圍:近 7 日")),
    h("div",{class:"actions"},
      h("button",{},"📅 近 7 日"),h("button",{},"⬇ 匯出 CSV"),
      h("button",{class:"primary",onclick:()=>{state.screen="welcome";render();}},"← 返回前端")));

  const aiBanner = h("div",{class:"ai-banner"},
    h("div",{class:"ico"},"🤖"),
    h("div",{},
      h("h4",{},"AI 洞察 INSIGHT · 即時生成"),
      h("p",{},
        `當前主流受眾為「${p.ip} (${p.code})」,佔比 ${p.percent}。`,
        `ML 推估該客群價格敏感度 ${p.ml.priceSens}%、廣告耐受度 ${p.ml.adTolerance}%,`,
        `活躍時段集中於 ${p.ml.peakHour}。建議啟動自動化推播,於該時段定向發送限時優惠。`)));

  const kpis = h("div",{class:"kpis"},
    kpi("曝光 UV","18,420","↑ 12.4%","up"),
    kpi("完成率",`${completionRate}%`,"↑ 3.1%","up"),
    kpi("跨站導流率",`${jumpRate}%`,"↑ 5.6%","up"),
    kpi("優惠券核銷",`${couponRate}%`,"↓ 2.1%","down"));

  // 主圖表
  const charts = h("div",{class:"grid-2"},
    panel("📈 7 日轉換趨勢","曝光 → 完成 → 跨站轉換",h("canvas",{id:"chartTrend",height:220})),
    panel("🥧 IP 人格分佈","KNN 分群即時結果",h("canvas",{id:"chartPie",height:220})));

  // ===== AdWords ROAS Panel =====
  const roasPanel = h("div",{class:"panel",style:"margin-bottom:20px"},
    h("h3",{},"💰 Google AdWords ROI 追蹤面板"),
    h("p",{class:"desc"},"關鍵字:心理測驗 / MBTI / 購物推薦 · 與前端「領券完成數」即時連動"),
    h("div",{class:"roas"},
      roasCell("總曝光","124,820",""),
      roasCell("點擊數","8,341",""),
      roasCell("CPC","NT$ 3.2","warn"),
      roasCell("CPA","NT$ 41","good"),
      roasCell("領券完成","892",""),
      roasCell("營收歸因","NT$ 142,720","good"),
      roasCell("ROAS","389%","good"),
      roasCell("廣告預算","NT$ 36,720","")));

  // ===== 社群擴散與信任傳播 =====
  const socialPanel = h("div",{class:"panel",style:"margin-bottom:20px"},
    h("h3",{},"📲 社群擴散 & 信任傳播監測"),
    h("p",{class:"desc"},"模擬爬取 Instagram / Threads 分享動態,評估 KOL 經濟與消費者信任的量化關係"),
    h("div",{style:"margin:8px 0 14px"},
      ["#購物人格測驗","#MarTech","#多巴胺消費","#2026流行測驗","#你是哪一型"]
        .map(t=>h("span",{class:"hash"},t))),
    h("div",{},
      socRow("🦄 社群共振儀 (ECHO)","412 次分享","二次流量 +1,824","up"),
      socRow("🏄 多巴胺浪人 (DOPA)","218 次分享","二次流量 +642","up"),
      socRow("🕊️ 價值守護者 (ROOT)","94 次分享","二次流量 +312",""),
      socRow("🦉 規格解碼者 (LOGI)","31 次分享","二次流量 +52","")));

  // ===== 決策矩陣表 (Data → Information → Knowledge → Decision) =====
  const matrixPanel = h("div",{class:"panel",style:"margin-bottom:20px"},
    h("h3",{},"🧩 MIS 決策矩陣 · Data → Information → Decision"),
    h("p",{class:"desc"},"系統如何將原始數據轉化為可執行的營運決策,輔助高層資源配置"),
    (()=>{
      const tbl = h("table",{class:"mtx"},
        h("thead",{},h("tr",{},
          h("th",{},"後台數據 (Data)"),h("th",{},"管理問題 (Information)"),h("th",{},"系統決策 (Knowledge)"))));
      const tb = h("tbody",{});
      [
        {tag:"loy",t:"價值守護者",d:"比例上升 +8%,綠藤跳轉率高",i:"AdWords CPC 偏高,獲客成本不划算",
          k:"減少 SEM 預算 30%,轉投線下「永續環保講座」內容行銷"},
        {tag:"imp",t:"多巴胺浪人",d:"訂單集中 21:00–23:00 (佔 62%)",i:"該族群具深夜衝動購物特徵",
          k:"啟動自動化推播,21:00 定向發送 2 小時限時優惠"},
        {tag:"soc",t:"社群共振儀",d:"二次分享流量 +1,824 (Referral)",i:"高傳播 IP 帶來低 CAC 自然流量",
          k:"擴大 KOL 合作預算,新增 IG 限動分享獎勵 +5% 折扣"},
        {tag:"rat",t:"全體",d:"完成測驗→領券流失率 64%",i:"CTA 按鈕誘因不足或推薦不精準",
          k:"系統自動啟動 A/B 測試,優化發券機制與按鈕視覺"},
      ].forEach(r=>{
        tb.append(h("tr",{},
          h("td",{},h("span",{class:"tag "+r.tag},r.t),h("br"),r.d),
          h("td",{},r.i),
          h("td",{},r.k,h("br"),h("span",{class:"act"},"→ 系統已自動排程執行"))));
      });
      tbl.append(tb);
      return tbl;
    })());

  // ===== GEO 生成式引擎優化 =====
  const geoPanel = h("div",{class:"panel",style:"margin-bottom:20px"},
    h("h3",{},"🌐 GEO · 生成式引擎優化 (Generative Engine Optimization)"),
    h("p",{class:"desc"},"優化 ChatGPT / Perplexity / SearchGPT 對本站的引用率"),
    h("div",{class:"geo-list"},
      geoRow("📄","JSON-LD 結構化資料","已部署 Quiz + FAQPage Schema · LLM 可正確解析",true),
      geoRow("🤖","LLM 引用追蹤","Perplexity 引用 +14 次 / ChatGPT 引用 +8 次(7 日)",false),
      geoRow("🔍","語意關鍵字佈局",h("span",{},
        "已佈局:",
        ["心理測驗","購物人格","2026 流行測驗","小眾設計好物","MBTI 消費"]
          .map(k=>h("span",{class:"hash"},k))),false),
      geoRow("⚡","Zero-Party Data","受測者主動回答 5 題 · 可直接餵入 GEO 語料",true)));

  const main = h("main",{},top,aiBanner,kpis,charts,roasPanel,socialPanel,matrixPanel,geoPanel);
  const dash = h("div",{class:"dash"},aside,main);
  app.append(dash);

  // 隱藏 chatbot 於後台
  document.getElementById("chatbot").classList.add("hidden");
  document.getElementById("cbToggle").classList.add("hidden");

  // draw charts
  setTimeout(()=>{drawTrend();drawPie();},20);
}

function kpi(k,v,t,cls){return h("div",{class:"kpi"},h("div",{class:"k"},k),h("div",{class:"v"},v),h("div",{class:"t "+cls},t));}
function panel(title,desc,...kids){return h("div",{class:"panel"},h("h3",{},title),h("p",{class:"desc"},desc),...kids);}
function roasCell(k,v,c){return h("div",{class:"cell"},h("div",{class:"k"},k),h("div",{class:"v "+(c||"")},v));}
function socRow(name,share,ref,cls){
  return h("div",{class:"soc-row"},h("span",{class:"ig"},name),
    h("span",{style:"color:#cfd3e0;font-size:12px"},share),h("span",{class:"ref "+cls},ref));
}
function geoRow(ico,t,desc,ok){
  return h("div",{class:"row"},h("span",{class:"ico"},ico),
    h("div",{},h("b",{},t),h("br"),
      typeof desc==="string"?h("span",{style:"color:#9aa0b4;font-size:12px"},desc):desc,
      ok?h("span",{style:"margin-left:8px;color:#34d399;font-weight:800;font-size:11px"},"✓ ACTIVE"):""));
}

// Canvas charts (lightweight)
function drawTrend(){
  const c = document.getElementById("chartTrend"); if(!c)return;
  const ctx = c.getContext("2d");
  const w = c.width = c.clientWidth*2; const hpx = c.height = 440;
  ctx.scale(2,2);
  const W = w/2, H = hpx/2;
  ctx.clearRect(0,0,W,H);
  const days=["週一","週二","週三","週四","週五","週六","週日"];
  const exp =[1820,1940,2210,2120,2680,3120,3530];
  const done=[ 920, 980,1140,1080,1420,1680,1920];
  const cross=[280,310,360,340,510,640,780];
  const pad=30, maxV=Math.max(...exp)*1.1;
  const xs = i => pad+i*((W-pad*2)/6);
  const ys = v => H-20-(v/maxV)*(H-50);
  // grid
  ctx.strokeStyle="#1d2230"; ctx.lineWidth=1;
  for(let i=0;i<5;i++){const y=20+i*((H-40)/4); ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(W-10,y);ctx.stroke();}
  // areas
  function area(data,color){
    ctx.beginPath(); ctx.moveTo(xs(0),H-20);
    data.forEach((v,i)=>ctx.lineTo(xs(i),ys(v)));
    ctx.lineTo(xs(data.length-1),H-20); ctx.closePath();
    const g = ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,color+"aa"); g.addColorStop(1,color+"00");
    ctx.fillStyle=g; ctx.fill();
    ctx.beginPath(); data.forEach((v,i)=>i?ctx.lineTo(xs(i),ys(v)):ctx.moveTo(xs(i),ys(v)));
    ctx.strokeStyle=color; ctx.lineWidth=2; ctx.stroke();
  }
  area(exp,"#a855f7"); area(done,"#3b82f6"); area(cross,"#10b981");
  ctx.fillStyle="#7b8299"; ctx.font="10px sans-serif";
  days.forEach((d,i)=>ctx.fillText(d,xs(i)-12,H-5));
  // legend
  const lg=[["曝光","#a855f7"],["完成","#3b82f6"],["跨站轉換","#10b981"]];
  lg.forEach((l,i)=>{ctx.fillStyle=l[1];ctx.fillRect(pad+i*70,5,8,8);ctx.fillStyle="#cfd3e0";ctx.fillText(l[0],pad+12+i*70,12);});
}
function drawPie(){
  const c = document.getElementById("chartPie"); if(!c)return;
  const ctx = c.getContext("2d");
  c.width = c.clientWidth*2; c.height=440; ctx.scale(2,2);
  const W=c.width/2,H=c.height/2;
  const data=[
    {l:"多巴胺浪人 35%",v:35,c:"#ff5a8a"},
    {l:"規格解碼者 25%",v:25,c:"#3b82f6"},
    {l:"社群共振儀 25%",v:25,c:"#a855f7"},
    {l:"價值守護者 15%",v:15,c:"#10b981"},
  ];
  const cx=W/2-40,cy=H/2,r=Math.min(W,H)/2-30;
  let start=-Math.PI/2;
  data.forEach(d=>{
    const ang=(d.v/100)*Math.PI*2;
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,start,start+ang);ctx.closePath();
    ctx.fillStyle=d.c;ctx.fill();
    ctx.strokeStyle="#11151f";ctx.lineWidth=2;ctx.stroke();
    start+=ang;
  });
  // donut hole
  ctx.beginPath();ctx.arc(cx,cy,r*0.55,0,Math.PI*2);ctx.fillStyle="#11151f";ctx.fill();
  ctx.fillStyle="#fff";ctx.font="bold 14px sans-serif";ctx.textAlign="center";
  ctx.fillText("4 IP",cx,cy-4); ctx.font="10px sans-serif";ctx.fillStyle="#7b8299";
  ctx.fillText("即時 KNN",cx,cy+12);
  // legend
  ctx.textAlign="left";
  data.forEach((d,i)=>{
    const y=20+i*22;
    ctx.fillStyle=d.c;ctx.fillRect(W-150,y,10,10);
    ctx.fillStyle="#cfd3e0";ctx.font="11px sans-serif";ctx.fillText(d.l,W-135,y+9);
  });
}

// 啟動
render();
// 輪播 hero
setInterval(()=>{
  if(state.screen!=="welcome")return;
  state.heroIdx=(state.heroIdx+1)%personaOrder.length; render();
},3000);
