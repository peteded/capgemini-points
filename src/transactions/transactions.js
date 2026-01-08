const STORAGE_KEY = "buyer_points_transactions";

/**
 * Load all stored transactions
 * @returns {Array}
 */
export function loadTransactions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to load transactions", err);
    return [];
  }
}

/**
 * Save the full transaction list
 */
export function saveTransactions(transactions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

/**
 * Add a new transaction and persist it
 */
export function addTransaction(transaction) {
  const existing = loadTransactions();
  const updated = [transaction, ...existing]; // newest first
  saveTransactions(updated);
  return updated;
}

/**
 * Clear all stored transactions (dev helper)
 */
export function clearTransactions() {
  localStorage.removeItem(STORAGE_KEY);
}
