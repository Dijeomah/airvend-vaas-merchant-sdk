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
     * Get paginated transactions for a specific account.
     *
     * @param {string} accountNumber
     * @param {Object}  [options={}]
     * @param {string}  [options.reference]  - Filter by exact transaction reference
     * @param {number}  [options.page]        - Page number (default 1)
     * @param {number}  [options.perpage]     - Items per page (default 15)
     * @param {string}  [options.search]      - Search by reference, transactionId, or originator
     * @param {string}  [options.startDate]   - Filter from this date (YYYY-MM-DD)
     * @param {string}  [options.endDate]     - Filter to this date inclusive (YYYY-MM-DD)
     * @returns {Promise<Object>} Paginated transaction list
     *
     * @example
     * await payant.transactions.getByAccount('1234567890', {
     *   page: 1,
     *   perpage: 20,
     *   startDate: '2026-01-01',
     *   endDate: '2026-05-31',
     * });
     */
    async getByAccount(accountNumber, options = {}) {
        const { reference, page, perpage, search, startDate, endDate } = options;
        const query = {};
        if (reference)  query.reference  = reference;
        if (page)       query.page       = page;
        if (perpage)    query.perpage    = perpage;
        if (search)     query.search     = search;
        if (startDate)  query.startDate  = startDate;
        if (endDate)    query.endDate    = endDate;
        return this.client.get(`/transactions/${accountNumber}`, query);
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
