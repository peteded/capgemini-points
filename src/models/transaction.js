/**
 * Transaction model
 *
 * Represents a completed purchase.
 *
 * @typedef {Object} Transaction
 * @property {string} id
 * @property {string} customerId
 * @property {string} customerName
 * @property {string} createdAt - ISO timestamp
 * @property {number} total
 * @property {number} points
 * @property {Array<{ name: string, qty: number, price: number }>} items
 */

/**
 * Factory function to create a transaction
 * (keeps transaction creation consistent everywhere)
 */
export function createTransaction({
  customerId,
  customerName,
  items,
  total,
  points,
}) {
  return {
    id: `order_${Math.floor(Math.random() * 900000) + 100000}`,
    customerId,
    customerName,
    items,
    total,
    points,
    createdAt: new Date().toISOString(),
  };
}
