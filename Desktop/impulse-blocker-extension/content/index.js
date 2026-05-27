(() => {
  'use strict';

  /**
   * Entry point for the Impulse Buy Blocker content script.
   * Listens for buy-button clicks in the capture phase, intercepts them,
   * and delegates to IB_UIManager to show the blocker overlay.
   */

  let isBypassing = false;

  function interceptClicks(e) {
    if (isBypassing) return;

    const { IB_Config: config, IB_PriceDetector: detector, IB_UIManager: ui } = window;
    if (!config || !detector || !ui) return;

    let target = e.target;
    let depth  = 0;

    while (target && depth < 5) {
      if (target.matches?.(config.BUTTON_SELECTORS) && detector.isBuyButton(target)) {
        chrome.runtime.sendMessage({ type: 'GET_DATA' }, (response) => {
          if (response?.settings?.enabled === false) return;
          if (ui.isShowing()) return;

          const price = detector.detectPrice();

          ui.showOverlay(
            price,
            response.settings,
            response.spending,
            // onProceed: user waited out the cooldown and confirmed the purchase
            (finalPrice) => {
              chrome.runtime.sendMessage({
                type: 'LOG_PURCHASE',
                amount: finalPrice,
                site: window.location.hostname,
                wasBlocked: false,
              }, () => {
                // Bypass the interceptor for this one programmatic click
                isBypassing = true;
                target.click();
                isBypassing = false;
              });
            },
            // onCancel: user dismissed the overlay without buying
            () => {
              chrome.runtime.sendMessage({
                type: 'LOG_PURCHASE',
                amount: price,
                site: window.location.hostname,
                wasBlocked: true,
              });
            }
          );
        });

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return;
      }

      target = target.parentElement;
      depth++;
    }
  }

  document.addEventListener('click', interceptClicks, true);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && window.IB_UIManager?.isShowing()) {
      window.IB_UIManager.hideOverlay();
    }
  });
})();
