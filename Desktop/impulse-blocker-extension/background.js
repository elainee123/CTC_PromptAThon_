import { StorageService } from './services/storage.js';

// Initialize default settings on install
chrome.runtime.onInstalled.addListener(() => {
  StorageService.initialize();
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'GET_DATA') {
    StorageService.getData().then(sendResponse);
    return true; // async handler
  }

  if (msg.type === 'LOG_PURCHASE') {
    StorageService.logPurchase(msg.amount, msg.site, msg.wasBlocked).then(sendResponse);
    return true; // async handler
  }

  if (msg.type === 'UPDATE_SETTINGS') {
    StorageService.updateSettings(msg.settings).then(sendResponse);
    return true; // async handler
  }

  if (msg.type === 'RESET_SPENDING') {
    StorageService.resetSpending().then(sendResponse);
    return true; // async handler
  }
});
