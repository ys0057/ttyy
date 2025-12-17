let currentMode = 'character';
let generatorData = {};

// 載入 JSON 資料
async function loadData() {
    try {
        const response = await fetch('./data.json');
        generatorData = await response.json();
        console.log("資料載入成功");
    } catch (err) {
        console.error("無法載入 data.json，請確保檔案存在且格式正確", err);
    }
}

// 切換模式
function switchMode(mode) {
    currentMode = mode;
    // 更新 UI 狀態
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    const data = generatorData[mode];
    document.getElementById('mode-title').innerText = data.title;
    
    // 更新註解引導
    const helper = document.getElementById('appearance-helper');
    helper.innerText = (mode === 'scene') 
        ? "💡 參考：環境氛圍、光影、天氣狀態" 
        : "💡 參考：頭髮(顏色、髮型)、身材、皮膚";
        
    clearInputs();
}

// 動態增加欄位
function addDetailField() {
    const container = document.getElementById('detail-container');
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'detail-input';
    input.placeholder = '新增細節...';
    input.style.marginTop = '8px';
    input.oninput = updateOutput;
    container.appendChild(input);
}

// 全域隨機生成
function generateRandom() {
    if (!generatorData[currentMode]) return;
    
    const data = generatorData[currentMode];
    const randomStyle = data.style[Math.floor(Math.random() * data.style.length)];
    const randomApp = data.appearance[Math.floor(Math.random() * data.appearance.length)];
    
    document.getElementById('input-style').value = randomStyle;
    document.getElementById('input-appearance').value = randomApp;
    
    // 清空並隨機一個細節
    const detailContainer = document.getElementById('detail-container');
    detailContainer.innerHTML = '';
    const firstInput = document.createElement('input');
    firstInput.className = 'detail-input';
    firstInput.oninput = updateOutput;
    firstInput.value = data.details[Math.floor(Math.random() * data.details.length)];
    detailContainer.appendChild(firstInput);
    
    updateOutput();
}

// 組合輸出字串
function updateOutput() {
    const style = document.getElementById('input-style').value;
    const appearance = document.getElementById('input-appearance').value;
    const details = Array.from(document.querySelectorAll('.detail-input'))
                         .map(i => i.value.trim())
                         .filter(v => v !== "");
    
    let result = [];
    if (style) result.push(style);
    if (appearance) result.push(appearance);
    if (details.length > 0) result.push(details.join(', '));
    
    const outputElement = document.getElementById('output-text');
    outputElement.innerText = result.length > 0 ? result.join(', ') : "等待輸入中...";
}

// 清除輸入
function clearInputs() {
    document.getElementById('input-style').value = "";
    document.getElementById('input-appearance').value = "";
    document.getElementById('detail-container').innerHTML = '<input type="text" class="detail-input" placeholder="例如：刺青、配件..." oninput="updateOutput()">';
    document.getElementById('output-text').innerText = "等待輸入中...";
}

// 執行載入
loadData();