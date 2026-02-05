/**
 * Virtual Accounts Resource
 *
 * Manage virtual accounts - create, retrieve, list, and disable accounts.
 */

class VirtualAccounts {
    /**
     * @param {HttpClient} client - HTTP client instance
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * Create a new virtual account
     * @param {Object} data - Account creation data
     * @param {string} data.accountName - Account holder name
     * @param {string} data.bvn - Bank Verification Number
     * @param {string} data.phoneNumber - Phone number
     * @param {string} [data.email] - Email address
     * @param {string} [data.provider] - Provider code (e.g., 'providus', 'gtbank')
     * @returns {Promise<Object>} Created account details
     *
     * @example
     * const account = await payant.virtualAccounts.create({
     *   accountName: 'John Doe',
     *   bvn: '12345678901',
     *   phoneNumber: '08012345678',
     *   email: 'john@example.com'
     * });
     */
    async create(data) {
        return this.client.post('/account/add', data);
    }

    /**
     * Get a virtual account by account number
     * @param {string} accountNumber - The account number
     * @returns {Promise<Object>} Account details
     *
     * @example
     * const account = await payant.virtualAccounts.get('1234567890');
     */
    async get(accountNumber) {
        return this.client.get(`/account/${accountNumber}`);
    }

    /**
     * Get a virtual account by phone number
     * @param {string} phoneNumber - The phone number
     * @returns {Promise<Object>} Account details
     *
     * @example
     * const account = await payant.virtualAccounts.getByPhone('08012345678');
     */
    async getByPhone(phoneNumber) {
        return this.client.get(`/account/phone_number/${phoneNumber}`);
    }

    /**
     * List all virtual accounts with pagination
     * @param {Object} [options] - Query options
     * @param {number} [options.page=1] - Page number
     * @param {number} [options.perpage=15] - Items per page
     * @param {string} [options.search] - Search term
     * @returns {Promise<Object>} Paginated list of accounts
     *
     * @example
     * const accounts = await payant.virtualAccounts.list({ page: 1, perpage: 20 });
     */
    async list(options = {}) {
        return this.client.get('/accounts', options);
    }

    /**
     * Disable a dynamic virtual account
     * @param {Object} data - Disable request data
     * @param {string} data.accountNumber - Account number to disable
     * @param {string} data.provider - Provider code
     * @returns {Promise<Object>} Result
     *
     * @example
     * await payant.virtualAccounts.disable({
     *   accountNumber: '1234567890',
     *   provider: 'providus'
     * });
     */
    async disable(data) {
        return this.client.post('/dynamic-account/disable', data);
    }

    /**
     * Register a POS terminal virtual account
     * @param {string} provider - Provider code
     * @param {Object} data - Registration data
     * @param {string} data.accountName - Account name
     * @param {string} data.accountNumber - Account number
     * @param {string} data.tid - Terminal ID
     * @param {string} data.settlementAccount - Settlement account
     * @param {string} [data.phoneNumber] - Phone number
     * @returns {Promise<Object>} Registration result
     *
     * @example
     * const result = await payant.virtualAccounts.register('providus', {
     *   accountName: 'POS Terminal 001',
     *   accountNumber: '1234567890',
     *   tid: 'TERM001',
     *   settlementAccount: '0987654321'
     * });
     */
    async register(provider, data) {
        return this.client.post(`/account/register/${provider}`, data);
    }

    /**
     * Verify a bank account
     * @param {string} bankCode - Bank code
     * @param {Object} data - Verification data
     * @param {string} data.accountNumber - Account number to verify
     * @returns {Promise<Object>} Verification result
     *
     * @example
     * const result = await payant.virtualAccounts.verifyBankAccount('stanbic', {
     *   accountNumber: '1234567890'
     * });
     */
    async verifyBankAccount(bankCode, data) {
        return this.client.post(`/${bankCode}/account`, data);
    }
}

module.exports = VirtualAccounts;
