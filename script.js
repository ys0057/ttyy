let DICTIONARY = {};
let UI_LANG = 'zh';
const SUBJECT_ATTRS = ["gender", "age", "species", "ethnicity", "body", "hairStyle", "hairColor", "outfit", "accessories", "pose", "expression"];

async function loadLibrary() {
    try {
        const res = await fetch('data.json');
        DICTIONARY = await res.json();
        setLanguage('zh');
        // 自動偵聽角色數量變化 [建議優化點]
        document.getElementById('numSubjects').addEventListener('input', renderForm);
    } catch (e) { console.error("Data Load Error", e); }
}

function setLanguage(lang) {
    UI_LANG = lang;
    updateUI();
}

function updateUI() {
    const t = UI_TEXT[UI_LANG];
    // 更新介面文字... (與原程式碼相同，略)
    renderForm();
}

function renderForm() {
    const container = document.getElementById('subjectsContainer');
    const num = parseInt(document.getElementById('numSubjects').value) || 0;
    const t = UI_TEXT[UI_LANG];
    
    // 效能優化：使用 DocumentFragment 減少重繪 [建議優化點]
    const fragment = document.createDocumentFragment();
    
    for(let i=0; i<num; i++) {
        const fieldset = document.createElement('fieldset');
        fieldset.innerHTML = `<legend>${t.legSub} ${i+1}</legend><div class="field-grid"></div>`;
        const grid = fieldset.querySelector('.field-grid');
        
        SUBJECT_ATTRS.forEach(attr => {
            const div = document.createElement('div');
            div.className = 'input-unit';
            div.innerHTML = `
                <label>${t.labels[attr] || attr}:</label>
                <input type="text" id="subject-${i}-${attr}" list="list-s${i}-${attr}" onchange="autoGenerate()">
                <datalist id="list-s${i}-${attr}"></datalist>
            `;
            grid.appendChild(div);
            // 立即渲染 datalist
            setTimeout(() => {
                const dl = document.getElementById(`list-s${i}-${attr}`);
                if (dl && DICTIONARY[attr]) {
                    dl.innerHTML = DICTIONARY[attr].map(item => `<option value="${item[UI_LANG]}"></option>`).join('');
                }
            }, 0);
        });
        fragment.appendChild(fieldset);
    }
    container.innerHTML = '';
    container.appendChild(fragment);
}

// 自動生成提示詞 (讓使用者改動時即時看到結果) [建議優化點]
function autoGenerate() {
    generatePrompt();
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
            subZh.push(`角色${i+1}: ${partsZ.join(', ')}`);
        }
    }
    
    const envE = ["location", "angle", "lighting", "quality"].map(k => getVal(k)).filter(v => v).join(', ');
    const en = `${getVal('genre')}, ${title}, ${getVal('vibe')}, ${subEn.join(' and ')}, ${envE}`;
    const zh = `【風格】${getVal('genre')}\n【主題】${title}\n【角色】${subZh.join(' | ')}`;

    displayResult(en, zh);
    saveHistory(en, zh);
}

// 綁定輸入框即時觸發
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', autoGenerate);
});