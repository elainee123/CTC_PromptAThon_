# Worth It?

A Chrome extension that intercepts buy-button clicks on shopping sites and forces a pause before you complete a purchase. It reframes what you're about to spend — showing budget impact, what the money could buy instead, and what it would grow to if invested.

---

## How it works

1. You click **Add to Cart**, **Buy Now**, **Checkout**, or any similar button on any shopping site
2. The extension intercepts the click and opens a full-screen overlay
3. The overlay shows:
   - The detected purchase price (editable)
   - How much of your monthly budget this uses
   - What the same money could buy instead (e.g. "14 boba teas")
   - What it would grow to invested at 10% over 1, 5, 10, 20, and 30 years
   - A random psychological nudge
4. A **cooldown timer** locks the "Buy anyway" button for a set number of seconds — forcing a genuine pause
5. You either click **I don't need this** (purchase cancelled, logged as blocked) or wait out the timer and click **Buy anyway** (purchase proceeds, logged as purchased)
6. Every decision is recorded and visible in the extension popup's History tab

---

## Features

- Works on any website — injected into every page
- Auto-detects the product price from the page DOM
- Monthly budget tracker with a progress bar
- Purchase history log (blocked vs purchased)
- Configurable monthly budget and cooldown duration
- Enable/disable toggle without uninstalling
- All data stored locally in the browser — no account, no server

---

## Installation

This extension is not yet published to the Chrome Web Store. To install it locally:

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked**
5. Select the root folder of this project (the one containing `manifest.json`)
6. The **Worth It?** icon will appear in your Chrome toolbar

To update after making code changes, return to `chrome://extensions` and click the refresh icon on the extension card.

---

## Configuration

Open the extension popup by clicking the toolbar icon, then go to the **Settings** tab.

| Setting | Default | Description |
|---|---|---|
| Monthly budget | $2,000 | Total spending limit for the current month |
| Cooldown timer | 30 seconds | How long the "Buy anyway" button stays locked |

Changes take effect immediately on the next intercepted click.

---

## Project structure

```
worth-it/
├── manifest.json                  Chrome extension manifest (MV3)
├── background.js                  Service worker — message routing
│
├── content/                       Scripts injected into every page
│   ├── config.js                  Constants: buy patterns, comparisons, nudges
│   ├── priceDetector.js           DOM price scraping + buy-button detection
│   ├── index.js                   Click interceptor — entry point
│   └── overlay/
│       ├── builder.js             Pure HTML construction for the overlay card
│       ├── budget.js              Budget bar calculation and DOM updates
│       └── manager.js             Overlay lifecycle: show, hide, cooldown timer
│
├── popup/                         Extension toolbar popup
│   ├── popup.html
│   ├── popup.css
│   ├── popup.js                   Controller — wires up events and data
│   └── views/
│       ├── dashboard.js           Overview tab renderer
│       ├── history.js             History tab renderer
│       └── settings.js            Settings tab renderer
│
├── services/                      Data layer
│   ├── config.js                  Storage mode config (local / api)
│   ├── messaging.js               Promise wrappers for chrome.runtime.sendMessage
│   ├── storage.js                 Business logic — reads, writes, monthly totals
│   └── drivers/
│       └── local.js               chrome.storage.local driver
│
├── styles/
│   └── overlay.css                Styles for the blocker overlay card
│
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## Architecture

The extension is split into three isolated layers:

**Content scripts** run inside the shopping page. They detect buy buttons, scrape prices, and render the overlay entirely in the page's DOM. They communicate with the background via `chrome.runtime.sendMessage`.

**Background service worker** owns all data. It receives messages from both the content scripts and the popup, delegates to `StorageService`, and returns results. No storage calls are made outside this layer.

**Popup** is a standalone HTML page. It reads and writes data exclusively through `MessagingService`, which wraps every background call in a promise that resolves with `null` on error — so the UI never crashes from a background hiccup.

```
Shopping page                 Background SW              Popup
─────────────────             ────────────────           ──────────────
content/index.js              background.js              popup/popup.js
  ↓ click detected              ↓ dispatch()               ↓ _load()
  ↓ GET_DATA ──────────────→    StorageService             MessagingService
  ↓ show overlay                  ↓ LocalDriver              ↓ GET_DATA
  ↓ user decides                  chrome.storage.local     render views
  ↓ LOG_PURCHASE ──────────→    StorageService
                                  ↓ write + recalculate
```

---

## Switching to a backend API

The storage layer is designed to swap drivers. To connect a remote server:

1. Open `services/config.js` and set `MODE: 'api'`
2. Create `services/drivers/api.js` implementing the same `get()` and `set()` interface as `local.js`, using `fetch()` calls to your server
3. Update `services/storage.js` to import and instantiate `ApiDriver` when `MODE === 'api'`

No other files need to change.

---

## Permissions

| Permission | Why |
|---|---|
| `storage` | Saves settings and purchase history locally |
| `activeTab` | Reads the active page to detect buy buttons and prices |

---

## License

MIT
