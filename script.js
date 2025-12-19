let DICTIONARY = {};
let UI_LANG = 'zh';

const SUBJECT_ATTRS = ["gender", "age", "species", "ethnicity", "body", "hairStyle", "hairColor", "outfit", "accessories", "pose", "expression"];

const UI_TEXT = {
    zh: {
        subtitle: "人像提示詞輔助生成器",
        usage: "💡 1. 選擇條件或自行輸入(盡可能詳細描述) > 2. 生成提示詞並複製 > 3.選擇生成式工具貼上。",
        btnUpdate: "更新配置", btnRandom: "✨ 隨機靈感 (Randomize All)", btnGenerate: "🚀 立即生成提示詞 (Generate)", btnReset: "🗑️ 清空重製",
        legCore: "🎨 核心視覺 (Core Style)", legEnv: "📸 環境與攝影", legSub: "👤 角色設定 Subject",
        labelTitle: "1. 描述你的圖像主題 (Title):", labelNum: "👥 角色數量:", history: "📜 歷史紀錄 (點擊可回載結果)",
        labels: {
            genre: "2. 藝術風格", vibe: "3. 視覺氛圍", gender: "性別", age: "年齡層", 
            species: "物種", ethnicity: "族裔", hairStyle: "髮型", hairColor: "髮色", 
            body: "身材", outfit: "服裝", accessories: "配件", pose: "姿勢", 
            expression: "表情", angle: "視角", location: "地點", lighting: "光影", quality: "畫質"
        }
    },
    en: {
        subtitle: "Core Weight Optimized | History Loading",
        usage: "💡 1. Select > 2. Generate > 3. Click history items to reload results.",
        btnUpdate: "Update UI", btnRandom: "✨ Randomize All", btnGenerate: "🚀 Generate Now", btnReset: "🗑️ Reset All",
        legCore: "🎨 Core Style", legEnv: "📸 Environment", legSub: "👤 Subject Settings",
        labelTitle: "1. Image Topic (Title):", labelNum: "Subjects:", history: "📜 History (Click to reload)",
        labels: {
            genre: "Style", vibe: "Vibe", gender: "Gender", age: "Age",
            species: "Species", ethnicity: "Ethnicity", hairStyle: "Hair", hairColor: "Color",
            body: "Body", outfit: "Outfit", accessories: "Accessories", pose: "Pose", 
            expression: "Expression", angle: "Angle", location: "Location", lighting: "Lighting", quality: "Quality"
        }
    }
};

async function loadLibrary() {
    try {
        const res = await fetch('data.json');
        DICTIONARY = await res.json();
        setLanguage('zh'); 
        renderHistory();
    } catch (e) { console.error("Data Load Error", e); }
}

function setLanguage(lang) {
    UI_LANG = lang;
    updateUI();
}

function updateUI() {
    const t = UI_TEXT[UI_LANG];
    const safeSetText = (id, text) => { if(document.getElementById(id)) document.getElementById(id).innerText = text; };
    safeSetText('ui-subtitle', t.subtitle);
    safeSetText('ui-usage-tip', t.usage);
    safeSetText('btn-update', t.btnUpdate);
    safeSetText('randomizeBtn', t.btnRandom);
    safeSetText('btn-reset', t.btnReset);
    safeSetText('ui-leg-core', t.legCore);
    safeSetText('ui-leg-env', t.legEnv);
    safeSetText('ui-label-title', t.labelTitle);
    safeSetText('ui-label-num', t.labelNum);
    safeSetText('ui-history-title', t.history);
    
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', (b.innerText.includes('繁') && UI_LANG==='zh') || (b.innerText==='EN' && UI_LANG==='en')));

    ["genre", "vibe", "angle", "location", "lighting", "quality"].forEach(k => {
        const labelEl = document.getElementById(`ui-label-${k}`);
        if(labelEl) labelEl.innerText = (t.labels[k] || k) + ":";
        renderDatalist(`list-${k}`, k);
    });
    renderForm();
}

function renderDatalist(id, key) {
    const dl = document.getElementById(id);
    if (!dl || !DICTIONARY[key]) return;
    dl.innerHTML = DICTIONARY[key].map(i => `<option value="${i[UI_LANG]}"></option>`).join('');
}

function renderForm() {
    const container = document.getElementById('subjectsContainer');
    const num = parseInt(document.getElementById('numSubjects').value) || 0;
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
                    <input type="text" id="${inputId}" list="${listId}" onfocus="this.oldV=this.value;this.value=''" onblur="if(this.value==='')this.value=this.oldV||''">
                    <datalist id="${listId}"></datalist>
                </div>
            `;
            setTimeout(() => renderDatalist(listId, attr), 0);
        });
        container.appendChild(fieldset);
    }
}

function resetAllFields() {
    if (confirm("確定要清空所有內容嗎？")) {
        document.getElementById('promptForm').reset();
        document.getElementById('numSubjects').value = 1;
        renderForm();
        document.getElementById('out-en').innerText = '...';
        document.getElementById('out-zh').innerText = '...';
        document.getElementById('out-json').innerText = '{}';
    }
}

function generatePrompt() {
    const getVal = (id) => document.getElementById(id)?.value || "";
    const title = getVal('title');
    const num = parseInt(document.getElementById('numSubjects').value) || 0;

    let subEn = [], subZh = [];
    for(let i=0; i<num; i++){
        let partsE = [], partsZ = [];
        SUBJECT_ATTRS.forEach(a => {
            const v = getVal(`subject-${i}-${a}`);
            if(v) {
                const item = DICTIONARY[a]?.find(x => x.en === v || x.zh === v);
                partsE.push(item ? item.en : v);
                partsZ.push(item ? item.zh : v);
            }
        });
        if(partsE.length) {
            subEn.push(`(1 ${partsE.join(', ')})`);
            subZh.push(`1名 ${partsZ.join(', ')}`);
        }
    }
    
    const envE = ["location", "angle", "lighting", "quality"].map(k => getVal(k)).filter(v => v).join(', ');
    const en = `${getVal('genre')}, ${title}, ${getVal('vibe')}, ${subEn.join(' and ')}, ${envE}`;
    const zh = `【風格】${getVal('genre')}\n【主題】${title}\n【氛圍】${getVal('vibe')}\n【角色】${subZh.join(' 與 ')}`;

    displayResult(en, zh);
    saveHistory(en, zh);
}

// 統一顯示結果的函數
function displayResult(en, zh) {
    document.getElementById('out-en').innerText = en;
    document.getElementById('out-zh').innerText = zh;
    document.getElementById('out-json').innerText = JSON.stringify({ en, zh }, null, 2);
}

document.getElementById('randomizeBtn').onclick = () => {
    ["genre", "vibe", "angle", "location", "lighting", "quality"].forEach(k => {
        const items = DICTIONARY[k];
        if(items) document.getElementById(k).value = items[Math.floor(Math.random()*items.length)][UI_LANG];
    });
    const num = parseInt(document.getElementById('numSubjects').value) || 0;
    for(let i=0; i<num; i++){
        SUBJECT_ATTRS.forEach(a => {
            const items = DICTIONARY[a];
            if(items) document.getElementById(`subject-${i}-${a}`).value = items[Math.floor(Math.random()*items.length)][UI_LANG];
        });
    }
    generatePrompt();
};

function copyText(id) {
    const el = document.getElementById(id);
    navigator.clipboard.writeText(el.innerText).then(() => {
        const btn = event.target;
        btn.innerText = "✅ 已複製";
        el.classList.add('flash-active');
        setTimeout(() => { btn.innerText = "📋 複製"; el.classList.remove('flash-active'); }, 1200);
    });
}

function saveHistory(en, zh) {
    let history = JSON.parse(localStorage.getItem('app_history') || '[]');
    if(history.length > 0 && history[0].en === en) return;
    history.unshift({ time: new Date().toLocaleTimeString(), en, zh });
    localStorage.setItem('app_history', JSON.stringify(history.slice(0, 10)));
    renderHistory();
}

// 渲染歷史紀錄並綁定載入功能
function renderHistory() {
    const list = document.getElementById('historyList');
    const history = JSON.parse(localStorage.getItem('app_history') || '[]');
    list.innerHTML = history.map((item, index) => `
        <div class="history-item" onclick="loadHistoryItem(${index})">
            <small class="history-time">${item.time}</small>
            <div class="history-prompt">${item.en.substring(0, 50)}...</div>
        </div>
    `).join('');
}

// 實作歷史紀錄載入
function loadHistoryItem(index) {
    const history = JSON.parse(localStorage.getItem('app_history') || '[]');
    const item = history[index];
    if(item) {
        displayResult(item.en, item.zh);
        const outBox = document.getElementById('out-en');
        outBox.style.backgroundColor = '#ecfdf5';
        setTimeout(() => outBox.style.backgroundColor = '', 600);
    }
}

function clearHistory() { localStorage.removeItem('app_history'); renderHistory(); }

window.onload = loadLibrary;