/**
 * AI Prompt Generator V8.5
 * 優化：提取全域常數、加入配件欄位、增強隨機邏輯
 */

let DICTIONARY = {};
let UI_LANG = 'zh';

// 角色屬性欄位，包含新增的 'accessories'
const SUBJECT_ATTRS = ["gender", "age", "species", "ethnicity", "body", "hairStyle", "hairColor", "outfit", "accessories", "pose", "expression"];

const UI_TEXT = {
    zh: {
        subtitle: "核心權重優化 | 包含配件支援",
        usage: "💡 步驟1.選擇或手動輸入條件 > 2.按下生成提示詞 > 3.複製並貼上到 AI 工具",
        btnUpdate: "更新配置",
        btnRandom: "✨ 隨機靈感 (Randomize All)",
        btnGenerate: "🚀 立即生成提示詞 (Generate)",
        legCore: "🎨 核心視覺 (Core Style)",
        legEnv: "📸 環境與攝影",
        legSub: "👤 角色設定 Subject",
        labelTitle: "1. 描述你的圖像主題 (Title):",
        labelNum: "👥 角色數量:",
        history: "📜 歷史紀錄 (點擊可載入結果)",
        labels: {
            genre: "2. 藝術風格", vibe: "3. 視覺氛圍", gender: "性別", age: "年齡層", 
            species: "物種", ethnicity: "族裔", hairStyle: "髮型", hairColor: "髮色", 
            body: "身材", outfit: "服裝", accessories: "配件", pose: "姿勢", 
            expression: "表情", angle: "視角", location: "地點", lighting: "光影", quality: "畫質"
        }
    },
    en: {
        subtitle: "Core Weight Optimized | Accessory Support",
        usage: "💡 Step 1. Select conditions > 2. Generate Prompt > 3. Copy and Paste",
        btnUpdate: "Update UI",
        btnRandom: "✨ Randomize All",
        btnGenerate: "🚀 Generate Prompt Now",
        legCore: "🎨 Core Style",
        legEnv: "📸 Environment & Camera",
        legSub: "👤 Subject Settings",
        labelTitle: "1. Image Topic (Title):",
        labelNum: "Subject Count:",
        history: "📜 History (Click to reload)",
        labels: {
            genre: "2. Art Genre", vibe: "3. Visual Vibe", gender: "Gender", age: "Age Group",
            species: "Species", ethnicity: "Ethnicity", hairStyle: "Hair Style", hairColor: "Hair Color",
            body: "Body Type", outfit: "Outfit", accessories: "Accessories", pose: "Pose", 
            expression: "Expression", angle: "Angle", location: "Location", lighting: "Lighting", quality: "Quality"
        }
    }
};

async function loadLibrary() {
    try {
        const res = await fetch('data.json');
        if(!res.ok) throw new Error("HTTP error " + res.status);
        DICTIONARY = await res.json();
        setLanguage('zh'); 
        renderHistory();
    } catch (e) { 
        console.error("資料載入失敗，請確認是否透過伺服器開啟 (http://)", e); 
        alert("無法讀取 data.json，請確保您正在使用 Web Server 開啟此專案。");
    }
}

function setLanguage(lang) {
    UI_LANG = lang;
    document.querySelectorAll('.lang-btn').forEach(b => {
        const text = b.innerText.toLowerCase();
        const isZh = text.includes('繁') || text.includes('zh');
        b.classList.toggle('active', (lang === 'zh' ? isZh : !isZh));
    });
    updateUI();
}

function updateUI() {
    const t = UI_TEXT[UI_LANG];
    const safeSetText = (id, text) => { const el = document.getElementById(id); if(el) el.innerText = text; };
    
    safeSetText('ui-subtitle', t.subtitle);
    safeSetText('ui-usage-tip', t.usage);
    safeSetText('btn-update', t.btnUpdate);
    safeSetText('randomizeBtn', t.btnRandom);
    safeSetText('ui-leg-core', t.legCore);
    safeSetText('ui-leg-env', t.legEnv);
    safeSetText('ui-label-title', t.labelTitle);
    safeSetText('ui-label-num', t.labelNum);
    safeSetText('ui-history-title', t.history);
    
    document.querySelector('.large-primary').innerText = t.btnGenerate;

    ["genre", "vibe", "angle", "location", "lighting", "quality"].forEach(k => {
        const labelEl = document.getElementById(`ui-label-${k}`);
        if(labelEl) labelEl.innerText = (t.labels[k] || k) + ":";
        renderDatalist(`list-${k}`, k);
        setupSmartInput(k);
    });
    renderForm();
}

function setupSmartInput(id) {
    const el = document.getElementById(id);
    if(!el) return;
    el.onfocus = () => { el.oldValue = el.value; el.value = ''; };
    el.onblur = () => { if(el.value === '') el.value = el.oldValue || ''; };
}

function renderDatalist(id, key) {
    const dl = document.getElementById(id);
    if (!dl || !DICTIONARY[key]) return;
    dl.innerHTML = DICTIONARY[key].map(i => `<option value="${i[UI_LANG]}"></option>`).join('');
}

function renderForm() {
    const container = document.getElementById('subjectsContainer');
    const numInput = document.getElementById('numSubjects');
    const num = parseInt(numInput.value) || 0;
    const t = UI_TEXT[UI_LANG];
    container.innerHTML = '';
    
    for(let i=0; i<num; i++) {
        const fieldset = document.createElement('fieldset');
        fieldset.innerHTML = `<legend>${t.legSub} ${i+1}</legend><div class="field-grid"></div>`;
        const grid = fieldset.querySelector('.field-grid');
        
        SUBJECT_ATTRS.forEach(attr => {
            const listId = `list-s${i}-${attr}`;
            const inputId = `subject-${i}-${attr}`;
            grid.innerHTML += `
                <div class="input-unit">
                    <label>${t.labels[attr] || attr}:</label>
                    <input type="text" id="${inputId}" list="${listId}" placeholder="...">
                    <datalist id="${listId}"></datalist>
                </div>
            `;
            // 非同步渲染清單以優化效能
            setTimeout(() => { 
                renderDatalist(listId, attr); 
                setupSmartInput(inputId); 
            }, 0);
        });
        container.appendChild(fieldset);
    }
}

function generatePrompt() {
    const getVal = (id) => document.getElementById(id)?.value || "";
    const title = getVal('title');
    const num = parseInt(document.getElementById('numSubjects').value) || 0;

    let subjectsEn = [];
    let subjectsZh = [];

    for(let i=0; i<num; i++){
        let subEn = [];
        let subZh = [];
        SUBJECT_ATTRS.forEach(a => {
            const inputEl = document.getElementById(`subject-${i}-${a}`);
            let val = inputEl ? inputEl.value : "";
            if(val) {
                const entry = DICTIONARY[a]?.find(item => item.en === val || item.zh === val);
                subEn.push(entry ? entry.en : val);
                subZh.push(entry ? entry.zh : val);
            }
        });
        // 核心邏輯：加上權重括號
        if(subEn.length) {
            subjectsEn.push("(1 " + subEn.join(', ') + ")");
            subjectsZh.push("1名 " + subZh.join(', '));
        }
    }
    
    const genre = getVal('genre');
    const vibe = getVal('vibe');
    const genreEntry = DICTIONARY.genre?.find(i => i.en === genre || i.zh === genre);
    const vibeEntry = DICTIONARY.vibe?.find(i => i.en === vibe || i.zh === vibe);
    
    const envEn = ["location", "angle", "lighting", "quality"].map(k => getVal(k)).filter(v => v).join(', ');
    const envZh = ["location", "angle", "lighting", "quality"].map(k => getVal(k)).filter(v => v).join(' / ');

    let en = `${genreEntry?.en || genre}, ${title}, ${vibeEntry?.en || vibe}`;
    if(subjectsEn.length) en += `, ${subjectsEn.join(' and ')}`;
    if(envEn) en += `, ${envEn}`;

    let zh = `【風格】${genreEntry?.zh || genre}\n【主題】${title}\n【氛圍】${vibeEntry?.zh || vibe}`;
    if(subjectsZh.length) zh += `\n【角色】${subjectsZh.join(' 與 ')}`;
    if(envZh) zh += `\n【環境】${envZh}`;

    displayOutput(en, zh);
    saveHistory(en, zh);
    
    // 生成後自動滾動至結果
    document.querySelector('.output-side').scrollIntoView({ behavior: 'smooth' });
}

document.getElementById('randomizeBtn').onclick = () => {
    const mainKeys = ["genre", "vibe", "angle", "location", "lighting", "quality"];
    mainKeys.forEach(k => {
        const items = DICTIONARY[k];
        if(items) document.getElementById(k).value = items[Math.floor(Math.random()*items.length)][UI_LANG];
    });
    
    const num = parseInt(document.getElementById('numSubjects').value) || 0;
    for(let i=0; i<num; i++){
        SUBJECT_ATTRS.forEach(a => {
            const items = DICTIONARY[a];
            const input = document.getElementById(`subject-${i}-${a}`);
            if(items && input) input.value = items[Math.floor(Math.random()*items.length)][UI_LANG];
        });
    }
    generatePrompt();
};

function displayOutput(en, zh) {
    document.getElementById('out-en').innerText = en;
    document.getElementById('out-zh').innerText = zh;
    document.getElementById('out-json').innerText = JSON.stringify({ en, zh }, null, 2);
}

function saveHistory(en, zh) {
    let history = JSON.parse(localStorage.getItem('app_history') || '[]');
    if (history.length > 0 && history[0].en === en) return;
    history.unshift({ time: new Date().toLocaleTimeString(), en, zh });
    localStorage.setItem('app_history', JSON.stringify(history.slice(0, 10)));
    renderHistory();
}

function renderHistory() {
    const list = document.getElementById('historyList');
    if(!list) return;
    const history = JSON.parse(localStorage.getItem('app_history') || '[]');
    list.innerHTML = history.map((item, index) => `
        <div class="history-item" onclick="loadFromHistory(${index})">
            <small class="history-time">${item.time}</small>
            <div class="history-prompt">${item.en.substring(0, 60)}...</div>
        </div>
    `).join('');
}

function loadFromHistory(index) {
    const history = JSON.parse(localStorage.getItem('app_history') || '[]');
    if(history[index]) {
        displayOutput(history[index].en, history[index].zh);
        const outBox = document.getElementById('out-en');
        outBox.style.backgroundColor = '#fff9c4'; 
        setTimeout(() => outBox.style.backgroundColor = '', 500);
    }
}

function clearHistory() {
    localStorage.removeItem('app_history');
    renderHistory();
}

function copyText(id) {
    const text = document.getElementById(id).innerText;
    navigator.clipboard.writeText(text).then(() => {
        const btn = event.target;
        const oldText = btn.innerText;
        btn.innerText = "✅ 已複製";
        setTimeout(() => btn.innerText = oldText, 1000);
    });
}

window.onload = loadLibrary;