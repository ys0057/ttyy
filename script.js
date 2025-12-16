// --- 1. 大量專業詞庫 (Massive Professional Dictionary) ---
// 格式: { en: "Prompt Term", zh: "中文顯示名稱 (選單用)" }
const DICTIONARY = {
    // 風格
    "genre": [
        {en: "Cyberpunk 2077 style", zh: "賽博龐克 2077"},
        {en: "Steampunk aesthetic", zh: "蒸氣龐克"},
        {en: "Studio Ghibli anime style", zh: "吉卜力動漫風"},
        {en: "Makoto Shinkai style", zh: "新海誠光影風"},
        {en: "80s Synthwave vaporwave", zh: "80年代合成波/蒸汽波"},
        {en: "Hyper-realistic photography", zh: "超寫實攝影"},
        {en: "National Geographic photo", zh: "國家地理雜誌風格"},
        {en: "Unreal Engine 5 render", zh: "UE5 3D渲染"},
        {en: "Oil painting by Van Gogh", zh: "梵谷印象派油畫"},
        {en: "Ukiyo-e traditional art", zh: "日本浮世繪"},
        {en: "Noir film style", zh: "黑色電影風格"},
        {en: "Pixar 3D animation", zh: "皮克斯 3D 動畫"},
        {en: "Concept art sketches", zh: "概念藝術草圖"}
    ],
    // 氛圍
    "vibe": [
        {en: "Dystopian and gritty", zh: "反烏托邦/粗糙感"},
        {en: "Ethereal and dreamy", zh: "空靈夢幻"},
        {en: "Dark and ominous", zh: "黑暗不祥"},
        {en: "Vibrant and energetic", zh: "充滿活力色彩"},
        {en: "Peaceful and serene", zh: "寧靜祥和"},
        {en: "Mysterious and foggy", zh: "神秘迷霧"},
        {en: "Romantic and soft", zh: "浪漫柔和"},
        {en: "Chaos and destruction", zh: "混亂毀滅"}
    ],
    // 畫質
    "quality": [
        {en: "8k resolution, highly detailed", zh: "8K 解析度/極致細節"},
        {en: "Masterpiece, award winning", zh: "傑作/獲獎作品"},
        {en: "Photorealistic, raw photo", zh: "照片級真實/Raw檔"},
        {en: "HDR, sharp focus", zh: "HDR 高動態範圍/對焦清晰"}
    ],
    // 光線
    "lighting": [
        {en: "Cinematic lighting", zh: "電影級打光"},
        {en: "Volumetric Tyndall effect", zh: "體積光/丁達爾效應(耶穌光)"},
        {en: "Golden hour sunlight", zh: "黃昏金黃時刻"},
        {en: "Blue hour cold tones", zh: "藍調時刻/冷色調"},
        {en: "Rim lighting", zh: "邊緣光/輪廓光"},
        {en: "Butterfly lighting", zh: "蝴蝶光 (人像美膚)"},
        {en: "Rembrandt lighting", zh: "林布蘭光 (三角光)"},
        {en: "Neon flickering lights", zh: "霓虹閃爍光"},
        {en: "Bioluminescent glow", zh: "生物發光 (螢光)"},
        {en: "Softbox studio lighting", zh: "攝影棚柔光箱"},
        {en: "Harsh shadows, noir", zh: "強烈陰影 (黑色電影)"}
    ],
    // 鏡頭角度
    "angle": [
        {en: "Eye-level shot", zh: "水平視角"},
        {en: "Low angle hero shot", zh: "低角度仰拍 (英雄感)"},
        {en: "High angle bird's eye view", zh: "高角度鳥瞰"},
        {en: "Dutch angle", zh: "荷蘭式傾斜 (不安感)"},
        {en: "Over-the-shoulder shot", zh: "過肩鏡頭"},
        {en: "Selfie angle", zh: "自拍視角"},
        {en: "Macro close-up", zh: "微距特寫"}
    ],
    // 鏡頭規格
    "lens": [
        {en: "35mm cinematic lens", zh: "35mm 電影鏡頭 (人文)"},
        {en: "85mm f/1.8 portrait lens", zh: "85mm 人像大光圈"},
        {en: "200mm telephoto lens", zh: "200mm 長焦鏡頭 (壓縮感)"},
        {en: "Fisheye lens", zh: "魚眼鏡頭"},
        {en: "Wide-angle lens", zh: "廣角鏡頭"},
        {en: "Bokeh background", zh: "背景虛化 (散景)"}
    ],
    // 地點
    "location": [
        {en: "Neon cyberpunk street", zh: "賽博龐克霓虹街道"},
        {en: "Abandoned spaceship corridor", zh: "廢棄太空船走廊"},
        {en: "Magical ancient forest", zh: "魔法古老森林"},
        {en: "Futuristic utopian city", zh: "未來烏托邦城市"},
        {en: "Cozy coffee shop interior", zh: "溫馨咖啡廳內部"},
        {en: "Post-apocalyptic ruins", zh: "末日廢墟"},
        {en: "Underwater coral reef", zh: "水下珊瑚礁"},
        {en: "Snowy mountain peak", zh: "雪山山頂"},
        {en: "Desert dunes at sunset", zh: "日落沙漠沙丘"}
    ],
    // --- 角色相關 ---
    "ethnicity": [
        {en: "East Asian", zh: "東亞裔"}, {en: "Japanese", zh: "日本人"},
        {en: "Nordic Caucasian", zh: "北歐白人"}, {en: "African", zh: "非洲裔"},
        {en: "Latina", zh: "拉丁裔"}, {en: "Elf", zh: "精靈族"},
        {en: "Cyborg", zh: "生化人"}, {en: "Robot", zh: "機器人"},
        {en: "Orc", zh: "半獸人"}, {en: "Angel", zh: "天使"}
    ],
    "gender": [
        {en: "woman", zh: "女性"}, {en: "man", zh: "男性"},
        {en: "girl", zh: "女孩"}, {en: "boy", zh: "男孩"},
        {en: "non-binary", zh: "非二元性別"}, {en: "android", zh: "人造人"}
    ],
    "body": [
        {en: "slim and elegant", zh: "苗條優雅"},
        {en: "muscular and ripped", zh: "肌肉發達"},
        {en: "curvy hourglass figure", zh: "豐滿曲線"},
        {en: "petite and cute", zh: "嬌小可愛"},
        {en: "tall and lanky", zh: "瘦高"},
        {en: "chubby", zh: "圓潤"},
        {en: "cybernetic body parts", zh: "機械義肢身體"}
    ],
    "pose": [
        {en: "standing confidently", zh: "自信站立"},
        {en: "sitting on a throne", zh: "坐在寶座上"},
        {en: "dynamic action pose", zh: "動態戰鬥姿勢"},
        {en: "looking back over shoulder", zh: "回眸看鏡頭"},
        {en: "floating in mid-air", zh: "漂浮在空中"},
        {en: "kneeling down", zh: "單膝跪地"},
        {en: "running towards camera", zh: "跑向鏡頭"},
        {en: "lying on the grass", zh: "躺在草地上"}
    ],
    "outfit": [
        {en: "futuristic techwear suit", zh: "未來機能風套裝"},
        {en: "cyberpunk leather jacket", zh: "賽博皮革外套"},
        {en: "victorian gothic dress", zh: "維多利亞哥德長裙"},
        {en: "tactical military armor", zh: "戰術軍事裝甲"},
        {en: "casual hoodie and jeans", zh: "休閒帽T牛仔褲"},
        {en: "traditional japanese kimono", zh: "傳統日本和服"},
        {en: "elegant evening gown", zh: "優雅晚禮服"},
        {en: "wizard robe", zh: "巫師長袍"},
        {en: "office business suit", zh: "商務西裝"}
    ],
    "expression": [
        {en: "expressionless", zh: "無表情/冷酷"},
        {en: "smiling warmly", zh: "溫暖微笑"},
        {en: "smirking mysteriously", zh: "神秘壞笑"},
        {en: "crying with tears", zh: "哭泣流淚"},
        {en: "angry and shouting", zh: "憤怒吼叫"},
        {en: "surprised wide eyes", zh: "驚訝睜大眼"},
        {en: "closed eyes sleeping", zh: "閉眼睡覺"},
        {en: "seductive look", zh: "誘惑神情"}
    ]
};

// 介面翻譯對照
const LABELS = { 
    "ethnicity": "種族", "gender": "性別", "body": "體型", 
    "pose": "姿勢", "outfit": "服裝", "expression": "表情" 
};

// --- 2. 初始化與工具函數 ---

// 初始化 Datalist (將詞庫填入下拉選單)
function initDatalists() {
    // 處理一般欄位
    ["genre", "vibe", "quality", "location", "lighting", "angle", "lens"].forEach(key => {
        createDatalist(`list-${key}`, DICTIONARY[key]);
    });
}

function createDatalist(id, items) {
    const dl = document.getElementById(id);
    if(!dl) return;
    dl.innerHTML = items.map(item => `<option value="${item.en}">${item.zh}</option>`).join('');
}

// 渲染角色表單 (同時創建該角色的 Datalist)
function renderForm() {
    const container = document.getElementById('subjectsContainer');
    const num = document.getElementById('numSubjects').value;
    container.innerHTML = '';

    const attrs = ["ethnicity", "gender", "body", "pose", "outfit", "expression"];
    
    for(let i=0; i<num; i++) {
        const fieldset = document.createElement('fieldset');
        fieldset.innerHTML = `<legend>👤 角色 Subject ${i+1}</legend><div class="field-grid"></div>`;
        const grid = fieldset.querySelector('.field-grid');
        
        attrs.forEach(attr => {
            const listId = `list-s${i}-${attr}`;
            const inputId = `subject-${i}-${attr}`;
            
            grid.innerHTML += `
                <div class="input-unit">
                    <label>${LABELS[attr]}:</label>
                    <div class="input-wrap">
                        <input type="text" id="${inputId}" list="${listId}" placeholder="選填...">
                        <datalist id="${listId}"></datalist>
                        <button type="button" class="dice-btn" onclick="roll('${inputId}')">🎲</button>
                    </div>
                </div>
            `;
            // 延遲填充 datalist 選項
            setTimeout(() => createDatalist(listId, DICTIONARY[attr]), 0);
        });
        container.appendChild(fieldset);
    }
}

// --- 3. 核心邏輯：隨機與生成 ---

// 隨機單一欄位
function roll(targetId) {
    // 判斷 targetId 是欄位 ID (subject-0-pose) 還是類別 Key (genre)
    let key = targetId;
    if(targetId.includes('subject')) {
        key = targetId.split('-').pop(); // 取得 pose, outfit 等
    }
    
    // 如果是 ID，獲取 DOM 元素
    const el = document.getElementById(targetId);
    
    if (DICTIONARY[key] && el) {
        const randomItem = DICTIONARY[key][Math.floor(Math.random() * DICTIONARY[key].length)];
        el.value = randomItem.en; // 填入英文
    }
}

// 全域隨機
document.getElementById('randomizeBtn').onclick = () => {
    // 隨機一般欄位
    ["genre", "vibe", "quality", "location", "lighting", "angle", "lens"].forEach(key => roll(key));
    // 隨機角色欄位
    const inputs = document.querySelectorAll('input[id^="subject-"]');
    inputs.forEach(input => roll(input.id));
    
    // 自動提交生成
    generatePrompt();
};

// 反查中文 (Reverse Lookup)
function findChinese(key, enValue) {
    if(!enValue) return "";
    // 嘗試在字典中找到對應的英文，回傳中文
    const found = DICTIONARY[key]?.find(item => item.en.toLowerCase() === enValue.toLowerCase());
    return found ? found.zh : enValue; // 找不到則回傳原值 (使用者自定義輸入)
}

// 生成 Prompt 主函數
function generatePrompt(e) {
    if(e) e.preventDefault();
    
    const data = {
        metadata: { timestamp: new Date().toLocaleString() },
        title: document.getElementById('title').value,
        prompt: "",
        chinese_ref: [],
        raw_json: {}
    };

    let enParts = [];
    let zhParts = [];

    // 1. 處理 Title
    if(data.title) {
        // Title 通常不放入 Prompt 核心關鍵字，但可放在最前
        // enParts.push(data.title); 
        zhParts.push(`【標題】${data.title}`);
    }

    // 2. 處理角色
    const num = document.getElementById('numSubjects').value;
    let subjectsArr = [];
    for(let i=0; i<num; i++) {
        let sEn = [];
        let sZh = [];
        let sObj = {};
        
        ["ethnicity", "gender", "body", "outfit", "pose", "expression"].forEach(attr => {
            const val = document.getElementById(`subject-${i}-${attr}`).value;
            if(val) {
                sEn.push(val);
                const zhVal = findChinese(attr, val);
                sZh.push(zhVal);
                sObj[attr] = { en: val, zh: zhVal };
            }
        });

        if(sEn.length > 0) {
            const charPrompt = sEn.join(", ");
            enParts.push(charPrompt);
            subjectsArr.push(charPrompt);
            zhParts.push(`【角色 ${i+1}】${sZh.join(", ")}`);
            data.raw_json[`subject_${i+1}`] = sObj;
        }
    }
    // 角色間用 AND 連接 (某些 AI 支援) 或逗號
    if(subjectsArr.length > 1) {
        // 若只有逗號連接，其實已經在 enParts 處理了，這裡為了邏輯清晰
    }

    // 3. 處理環境與風格
    ["location", "lighting", "genre", "vibe", "angle", "lens", "quality"].forEach(key => {
        const val = document.getElementById(key).value;
        if(val) {
            enParts.push(val);
            const zhVal = findChinese(key, val);
            zhParts.push(`【${key}】${zhVal}`);
            data.raw_json[key] = { en: val, zh: zhVal };
        }
    });

    // 組合最終結果
    data.prompt = enParts.join(", ");
    const zhText = zhParts.join("\n");

    // 顯示到 UI
    document.getElementById('out-en').textContent = data.prompt;
    document.getElementById('out-zh').textContent = zhText;
    document.getElementById('out-json').textContent = JSON.stringify(data.raw_json, null, 2);

    // 存入歷史
    saveHistory(data.prompt, zhText);
}

// --- 4. 歷史紀錄功能 ---
function saveHistory(en, zh) {
    if(!en) return;
    let history = JSON.parse(localStorage.getItem('v5_history') || '[]');
    history.unshift({ time: new Date().toLocaleTimeString(), en: en, zh: zh });
    if(history.length > 10) history.pop();
    localStorage.setItem('v5_history', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    const list = document.getElementById('historyList');
    const history = JSON.parse(localStorage.getItem('v5_history') || '[]');
    list.innerHTML = history.map((item, index) => `
        <div class="history-item">
            <div class="history-meta">
                <span>🕒 ${item.time}</span>
                <button class="copy-btn" onclick="copyTextH('${index}')">複製</button>
            </div>
            <div class="history-prompt">${item.en}</div>
            <input type="hidden" id="h-${index}" value="${item.en}">
        </div>
    `).join('');
}

function clearHistory() {
    localStorage.removeItem('v5_history');
    renderHistory();
}

function copyTextH(index) {
    const val = document.getElementById(`h-${index}`).value;
    navigator.clipboard.writeText(val).then(() => alert("已複製歷史紀錄"));
}

// 通用複製
function copyText(id) {
    const text = document.getElementById(id).textContent;
    navigator.clipboard.writeText(text).then(() => alert("已複製內容"));
}

// 綁定表單提交
document.getElementById('promptForm').addEventListener('submit', generatePrompt);

// 頁面載入執行
document.addEventListener('DOMContentLoaded', () => {
    initDatalists();
    renderForm();
    renderHistory();
});