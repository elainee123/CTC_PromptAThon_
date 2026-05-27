/**
 * MessagingService provides promise-based wrappers around chrome.runtime.sendMessage.
 * All communication between the popup/content scripts and the background service worker
 * goes through here, keeping raw chrome API calls in one place.
 */
export const MessagingService = {
  getData() {
    return new Promise(resolve =>
      chrome.runtime.sendMessage({ type: 'GET_DATA' }, resolve)
    );
  },

  logPurchase(amount, site, wasBlocked) {
    return new Promise(resolve =>
      chrome.runtime.sendMessage({ type: 'LOG_PURCHASE', amount, site, wasBlocked }, resolve)
    );
  },

  updateSettings(settings) {
    return new Promise(resolve =>
      chrome.runtime.sendMessage({ type: 'UPDATE_SETTINGS', settings }, resolve)
    );
  },

  resetSpending() {
    return new Promise(resolve =>
      chrome.runtime.sendMessage({ type: 'RESET_SPENDING' }, resolve)
    );
  },
};
