// ルーレットアプリのJavaScript

const items = ["🍎", "🍌", "🍇", "🍒", "🍋", "⭐"];
let isSpinning = false;
let animationId = null;
let currentPosition = 0;
let speed = 0;

// DOM要素の取得
const roulette = document.getElementById('roulette');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const resultDiv = document.getElementById('result');

// レバーを押すボタンのイベント
startButton.addEventListener('click', startRoulette);

// ストップボタンのイベント
stopButton.addEventListener('click', stopRoulette);

// ルーレット開始
function startRoulette() {
    if (isSpinning) return;

    isSpinning = true;
    startButton.disabled = true;
    stopButton.disabled = false;
    resultDiv.innerHTML = '';

    // 初期スピードを設定
    speed = 20;

    // アニメーション開始
    spin();
}

// ルーレット回転のアニメーション
function spin() {
    if (!isSpinning) return;

    currentPosition -= speed;
    roulette.style.transform = `translateX(${currentPosition}px)`;

    // 位置をループさせる（無限スクロール効果）
    const itemWidth = roulette.offsetWidth / items.length;
    if (Math.abs(currentPosition) >= itemWidth) {
        currentPosition += itemWidth;
        // 最初のアイテムを最後に移動
        const firstItem = roulette.firstElementChild;
        roulette.appendChild(firstItem);
    }

    animationId = requestAnimationFrame(spin);
}

// ルーレット停止
function stopRoulette() {
    if (!isSpinning) return;

    stopButton.disabled = true;

    // 徐々にスピードを落とす
    const decelerate = () => {
        speed *= 0.95;

        if (speed < 0.5) {
            // 完全に停止
            cancelAnimationFrame(animationId);
            isSpinning = false;
            startButton.disabled = false;

            // 結果を表示
            showResult();
        } else {
            requestAnimationFrame(decelerate);
        }
    };

    decelerate();
}

// 結果を表示
function showResult() {
    // ルーレットの中央に表示されているアイテムを取得
    const rouletteRect = roulette.getBoundingClientRect();
    const centerX = rouletteRect.left + rouletteRect.width / 2;

    // 各アイテムの位置をチェック
    let selectedItem = items[0];
    let minDistance = Infinity;

    const rouletteItems = roulette.querySelectorAll('.roulette-item');
    rouletteItems.forEach(item => {
        const itemRect = item.getBoundingClientRect();
        const itemCenterX = itemRect.left + itemRect.width / 2;
        const distance = Math.abs(centerX - itemCenterX);

        if (distance < minDistance) {
            minDistance = distance;
            selectedItem = item.textContent;
        }
    });

    // 結果を画面中央に表示
    resultDiv.innerHTML = `<div class="result-display">${selectedItem}</div>`;
}

// 初期化時にルーレットアイテムを複数回複製して無限スクロール効果を作る
function initRoulette() {
    const originalItems = Array.from(roulette.children);

    // 3セット追加（スムーズなスクロールのため）
    for (let i = 0; i < 3; i++) {
        originalItems.forEach(item => {
            const clone = item.cloneNode(true);
            roulette.appendChild(clone);
        });
    }
}

// ページ読み込み時に初期化
initRoulette();
