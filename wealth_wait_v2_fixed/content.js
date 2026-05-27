// Selectors for common "Buy" or "Add to Cart" buttons
const buySelectors = [
  '#buy-now-button', 
  '#add-to-cart-button', 
  '[name="submit.add-to-cart"]',
  '#atc_shim_button',
  '.add-to-cart-btn',
  '[data-test="shipItButton"]',
  '#binBtn_btn'
];

let isBypassed = false; // Add this at the very top of your content.js

// ... (Your buySelectors and isBypassed flag stay the same) ...

function injectSpeedBump(e) {
  if (isBypassed || document.getElementById('wealth-wait-modal')) return;

  e.preventDefault(); 
  e.stopImmediatePropagation();

  chrome.storage.sync.get(['wage', 'goal', 'goalCost', 'currentSavings'], (data) => {
    const hourlyWage = parseFloat(data.wage) || 20;
    const goalName = data.goal || "your future";
    const goalCost = parseFloat(data.goalCost) || 1000;
    const currentSavings = parseFloat(data.currentSavings) || 0;
    
    const priceText = document.querySelector('.a-price .a-offscreen')?.innerText || "$0";
    const price = parseFloat(priceText.replace(/[^0-9.-]+/g,"")) || 0;
    
    // PROGRESS CALCULATIONS
    const percentComplete = ((currentSavings / goalCost) * 100).toFixed(1);
    const hoursNeededForItem = (price / hourlyWage).toFixed(1);
    const newTotalIfSaved = currentSavings + price;
    const percentAfterSaving = ((newTotalIfSaved / goalCost) * 100).toFixed(1);

    // MOTIVATIONAL MESSAGES
    let motivation = "";
    if (percentComplete < 25) {
        motivation = "Every dollar is a brick in your foundation. Keep building!";
    } else if (percentComplete < 75) {
        motivation = "You're past the hard part. Don't let a small buy slow your momentum!";
    } else {
        motivation = "You are SO CLOSE. Imagine how it will feel to cross the finish line!";
    }

    const modal = document.createElement('div');
    modal.id = 'wealth-wait-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h2>Wealth-Wait Moment</h2>
        <p>This costs <strong>${hoursNeededForItem} hours</strong> of work.</p>
        
        <div class="progress-container">
            <p>Goal: <strong>${goalName}</strong></p>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percentComplete}%"></div>
            </div>
            <p><small>Current: ${percentComplete}% — If you SAVE this, you'll be at <strong>${percentAfterSaving}%</strong>!</small></p>
        </div>

        <p class="motivation-quote">" ${motivation} "</p>

        <div class="btn-group">
          <button id="wait-close">I'll wait (Save for ${goalName})</button>
          <button id="buy-anyway">Buy anyway</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('wait-close').onclick = () => modal.remove();
    document.getElementById('buy-anyway').onclick = () => {
        isBypassed = true;
        modal.remove();
        e.currentTarget.click();
        setTimeout(() => { isBypassed = false; }, 1000);
    };
  });
}

function init() {
    buySelectors.forEach(selector => {
        const buttons = document.querySelectorAll(selector);
        buttons.forEach(btn => {
            if (!btn.dataset.intercepted) {
                btn.addEventListener('click', injectSpeedBump, true);
                btn.dataset.intercepted = "true";
            }
        });
    });
}

init();
const observer = new MutationObserver(init);
observer.observe(document.body, { childList: true, subtree: true });
