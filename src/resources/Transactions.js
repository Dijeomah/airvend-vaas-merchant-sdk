/**
 * Transactions Resource
 *
 * Retrieve transaction history and details.
 */

class Transactions {
    /**
     * @param {HttpClient} client - HTTP client instance
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * Get all transactions with pagination
     * @param {Object} [options] - Query options
     * @param {number} [options.page=1] - Page number
     * @param {number} [options.perpage=15] - Items per page
     * @param {string} [options.search] - Search term (account number, reference, or transaction ID)
     * @returns {Promise<Object>} Paginated list of transactions
     *
     * @example
     * const transactions = await payant.transactions.list({ page: 1, perpage: 20 });
     */
    async list(options = {}) {
        return this.client.get('/transactions', options);
    }

    /**
     * Get transactions for a specific account
     * @param {string} accountNumber - The account number
     * @param {Object} [options] - Query options
     * @param {string} [options.reference] - Filter by reference
     * @returns {Promise<Object>} List of transactions
     *
     * @example
     * const transactions = await payant.transactions.getByAccount('1234567890');
     */
    async getByAccount(accountNumber, options = {}) {
        return this.client.get(`/transactions/${accountNumber}`, options);
    }

    /**
     * Get POS terminal transactions
     * @param {string} tid - Terminal ID
     * @returns {Promise<Object>} List of POS transactions
     *
     * @example
     * const transactions = await payant.transactions.getByPOS('TERM001');
     */
    async getByPOS(tid) {
        return this.client.get(`/pos/transactions/${tid}`);
    }

    /**
     * Get POS terminal account details
     * @param {string} tid - Terminal ID
     * @returns {Promise<Object>} POS account details
     *
     * @example
     * const account = await payant.transactions.getPOSAccount('TERM001');
     */
    async getPOSAccount(tid) {
        return this.client.get(`/pos/account/${tid}`);
    }
}

module.exports = Transactions;
