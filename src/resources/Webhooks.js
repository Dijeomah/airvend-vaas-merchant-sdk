/**
 * Webhooks Resource
 *
 * Utilities for working with Payant webhooks.
 * Note: Most webhook endpoints are called BY Payant TO your server.
 * This resource provides helpers for verifying and processing webhooks.
 */

const crypto = require('crypto');

class Webhooks {
    /**
     * @param {HttpClient} client - HTTP client instance
     * @param {string} secretKey - Webhook secret key for verification
     */
    constructor(client, secretKey) {
        this.client = client;
        this.secretKey = secretKey;
    }

    /**
     * Verify webhook signature
     * @param {Object|string} payload - Webhook payload (raw body or parsed object)
     * @param {string} signature - Signature from request headers
     * @returns {boolean} True if signature is valid
     *
     * @example
     * // In your webhook endpoint
     * app.post('/webhook', (req, res) => {
     *   const signature = req.headers['x-payant-signature'];
     *   const isValid = payant.webhooks.verifySignature(req.body, signature);
     *
     *   if (!isValid) {
     *     return res.status(401).send('Invalid signature');
     *   }
     *
     *   // Process webhook...
     * });
     */
    verifySignature(payload, signature) {
        if (!this.secretKey) {
            console.warn('Warning: No secret key provided for webhook verification');
            return false;
        }

        const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload);
        const expectedSignature = crypto
            .createHmac('sha512', this.secretKey)
            .update(payloadString)
            .digest('hex');

        return signature === expectedSignature;
    }

    /**
     * Parse and validate webhook event
     * @param {Object|string} payload - Webhook payload
     * @param {string} [signature] - Signature from request headers (optional)
     * @returns {Object} Parsed webhook event
     * @throws {Error} If signature is provided and invalid
     *
     * @example
     * const event = payant.webhooks.parseEvent(req.body, req.headers['x-payant-signature']);
     * console.log(event.type); // e.g., 'transaction.success'
     */
    parseEvent(payload, signature = null) {
        if (signature && !this.verifySignature(payload, signature)) {
            throw new Error('Invalid webhook signature');
        }

        const event = typeof payload === 'string' ? JSON.parse(payload) : payload;
        return event;
    }

    /**
     * Send a success acknowledgment
     * @param {Object} data - Optional data to include in response
     * @returns {Object} Acknowledgment response
     *
     * @example
     * app.post('/webhook', (req, res) => {
     *   // Process webhook...
     *   res.json(payant.webhooks.acknowledge());
     * });
     */
    acknowledge(data = {}) {
        return {
            status: 'received',
            timestamp: new Date().toISOString(),
            ...data
        };
    }

    /**
     * Get transaction status via webhook endpoint
     * @param {string} provider - Provider code
     * @param {Object} data - Request data
     * @returns {Promise<Object>} Transaction status
     */
    async getTransactionStatus(provider, data) {
        return this.client.post(`/notification/webhook/${provider}`, data);
    }

    /**
     * Send success webhook notification
     * @param {Object} data - Webhook data
     * @returns {Promise<Object>} Response
     */
    async sendSuccess(data) {
        return this.client.post('/webhook/success', data);
    }
}

module.exports = Webhooks;
