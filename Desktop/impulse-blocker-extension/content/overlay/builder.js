(() => {
  "use strict";

  /**
   * IB_Builder — pure HTML construction for the blocker overlay.
   * No DOM reads or writes; returns strings only.
   */

  function pickRandom(arr, n) {
    return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
  }

  window.IB_Builder = {
    /** Clean text-only comparison list (no emoji). */
    buildComparisonCards(price) {
      if (price <= 0) return "";
      const { COMPARISONS = [] } = window.IB_Config || {};

      return pickRandom(COMPARISONS, 4)
        .map((c) => {
          const count = Math.floor(price / c.cost);
          if (count < 1) return "";
          return `
            <div class="ibb-comp-row">
              <span class="ibb-comp-count">${count}</span>
              <span class="ibb-comp-name">${count === 1 ? c.sing : c.plur}</span>
            </div>`;
        })
        .filter(Boolean)
        .join("");
    },

    /** Compound-interest projection rows. */
    buildInvestRows(price) {
      if (price <= 0) return "";
      const {
        INVESTMENT_GROWTH_RATE: rate = 0.1,
        INVESTMENT_YEARS: years = [1, 5, 10, 20, 30],
      } = window.IB_Config || {};

      const vals = years.map((y) => price * Math.pow(1 + rate, y));
      const maxVal = vals[vals.length - 1];

      return years
        .map((y, i) => {
          const pct = (vals[i] / maxVal) * 100;
          const display =
            vals[i] >= 1000
              ? `$${(vals[i] / 1000).toFixed(1)}k`
              : `$${vals[i].toFixed(0)}`;
          return `
          <div class="ibb-invest-row">
            <span class="ibb-invest-yr">${y} yr${y > 1 ? "s" : ""}</span>
            <div class="ibb-invest-bar-wrap">
              <div class="ibb-invest-bar" style="width:${pct}%"></div>
            </div>
            <span class="ibb-invest-val">${display}</span>
          </div>`;
        })
        .join("");
    },

    /** Random nudge message. */
    buildNudge(price) {
      const { NUDGES = [] } = window.IB_Config || {};
      if (!NUDGES.length) return "";
      const pick = NUDGES[Math.floor(Math.random() * NUDGES.length)];
      return pick(price > 0 ? price : 50);
    },

    /** Full overlay card HTML. IDs are referenced by budget.js and manager.js. */
    buildOverlayHTML() {
      return `
        <div class="ibb-card">

          <div class="ibb-header">
            <div class="ibb-heading">Wait.</div>
            <div class="ibb-subheading">Is this purchase really worth it?</div>
          </div>

          <div class="ibb-section">
            <div class="ibb-label">You're about to spend</div>
            <div class="ibb-price-row">
              <span class="ibb-currency">$</span>
              <input type="number" class="ibb-price-input" id="ibb-price"
                     placeholder="0" step="0.01" min="0">
            </div>
          </div>

          <div class="ibb-section">
            <div class="ibb-budget-header">
              <span class="ibb-label">Monthly budget</span>
              <span class="ibb-budget-pct" id="ibb-pct">0%</span>
            </div>
            <div class="ibb-bar-track">
              <div class="ibb-bar-fill" id="ibb-bar-fill" style="width:0%"></div>
              <div class="ibb-bar-new"  id="ibb-bar-new"  style="left:0%;width:0%"></div>
            </div>
            <div class="ibb-budget-detail">
              <span id="ibb-spent">$0 spent</span>
              <span id="ibb-budget-total">$0 budget</span>
            </div>
          </div>

          <div class="ibb-section">
            <div class="ibb-label">That's the same as</div>
            <div id="ibb-comp-scroll"></div>
          </div>

          <div class="ibb-section">
            <div class="ibb-label">Invested at 10% annually</div>
            <div id="ibb-invest-rows"></div>
          </div>

          <div class="ibb-section ibb-nudge-section">
            <div class="ibb-nudge" id="ibb-nudge"></div>
          </div>

          <div class="ibb-actions">
            <button class="ibb-btn-cancel"  id="ibb-cancel">I don't need this</button>
            <button class="ibb-btn-proceed ibb-locked" id="ibb-proceed">Buy anyway</button>
            <div class="ibb-cooldown" id="ibb-cooldown"></div>
          </div>

        </div>`;
    },
  };
})();
