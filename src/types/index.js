// This file is now for documentation purposes only.
// You may safely delete it if not using type hints or JSDoc.

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {string} [barcode]
 * @property {number} price
 * @property {string} category
 * @property {number} stock
 * @property {string} unit // kg, piece, liter, etc.
 */

/**
 * @typedef {Product & {
 *   quantity: number,
 *   total: number
 * }} CartItem
 */

/**
 * @typedef {Object} Transaction
 * @property {string} id
 * @property {CartItem[]} items
 * @property {number} subtotal
 * @property {number} tax
 * @property {number} total
 * @property {'cash' | 'card' | 'upi'} paymentMethod
 * @property {Date} timestamp
 * @property {string} [customerName]
 */

/**
 * @typedef {Object} DailySummary
 * @property {string} date
 * @property {number} totalSales
 * @property {number} transactionCount
 * @property {number} cashSales
 * @property {number} cardSales
 * @property {number} upiSales
 */
