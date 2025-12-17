// --- 1. 全域變數與繁體中文配置 ---
let DICTIONARY = {}; 

const LABELS = { 
    "gender": "性別", "age": "年齡層", "species": "物種", 
    "ethnicity": "族裔/膚色", "hairStyle": "髮型", 
    "hairColor": "髮色", "body": "身材", "pose": "姿勢", 
    "outfit": "服裝", "expression": "表情" 
};

const HINTS = {
    "gender": "女性、男性", "age": "兒童、青年、中年", 
    "species": "人類、精靈、機器人", "ethnicity": "東亞裔、白人、非洲裔",
    "hairStyle": "如：長直髮、馬尾", "hairColor": "如：烏黑、自然紅髮",
    "body": "如：普通身材、苗條", "pose": "如：自然站立、跑步", 
    "outfit": "如：休閒服、醫師制服", "expression": "如：暖心微笑、冷酷"
};

// --- 2. 載入詞庫 ---
async function loadLibrary() {
    try {
        const response = await fetch('data.json');
        DICTIONARY = await response.json();
        initGlobalDatalists();
        renderForm();
    } catch (error) {
        console.error("載入失敗:", error);
        alert("無法載入 data.json，請確認檔案路徑。");
    }
}

function initGlobalDatalists() {
    ["genre", "vibe", "quality", "location", "lighting", "angle"].forEach(key => {
        createDatalist(`list-${key}`, DICTIONARY[key]);
    });
}

function createDatalist(id, items) {
    const dl = document.getElementById(id);
    if(!dl || !items) return;
    dl.innerHTML = items.map(item => `<option value="${item.en}">${item.zh}</option>`).join('');
}

function renderForm() {
    const container = document.getElementById('subjectsContainer');
    const num = document.getElementById('numSubjects').value;
    container.innerHTML = '';
    
    // 欄位順序優化
    const attrs = ["gender", "age", "species", "ethnicity", "body", "hairStyle", "hairColor", "outfit", "pose", "expression"];
    
    for(let i=0; i<num; i++) {
        const fieldset = document.createElement('fieldset');
        fieldset.innerHTML = `<legend>👤 角色設定 Subject ${i+1}</legend><div class="field-grid"></div>`;
        const grid = fieldset.querySelector('.field-grid');
        
        attrs.forEach(attr => {
            const listId = `list-s${i}-${attr}`;
            const inputId = `subject-${i}-${attr}`;
            grid.innerHTML += `
                <div class="input-unit">
                    <label>${LABELS[attr]}:</label>
                    <input type="text" id="${inputId}" list="${listId}" placeholder="可選填...">
                    <datalist id="${listId}"></datalist>
                    <span class="hint">${HINTS[attr]}</span>
                </div>
            `;
            if (DICTIONARY[attr]) {
                setTimeout(() => createDatalist(listId, DICTIONARY[attr]), 0);
            }
        });
        container.appendChild(fieldset);
    }
}

// 隨機生成與提示詞組裝邏輯 (簡化呈現，實際需包含 prompt 組合)
document.getElementById('randomizeBtn').onclick = () => {
    ["genre", "vibe", "quality", "location", "lighting", "angle"].forEach(k => roll(k));
    document.querySelectorAll('input[id^="subject-"]').forEach(input => roll(input.id));
    generatePrompt();
};

function roll(targetId) {
    let key = targetId.includes('subject') ? targetId.split('-').pop() : targetId;
    const el = document.getElementById(targetId);
    if (DICTIONARY[key] && el) {
        const items = DICTIONARY[key];
        el.value = items[Math.floor(Math.random() * items.length)].en;
    }
}

window.onload = loadLibrary;