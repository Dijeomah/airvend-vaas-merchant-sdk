/**
 * Settlements Resource
 *
 * Manage settlements - fetch, repush, and configure settlement modes.
 */

class Settlements {
    /**
     * @param {HttpClient} client - HTTP client instance
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * Fetch settlements with pagination and filtering
     * @param {Object} [options] - Query options
     * @param {string} options.channel - Channel ID (required)
     * @param {number} [options.page=1] - Page number
     * @param {number} [options.perpage=15] - Items per page
     * @param {string} [options.search] - Search term
     * @param {string} [options.startDate] - Start date filter
     * @param {string} [options.endDate] - End date filter
     * @returns {Promise<Object>} Paginated list of settlements
     *
     * @example
     * const settlements = await payant.settlements.list({
     *   channel: '1',
     *   page: 1,
     *   startDate: '2024-01-01',
     *   endDate: '2024-01-31'
     * });
     */
    async list(options = {}) {
        return this.client.get('/settlements', options);
    }

    /**
     * Re-push failed or pending settlements
     * @param {Object} [data] - Repush options
     * @param {string} [data.startDate] - Start date for range
     * @param {string} [data.endDate] - End date for range
     * @returns {Promise<Object>} Repush result
     *
     * @example
     * const result = await payant.settlements.repush({
     *   startDate: '2024-01-01',
     *   endDate: '2024-01-31'
     * });
     */
    async repush(data = {}) {
        return this.client.post('/settlements/repush', data);
    }

    /**
     * Re-push settlements (alternative endpoint)
     * @param {Object} data - Repush options
     * @param {Array<string>} [data.transactionRefs] - Specific transaction references
     * @param {string} [data.startDate] - Start date for range
     * @param {string} [data.endDate] - End date for range
     * @returns {Promise<Object>} Repush result
     *
     * @example
     * const result = await payant.settlements.rePush({
     *   transactionRefs: ['REF001', 'REF002']
     * });
     */
    async rePush(data) {
        return this.client.post('/settlement/re-push', data);
    }

    /**
     * Get settlement accounts for a channel
     * @param {Object} data - Request data
     * @param {string} data.channel - Channel ID
     * @param {string} [data.provider] - Provider ID
     * @returns {Promise<Object>} Settlement accounts
     *
     * @example
     * const accounts = await payant.settlements.getAccounts({
     *   channel: '1',
     *   provider: '2'
     * });
     */
    async getAccounts(data) {
        return this.client.post('/settlements/account', data);
    }

    /**
     * Toggle auto settlement mode
     * @param {Object} data - Toggle options
     * @param {string} data.channelId - Channel ID
     * @param {string} data.providerId - Provider ID
     * @param {string} data.settlementType - Settlement type ('auto' or 'manual')
     * @param {string} data.vaasActType - VAAS account type ('direct' or 'globus_tp')
     * @returns {Promise<Object>} Updated settlement configuration
     *
     * @example
     * const result = await payant.settlements.toggleMode({
     *   channelId: '1',
     *   providerId: '2',
     *   settlementType: 'auto',
     *   vaasActType: 'direct'
     * });
     */
    async toggleMode(data) {
        return this.client.post('/settlements/toggle-settlement-mode/', data);
    }

    /**
     * Update manual settlement status
     * @param {string} txRef - Transaction reference
     * @param {Object} data - Update data
     * @param {string} data.status - New status
     * @returns {Promise<Object>} Updated settlement
     *
     * @example
     * const result = await payant.settlements.updateStatus('TX123', {
     *   status: 'success'
     * });
     */
    async updateStatus(txRef, data) {
        return this.client.post(`/settlements/update/${txRef}`, data);
    }
}

module.exports = Settlements;
