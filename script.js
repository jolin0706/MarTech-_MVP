const questions = [
    {
        context: "📱 情境一 · 通勤路上",
        question: "在捷運上滑 IG 時看見一則限時動態廣告，你的大腦直覺反應是？",
        options: [
            { text: "立刻被視覺生火，點進連結看看有沒有「限時折扣」！", type: "impulse" },
            { text: "迅速滑過，我只相信自己主動搜尋的資訊，對廣告免疫。", type: "rational" },
            { text: "發現是追蹤很久的 KOL 推薦，馬上分享給朋友討論。", type: "social" },
            { text: "留意到這家品牌的理念很環保，點進去看看他們的幕後故事。", type: "loyal" }
        ]
    },
    {
        context: "☕️ 情境二 · 辦公室茶水間",
        question: "同事端著一個超有設計感的隨行杯走進來，你被吸引了，你会？",
        options: [
            { text: "腦波一弱直接問在哪買的，可能下午就跟著衝動團購了。", type: "impulse" },
            { text: "默默記下品牌，晚點去 PTT/Dcard 查實測評價與是否有價差。", type: "rational" },
            { text: "稱讚他很有品味！覺得這拿來拍辦公室日常限動一定很配。", type: "social" },
            { text: "詢問這是不是標榜材質永續、在地原創設計的小眾品牌？", type: "loyal" }
        ]
    },
    {
        context: "🎁 情境三 · 午休挑選禮物",
        question: "好友下週生日，你正在線上挑選送他的禮物。你的核心準則是？",
        options: [
            { text: "感覺對了就買！拆包裹當下的「驚喜多巴胺」最重要。", type: "impulse" },
            { text: "挑選實用性極高、有保固且保值，對方每天都能用到的物品。", type: "rational" },
            { text: "買網路上現在討論度最高、最難搶的話題聯名限量品。", type: "social" },
            { text: "挑選背後有社會企業意義，或是會將收益捐助公益的品牌。", type: "loyal" }
        ]
    },
    {
        context: "🛒 情境四 · 夜間購物車結帳",
        question: "準備結帳網購時，發現金額還差 100 元才能達到「免運費」，你會？",
        options: [
            { text: "隨便抓個加價購專區的零食或小廢物湊數，免運最爽快！", type: "impulse" },
            { text: "冷靜計算運費跟硬湊的商品哪個划算，不划算寧願付運費。", type: "rational" },
            { text: "發限動問有沒有朋友要一起湊單，順便開啟話題聊天。", type: "social" },
            { text: "堅持只買真正需要的，不為了免運去買不需要的消耗品。", type: "loyal" }
        ]
    },
    {
        context: "📦 情境五 · 收到包裹開箱",
        question: "期待已久的包裹終於送達了！你拆開包裝的第一個反射動作是？",
        options: [
            { text: "迫不及待暴力撕開包裝直接試用，享受多巴胺分泌的快樂！", type: "impulse" },
            { text: "仔細比對商品外觀有無瑕疵，確認內容物與發票標籤無誤。", type: "rational" },
            { text: "先佈置一下美感背景，拍一張開箱美照上傳並標記品牌。", type: "social" },
            { text: "小心拆解紙箱拿去分類回收，並仔細閱讀品牌附贈的手寫卡。", type: "loyal" }
        ]
    }
];

let currentQuestionIndex = 0;
let scores = { impulse: 0, rational: 0, social: 0, loyal: 0 };
let dashboardVisible = false;

// 初始模擬 B2B 商家池大數據
let dashData = {
    impressions: 1245,
    completions: 890,
    jumpClicks: 320,
    personaDistribution: { impulse: 310, rational: 222, social: 222, loyal: 136 }
}; 

let currentExternalLink = "";

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function startQuiz() {
    currentQuestionIndex = 0;
    scores = { impulse: 0, rational: 0, social: 0, loyal: 0 };
    showScreen('quiz-screen');
    renderQuestion();
}

function renderQuestion() {
    const q = questions[currentQuestionIndex];
    document.getElementById('story-context').innerText = q.context;
    document.getElementById('question-text').innerText = q.question;
    
    const progress = Math.round((currentQuestionIndex / questions.length) * 100);
    document.getElementById('progress-bar').style.width = `${progress}%`;
    document.getElementById('progress-num').innerText = progress;

    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt.text;
        btn.onclick = () => {
            document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
            scores[opt.type]++;
            currentQuestionIndex++;

            if (currentQuestionIndex < questions.length) {
                setTimeout(renderQuestion, 350); 
            } else {
                dashData.completions++; 
                const highestScoreType = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
                dashData.personaDistribution[highestScoreType]++;
                
                setTimeout(() => { 
                    showScreen('loading-screen'); 
                    setTimeout(showResult, 2000); 
                }, 350);
            }
        };
        optionsContainer.appendChild(btn);
    });
}

function showResult() {
    showScreen('result-screen');
    const highestScoreType = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    
    const titleEl = document.getElementById('result-title');
    const descEl = document.getElementById('result-desc');
    const statEl = document.getElementById('stat-percent');
    const cardEl = document.getElementById('result-card');
    const avatarEl = document.getElementById('result-avatar');
    const ipNameEl = document.getElementById('ip-name');
    const recoEl = document.getElementById('reco-product');
    const brandNameEl = document.getElementById('brand-name');

    if (highestScoreType === 'impulse') {
        ipNameEl.innerText = "多巴胺浪人 ⚡️";
        ipNameEl.style.backgroundColor = "#FF5A5F";
        titleEl.innerText = "視覺系感性買手";
        descEl.innerText = "你的大腦對「限時、限量、高顏值」的行銷訊號毫無抵抗力。決策速度極快，享受購物帶來的即時滿足感！";
        statEl.innerText = "35%";
        recoEl.innerText = "強調視覺撞色與設計感原創好物";
        brandNameEl.innerText = "Pinkoi";
        currentExternalLink = "https://www.pinkoi.com/";
        avatarEl.innerText = "🏄‍♂️";
        cardEl.style.background = "radial-gradient(circle at 10% 20%, rgba(255, 143, 177, 0.25) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(255, 195, 160, 0.3) 0%, transparent 50%), #FFF8F8";
    } else if (highestScoreType === 'rational') {
        ipNameEl.innerText = "規格解碼者 🧊";
        ipNameEl.style.backgroundColor = "#3B82F6";
        titleEl.innerText = "人間清醒精算師";
        descEl.innerText = "你自帶超強的「廣告免疫濾鏡」。大腦只接收硬核數據、規格、功能性與高 CP 值，行銷話術對你完全無效。";
        statEl.innerText = "25%";
        recoEl.innerText = "結構透明、極致實用的智慧數位週邊";
        brandNameEl.innerText = "PChome 24h";
        currentExternalLink = "https://24h.pchome.com.tw/";
        avatarEl.innerText = "🦉";
        cardEl.style.background = "radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(147, 197, 253, 0.2) 0%, transparent 50%), #F4F9FF";
    } else if (highestScoreType === 'social') {
        ipNameEl.innerText = "社群共振儀 ✨";
        ipNameEl.style.backgroundColor = "#F5A623";
        titleEl.innerText = "口碑傳播決策點";
        descEl.innerText = "你高度依賴社群信任與同儕推薦。購物對你而言是一種類型化的「社交貨幣」，你是社群圈中最強的口碑節點！";
        statEl.innerText = "25%";
        recoEl.innerText = "話題度破表、具備打卡與開箱潛力的潮流選品";
        brandNameEl.innerText = "CASETiFY";
        currentExternalLink = "https://www.casetify.com/";
        avatarEl.innerText = "🦄";
        cardEl.style.background = "radial-gradient(circle at 10% 20%, rgba(245, 166, 35, 0.15) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(253, 230, 138, 0.25) 0%, transparent 50%), #FFFCF5";
    } else {
        ipNameEl.innerText = "價值守護者 🌿";
        ipNameEl.style.backgroundColor = "#10B981";
        titleEl.innerText = "品牌靈魂信徒";
        descEl.innerText = "你極度看重企業的 ESG 永續理念、核心價值與品牌真實故事。一旦產生靈魂共鳴，你將成為最忠誠的鐵粉。";
        statEl.innerText = "15%";
        recoEl.innerText = "標榜永續經營、綠色純淨理念的在地護理";
        brandNameEl.innerText = "綠藤生機";
        currentExternalLink = "https://www.greenvines.com.tw/";
        avatarEl.innerText = "🕊️";
        cardEl.style.background = "radial-gradient(circle at 10% 20%, rgba(16, 185, 129, 0.12) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(167, 243, 208, 0.2) 0%, transparent 50%), #F3FFF9";
    }
}

function copyCoupon() {
    alert("已自動複製合作行銷優惠碼：MARTECH2026 ！請於跳轉之結帳頁面貼上使用。");
}

function goToBrandSite() {
    dashData.jumpClicks++;
    window.open(currentExternalLink, '_blank');
}

function toggleDashboard() {
    dashboardVisible = !dashboardVisible;
    if (dashboardVisible) {
        document.getElementById('app-container').style.display = 'none';
        document.querySelector('.app-header').style.display = 'none';
        updateDashboardUI();
        showScreen('dashboard-screen');
    } else {
        document.getElementById('app-container').style.display = 'block';
        document.querySelector('.app-header').style.display = 'flex';
        showScreen('welcome-screen');
    }
}

/* ==========================================================================
   2026 MarTech 智能大數據運作核心邏輯
   ========================================================================== */
function updateDashboardUI() {
    const total = dashData.impressions;
    const comps = dashData.completions;
    const clicks = dashData.jumpClicks;

    const completionRate = ((comps / total) * 100);
    const ctr = ((clicks / comps) * 100);

    // 基礎數據更新
    document.getElementById('dash-impressions').innerText = total.toLocaleString();
    document.getElementById('dash-completions').innerText = comps.toLocaleString();
    document.getElementById('dash-clicks').innerText = clicks.toLocaleString();
    document.getElementById('dash-cvr').innerText = `${ctr.toFixed(1)}%`;
    document.getElementById('table-traffic').innerText = `${total.toLocaleString()} 人`;
    document.getElementById('table-engagement').innerText = `${comps.toLocaleString()} 人`;
    document.getElementById('table-coupon').innerText = `${clicks.toLocaleString()} 人`;
    document.getElementById('table-completion-rate-text').innerText = `完答率 ${completionRate.toFixed(1)}%`;
    document.getElementById('table-ctr-text').innerText = `點擊率 ${ctr.toFixed(1)}%`;

    // 狀態顏色更換
    const compBadge = document.getElementById('dash-completion-rate-badge');
    compBadge.innerText = `${completionRate.toFixed(1)}%`;
    compBadge.className = completionRate >= 60 ? "kpi-trend up" : "kpi-trend down";

    const cvrBadge = document.getElementById('dash-cvr-badge');
    cvrBadge.innerText = ctr >= 30 ? "高轉換" : "精準度低";
    cvrBadge.className = ctr >= 30 ? "kpi-trend up" : "kpi-trend down";

    // 計算人格分佈比例
    const dist = dashData.personaDistribution;
    const maxType = Object.keys(dist).reduce((a, b) => dist[a] > dist[b] ? a : b);
    const pImpulse = ((dist.impulse / comps) * 100).toFixed(0);
    const pRational = ((dist.rational / comps) * 100).toFixed(0);
    const pSocial = ((dist.social / comps) * 100).toFixed(0);
    const pLoyal = ((dist.loyal / comps) * 100).toFixed(0);

    document.getElementById('bar-impulse').style.height = `${pImpulse}%`;
    document.getElementById('label-impulse').innerHTML = `多巴胺<br>${pImpulse}%`;
    document.getElementById('bar-rational').style.height = `${pRational}%`;
    document.getElementById('label-rational').innerHTML = `解碼者<br>${pRational}%`;
    document.getElementById('bar-social').style.height = `${pSocial}%`;
    document.getElementById('label-social').innerHTML = `共振儀<br>${pSocial}%`;
    document.getElementById('bar-loyal').style.height = `${pLoyal}%`;
    document.getElementById('label-loyal').innerHTML = `守護者<br>${pLoyal}%`;

    // ==========================================
    // 趨勢一：【AI 行銷】核心演算邏輯區
    // ==========================================
    let customerAnalysisText = "";
    let chatbotScriptText = "";

    if (maxType === 'impulse') {
        customerAnalysisText = `🧠 <strong>當前主流 AI 受眾特徵：感性多巴胺占優 (${pImpulse}%)</strong><br>AI 預測該客群極易被大圖、短影音視覺與高飽和度色彩所吸引。社群媒體分析顯示，他們在 Threads 與 Instagram 上的互動時間主要集中在深夜。大腦對於「即時快感」訊號極其敏感，易產生衝動購物。`;
        chatbotScriptText = `🤖 <strong>推薦 AI Chatbot 導流腳本（適用於 LINE/IG 私訊自動化）：</strong><br>當用戶觸發機器人時，直接拋出視覺撞色圖，第一句台詞固定為：『限時快閃倒數！🎉 你的命定包包只剩最後 3 件。點擊下方按鈕，5秒內直接帶走多巴胺快樂！』避免冗長對話，縮短結帳路徑。`;
    } else if (maxType === 'rational') {
        customerAnalysisText = `🧊 <strong>當前主流 AI 受眾特徵：硬核規格精算占優 (${pRational}%)</strong><br>AI 深度客群模型指出，此群體極度冷靜，高度依賴理性比價與規格。社群監測顯示他們大量出沒於 PTT、Dcard 與專業論壇。對於「促銷、限量」行銷話術免疫度高達 92%，極看重售後與保固。`;
        chatbotScriptText = `🤖 <strong>推薦 AI Chatbot 導流腳本（適用於客服型聊天機器人）：</strong><br>腳本應設計成「顧問型規格解碼器」。Chatbot 第一步先詢問使用情境，隨即自動輸出『產品 CP 值橫向對比圖』與『規格全透明白皮書』，最後提供『官方原廠 3 年保固條款連結』，用數據說服理性大腦。`;
    } else if (maxType === 'social') {
        customerAnalysisText = `✨ <strong>當前主流 AI 受眾特徵：社群共振貨幣占優 (${pSocial}%)</strong><br>AI 顧客模型顯示，購物對該客群而言是「社交認同」。社群媒體分析指出，他們熱衷於開箱、標記、分享限時動態，同儕推薦對其購物決策權重高達 78%。關注焦點在於這件商品『拿出來是否有話題度』。`;
        chatbotScriptText = `🤖 <strong>推薦 AI Chatbot 導流腳本（適用於社群裂變機器人）：</strong><br>採用裂變式對話。Chatbot 腳本：『恭喜獲得專屬測驗勳章！🏅 現在截圖發到 IG 限動並標記我們，聊天機器人將自動私訊發送【網紅同款潮流小禮】免運兌換券！快看看你朋友是什麼 IP！』`;
    } else {
        customerAnalysisText = `🌿 <strong>當前主流 AI 受眾特徵：價值理念鐵粉占優 (${pLoyal}%)</strong><br>AI 情感語意分析顯示，該客群極度重視品牌的 ESG 永續思維與品牌真實性（Authenticity）。社群監測發現他們更傾向閱讀長文內容。一旦對品牌理念產生靈魂共鳴，客戶生命週期價值 (LTV) 將是其他人的 3.4 倍。`;
        chatbotScriptText = `🤖 <strong>推薦 AI Chatbot 導流腳本（適用於情感陪伴型機器人）：</strong><br>Chatbot 腳本切忌粗暴發券。應由品牌小幫手視角出發：『謝謝你跟我們一起守護這片土地。💚 點擊下方，可以閱讀我們今年在綠色減碳上的手寫紀錄。這份專屬的純淨護理折價券，送給注重生活本質的你。』`;
    }
    document.getElementById('ai-customer-analysis').innerHTML = customerAnalysisText;
    document.getElementById('ai-chatbot-script').innerHTML = chatbotScriptText;

    // ==========================================
    // 趨勢二：【網路行銷】GEO / SEO / SEM 核心演算區
    // ==========================================
    const geoList = document.getElementById('geo-strategy-list');
    const seoList = document.getElementById('seo-strategy-list');
    const semBidding = document.getElementById('sem-bidding-strategy');
    const semAdCopy = document.getElementById('sem-ad-copy');

    if (maxType === 'impulse') {
        geoList.innerHTML = `<li><li><strong>引用權重：</strong>優化 AI 搜尋引擎（如 SearchGPT）的「推薦字詞」，確保當使用者詢問『2026年有什麼設計感、高顏值的原創品牌』時，品牌能出現在 AI 的前三項引用源。</li><li><strong>內容形式：</strong>在網頁中大量埋入高清晰度、帶有視覺色彩標籤的結構化資料（Structured Data），讓生成式引擎能快速抓取『限時特價』與『高顏值原創好物』標籤。</li>`;
        seoList.innerHTML = `<li><strong>SEO 主力關鍵字：</strong>佈局『小眾設計好物推薦』、『網購限時特價』、『2026流行穿搭撞色』。</li><li><strong>內容行銷：</strong>撰寫以視覺衝擊、多巴胺開箱為主題的短篇網誌，增加標題吸引力。</li>`;
        semBidding.innerHTML = `<li><strong>投放策略：</strong>Google AdWords 建議採用「爭取轉換次數 (Maximize Conversions)」智慧出價。由於其決策快，應提高週末與夜間（22:00-02:00）的預算權重。</li>`;
        semAdCopy.innerText = `【廣告標題】全網爆紅款！設計感原創好物限時 8 折起\n【廣告內文】最後倒數！2026高顏值視覺系必收，免運優惠券一鍵領取，手慢就沒了！立刻點擊看你的多巴胺專屬推薦。`;
    } else if (maxType === 'rational') {
        geoList.innerHTML = `<li><strong>數據引述優化：</strong>AI 搜尋（如 Perplexity）在回答理性問題時，極度看重「客觀數據對比」。網頁內容必須包含『規格參數表』與『價格/性能橫向對比』，促使生成式引擎在引述時說出「該品牌在硬核性價比上超越同級30%」。</li>`;
        seoList.innerHTML = `<li><strong>SEO 主力關鍵字：</strong>佈局『智慧數位週邊實測』、『3C週邊高CP值推薦』、『規格保固比較』。</li><li><strong>內容行銷：</strong>撰寫深度的、不帶情緒性字眼的專業實測與規格拆解報告，爭取 Google 搜尋的「精選摘要 (Featured Snippets)」字位。</li>`;
        semBidding.innerHTML = `<li><strong>投放策略：</strong>建議採用「目標投資報酬率 (Target ROAS)」出價。客群點擊前會多方比價，應精準鎖定精確比對關鍵字，排除模糊流量，降低 CPA。</li>`;
        semAdCopy.innerText = `【廣告標題】人間清醒首選：智慧數位週邊規格全公開\n【廣告內文】拒絕行銷話術！實測硬核數據透明對比，高CP值有目共睹。原廠提供 3 年安心保固，點期了解完整規格白皮書。`;
    } else if (maxType === 'social') {
        geoList.innerHTML = `<li><li><strong>社群訊號引用：</strong>2026 數位行銷新趨勢指出，生成式引擎開始將 Instagram/Threads 的公開討論度納入推薦權重。企業必須在社群創造大量「品牌標記與討論」，讓 AI 搜尋引擎在回答『網路上討論度最高的潮流選品』時被直接點名。</li>`;
        seoList.innerHTML = `<li><strong>SEO 主力關鍵字：</strong>佈局『KOL同款推薦』、『社群爆紅聯名限量』、『網紅推薦開箱』。</li><li><strong>內容行銷：</strong>以「話題潮流選品懶人包」、「社群打卡必備」為題，大量置入網紅合照與開箱社群內嵌連結，提高頁面的權威度 (Domain Authority)。</li>`;
        semBidding.innerHTML = `<li><strong>投放策略：</strong>Google AdWords 結合「多媒體廣告網 (GDN)」與 YouTube 廣告進行人群投放，鎖定「熱衷社群、喜愛跟風流行」的興趣受眾。</li>`;
        semAdCopy.innerText = `【廣告標題】討論度破表！KOL 瘋傳的話題潮流選品限量搶購中\n【廣告內文】你跟上了嗎？2026社群圈人手一個，具備極致開箱美感。立即點擊解鎖專屬好友對比連結，看看你的潮流 IP！`;
    } else {
        geoList.innerHTML = `<li><strong>品牌故事一致性：</strong>AI 引擎在歸納『具有社會企業責任、ESG永續理念的品牌』時，會全網搜集企業的品牌故事與公益足跡。網頁中必須規劃專屬的『永續白皮書』或『減碳故事頁面』供 AI 爬蟲全面理解。</li>`;
        seoList.innerHTML = `<li><strong>SEO 主力關鍵字：</strong>佈局『永續經營品牌故事』、『綠色純淨護理推薦』、『在地原創ESG』。</li><li><strong>內容行銷：</strong>撰寫深入的品牌創辦故事、綠色減碳製程、手寫卡片背後的溫暖情感，提高內容的黏著度與長尾關鍵字效應。</li>`;
        semBidding.innerHTML = `<li><strong>投放策略：</strong>採用「爭取點擊次數」搭配高精準受眾標籤（如：關注環保、綠色消費）。該群體需要長時間考慮理念，應加強「再行銷廣告 (Remarketing)」持續溝通。</li>`;
        semAdCopy.innerText = `【廣告標題】綠藤生機 🌿 尋找靈魂共鳴的綠色永續純淨護理\n【廣告內文】我們相信企業能改變世界。標榜減碳原創、在地透明製程，為你的肌膚與地球帶來最純淨的護護。立即點擊閱讀我們的永續故事。`;
    }
}