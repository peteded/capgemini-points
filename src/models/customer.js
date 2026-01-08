/**
 * Customer model
 *
 * @typedef {Object} Customer
 * @property {string} id
 * @property {string} name
 */

/**
 * Simple customer factory
 */
export function createCustomer(id, name) {
  return { id, name };
}
