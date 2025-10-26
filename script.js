// 3連スロットアプリのJavaScript

const items = ["🍎", "🍌", "🍇", "🍒", "🍋", "⭐"];

// 各スロットの状態管理
const slots = [
    { id: 1, element: null, spinning: false, currentPosition: 0, speed: 0 },
    { id: 2, element: null, spinning: false, currentPosition: 0, speed: 0 },
    { id: 3, element: null, spinning: false, currentPosition: 0, speed: 0 }
];

let allStoppedResults = [];
let isReach = false;

// DOM要素の取得
const startButton = document.getElementById('startButton');
const stopButtons = [
    document.getElementById('stopButton1'),
    document.getElementById('stopButton2'),
    document.getElementById('stopButton3')
];
const resultDiv = document.getElementById('result');
const reachDisplay = document.getElementById('reachDisplay');
const slotWindows = [
    document.querySelector('.slot-container:nth-child(1) .slot-window'),
    document.querySelector('.slot-container:nth-child(2) .slot-window'),
    document.querySelector('.slot-container:nth-child(3) .slot-window')
];

// スロット要素を取得
slots.forEach((slot, index) => {
    slot.element = document.getElementById(`slot${index + 1}`);
});

// レバーを押すボタンのイベント
startButton.addEventListener('click', startAllSlots);

// 各ストップボタンのイベント
stopButtons.forEach((button, index) => {
    button.addEventListener('click', () => stopSlot(index));
});

// 全スロット開始
function startAllSlots() {
    startButton.disabled = true;
    resultDiv.innerHTML = '';
    allStoppedResults = [];
    isReach = false;

    // リーチ演出をリセット
    hideReachEffect();

    slots.forEach((slot, index) => {
        slot.spinning = true;
        slot.speed = 30;
        stopButtons[index].disabled = false;

        // スロットにアイテムを複製して無限スクロール効果を作る
        initSlot(slot.element);

        // CSSアニメーションを追加
        slot.element.classList.add('spinning');
    });
}

// 個別スロット停止
function stopSlot(index) {
    const slot = slots[index];
    if (!slot.spinning) return;

    stopButtons[index].disabled = true;

    // CSSアニメーションを停止
    slot.element.classList.remove('spinning');

    // ランダムな位置で停止（各アイテムは150px）
    const randomIndex = Math.floor(Math.random() * items.length);
    const finalPosition = -(randomIndex * 150);

    slot.element.style.transform = `translateY(${finalPosition}px)`;
    slot.spinning = false;

    // 停止した結果を記録
    allStoppedResults[index] = items[randomIndex];

    // リーチ判定（2つ停止した時点でチェック）
    checkReach();

    // 全スロットが停止したかチェック
    checkAllStopped();
}

// 全スロットが停止したかチェック
function checkAllStopped() {
    const allStopped = slots.every(slot => !slot.spinning);

    if (allStopped && allStoppedResults.length === 3) {
        // リーチ演出を非表示
        hideReachEffect();

        // 結果を判定
        setTimeout(() => {
            checkWin();
            startButton.disabled = false;
        }, 500);
    }
}

// 勝敗判定
function checkWin() {
    const [first, second, third] = allStoppedResults;

    // 3つすべてが一致しているかチェック
    if (first === second && second === third) {
        // 勝利！
        resultDiv.innerHTML = `<div class="result-display">🎉 Congratulation!! 🎉</div>`;
    } else {
        // 不一致の場合は何も表示しない（または「もう一度チャレンジ！」などを表示してもOK）
        // resultDiv.innerHTML = `<div class="result-display" style="font-size: 1.5em;">もう一度チャレンジ！</div>`;
    }
}

// スロット初期化（アイテムを複製）
function initSlot(slotElement) {
    // 既存のクローンをクリア
    while (slotElement.children.length > 6) {
        slotElement.removeChild(slotElement.lastChild);
    }

    const originalItems = Array.from(slotElement.children).slice(0, 6);

    // 複数セット追加（スムーズな回転のため）
    for (let i = 0; i < 5; i++) {
        originalItems.forEach(item => {
            const clone = item.cloneNode(true);
            slotElement.appendChild(clone);
        });
    }

    // 初期位置をリセット
    slotElement.style.transform = 'translateY(0)';
}

// リーチ判定
function checkReach() {
    // すでにリーチ判定済みの場合はスキップ
    if (isReach) return;

    // 停止したスロットの数をカウント
    const stoppedCount = allStoppedResults.filter(result => result !== undefined).length;

    // 2つ停止した時点でリーチ判定
    if (stoppedCount === 2) {
        const results = allStoppedResults.filter(result => result !== undefined);

        // 2つが同じ絵柄ならリーチ
        if (results[0] === results[1]) {
            isReach = true;
            showReachEffect();

            // まだ回っているスロットを見つけて強調
            const spinningIndex = slots.findIndex(slot => slot.spinning);
            if (spinningIndex !== -1) {
                slotWindows[spinningIndex].classList.add('reach-highlight');
            }
        }
    }
}

// リーチ演出を表示
function showReachEffect() {
    reachDisplay.classList.add('active');
}

// リーチ演出を非表示
function hideReachEffect() {
    reachDisplay.classList.remove('active');
    // すべてのスロットから強調を削除
    slotWindows.forEach(window => {
        window.classList.remove('reach-highlight');
    });
}

// ページ読み込み時に各スロットを初期化
window.addEventListener('load', () => {
    slots.forEach(slot => {
        initSlot(slot.element);
    });
});
