import { ServiceConfig } from "./config.js";
import { LocalDriver } from "./drivers/local.js";

// Instantiate the active driver based on the configured mode.
// Swap in a different driver class here when MODE switches to 'api'.
const driver =
  ServiceConfig.MODE === "local" ? new LocalDriver() : new LocalDriver(); // fallback until ApiDriver is implemented

/**
 * StorageService is the single point of contact for reading and writing
 * extension data. All persistence logic lives in the driver; this class
 * handles business rules (e.g. recalculating monthly totals).
 */
export class StorageService {
  /**
   * Seeds default settings and spending records on first install.
   */
  static async initialize() {
    const result = await driver.get(["settings", "spending"]);
    const updates = {};

    if (!result.settings) {
      updates.settings = {
        monthlyBudget: 2000,
        enabled: true,
        cooldownSeconds: 30,
      };
    }
    if (!result.spending) {
      updates.spending = { transactions: [], totalThisMonth: 0 };
    }

    if (Object.keys(updates).length) await driver.set(updates);
  }

  /**
   * Returns all stored settings and spending data.
   * @returns {Promise<{ settings: Object, spending: Object }>}
   */
  static async getData() {
    return driver.get(["settings", "spending"]);
  }

  /**
   * Appends a purchase transaction and recalculates the current-month total.
   * Only non-blocked purchases count toward the monthly spend.
   *
   * @param {number}  amount     - Purchase amount.
   * @param {string}  site       - Hostname of the shop.
   * @param {boolean} wasBlocked - Whether the purchase was stopped.
   */
  static async logPurchase(amount, site, wasBlocked) {
    const { spending = { transactions: [], totalThisMonth: 0 } } =
      await driver.get(["spending"]);

    const now = new Date();
    spending.transactions.push({
      amount,
      site,
      wasBlocked,
      date: now.toISOString(),
    });

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    spending.totalThisMonth = spending.transactions
      .filter((t) => new Date(t.date) >= monthStart && t.wasBlocked === false)
      .reduce((sum, t) => sum + t.amount, 0);

    await driver.set({ spending });
    return { success: true, spending };
  }

  /**
   * Persists updated settings.
   * @param {Object} settings
   */
  static async updateSettings(settings) {
    await driver.set({ settings });
    return { success: true };
  }

  /**
   * Clears all transaction history and resets the monthly counter.
   */
  static async resetSpending() {
    await driver.set({ spending: { transactions: [], totalThisMonth: 0 } });
    return { success: true };
  }
}
