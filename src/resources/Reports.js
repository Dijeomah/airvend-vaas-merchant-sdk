/**
 * Reports Resource
 *
 * Generate transaction and settlement reports.
 */

class Reports {
    /**
     * @param {HttpClient} client - HTTP client instance
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * Get transaction settlements report
     * @param {string} channelId - Channel ID
     * @param {Object} [options] - Report options
     * @param {string} [options.startDate] - Start date (DD-MM-YYYY format)
     * @param {string} [options.endDate] - End date (DD-MM-YYYY format)
     * @returns {Promise<Object>} Transaction settlements report
     *
     * @example
     * const report = await payant.reports.getTransactions('1', {
     *   startDate: '01-01-2024',
     *   endDate: '31-01-2024'
     * });
     */
    async getTransactions(channelId, options = {}) {
        let path = `/report/transactions/${channelId}`;
        if (options.startDate) {
            path += `/${options.startDate}`;
            if (options.endDate) {
                path += `/${options.endDate}`;
            }
        }
        return this.client.get(path);
    }

    /**
     * Get provider transaction sessions report
     * @param {string} provider - Provider code
     * @param {Object} [options] - Report options
     * @param {string} [options.startDate] - Start date
     * @param {string} [options.endDate] - End date
     * @returns {Promise<Object>} Provider sessions report
     *
     * @example
     * const report = await payant.reports.getProviderSessions('providus', {
     *   startDate: '2024-01-01',
     *   endDate: '2024-01-31'
     * });
     */
    async getProviderSessions(provider, options = {}) {
        let path = `/report/transaction-sessions/${provider}`;
        if (options.startDate) {
            path += `/${options.startDate}`;
            if (options.endDate) {
                path += `/${options.endDate}`;
            }
        }
        return this.client.get(path);
    }
}

module.exports = Reports;
