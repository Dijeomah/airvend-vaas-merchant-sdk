/**
 * Airvend MerchantSDK
 *
 * Official Node.js SDK for Airvend MerchantAPI.
 *
 * @example
 * const Payant = require('@airvend/vaas-merchant');
 *
 * const payant = new Payant({
 *   apiKey: 'your-api-key'
 * });
 *
 * // Create a virtual account
 * const account = await payant.virtualAccounts.create({
 *   accountName: 'John Doe',
 *   bvn: '12345678901',
 *   phoneNumber: '08012345678'
 * });
 *
 * // Get transactions
 * const transactions = await payant.transactions.list();
 *
 * // Fetch settlements
 * const settlements = await payant.settlements.list({ channel: '1' });
 */

const AirvendClient = require('./AirvendClient');
const {
    AirvendError,
    AuthenticationError,
    ValidationError,
    NotFoundError,
    RateLimitError
} = require('./utils/errors');

// Export the main client class as default
module.exports = AirvendClient;

// Named exports
module.exports.AirvendClient = AirvendClient;
module.exports.Payant = AirvendClient;

// Error classes
module.exports.AirvendError = AirvendError;
module.exports.AuthenticationError = AuthenticationError;
module.exports.ValidationError = ValidationError;
module.exports.NotFoundError = NotFoundError;
module.exports.RateLimitError = RateLimitError;

// Default export for ES modules
module.exports.default = AirvendClient;
