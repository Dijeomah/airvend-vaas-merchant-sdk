/**
 * Transfers Resource
 *
 * Initiate and manage fund transfers, verify accounts, and query transaction status.
 * All endpoints require an admin JWT token.
 */

class Transfers {
    /**
     * @param {HttpClient} client - HTTP client instance
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * Send money to a bank account
     * @param {Object} data - Transfer data
     * @param {number} data.amount - Amount in kobo/smallest currency unit
     * @param {string} data.accountNumber - Destination account number
     * @param {string} data.bankCode - Destination bank code
     * @param {string} data.accountName - Destination account name
     * @param {string} [data.narration] - Transfer narration
     * @param {string} [data.reference] - Unique transfer reference
     * @returns {Promise<Object>} Transfer result
     *
     * @example
     * const result = await payant.transfers.sendMoney({
     *   amount: 500000,
     *   accountNumber: '0123456789',
     *   bankCode: '058',
     *   accountName: 'Jane Doe',
     *   narration: 'Payment for services'
     * });
     */
    async sendMoney(data) {
        return this.client.post('/admin/transfer/sendMoney', data);
    }

    /**
     * Verify a bank account number
     * @param {Object} data - Verification data
     * @param {string} data.accountNumber - Account number to verify
     * @param {string} data.bankCode - Bank code
     * @returns {Promise<Object>} Account details (name, number)
     *
     * @example
     * const account = await payant.transfers.verifyAccount({
     *   accountNumber: '0123456789',
     *   bankCode: '058'
     * });
     * console.log(account.accountName);
     */
    async verifyAccount(data) {
        return this.client.post('/admin/transfer/verify', data);
    }

    /**
     * Get the status of a transfer
     * @param {Object} data - Query data
     * @param {string} data.reference - Transfer reference
     * @returns {Promise<Object>} Transaction status
     *
     * @example
     * const status = await payant.transfers.getTransactionStatus({ reference: 'TXN_001' });
     */
    async getTransactionStatus(data) {
        return this.client.post('/admin/transfer/transactionStatus', data);
    }

    /**
     * List all available banks
     * @param {Object} [data] - Optional filter data
     * @returns {Promise<Object>} List of banks with codes
     *
     * @example
     * const banks = await payant.transfers.getBanks();
     * banks.data.forEach(b => console.log(b.name, b.code));
     */
    async getBanks(data = {}) {
        return this.client.post('/admin/transfer/banks', data);
    }

    /**
     * Verify a Globus bank account
     * @param {Object} data - Verification data
     * @param {string} data.accountNumber - Account number
     * @param {string} data.bankCode - Bank code
     * @returns {Promise<Object>} Account details
     *
     * @example
     * const account = await payant.transfers.globusVerifyAccount({
     *   accountNumber: '0123456789',
     *   bankCode: '000027'
     * });
     */
    async globusVerifyAccount(data) {
        return this.client.post('/admin/transfer/globus-account-verify', data);
    }

    /**
     * Initiate a Globus fund transfer
     * @param {Object} data - Transfer data
     * @param {number} data.amount - Amount in kobo
     * @param {string} data.accountNumber - Destination account number
     * @param {string} data.bankCode - Destination bank code
     * @param {string} data.accountName - Destination account name
     * @param {string} [data.narration] - Transfer narration
     * @returns {Promise<Object>} Transfer result
     *
     * @example
     * const result = await payant.transfers.globusTransfer({
     *   amount: 100000,
     *   accountNumber: '0123456789',
     *   bankCode: '000027',
     *   accountName: 'Jane Doe'
     * });
     */
    async globusTransfer(data) {
        return this.client.post('/admin/transfer/globus-fund-transfer', data);
    }

    /**
     * Requery a transfer status
     * @param {Object} data - Requery data
     * @param {string} data.reference - Transfer reference
     * @param {string} [data.provider] - Provider code
     * @returns {Promise<Object>} Updated transaction status
     *
     * @example
     * const status = await payant.transfers.requery({ reference: 'TXN_001' });
     */
    async requery(data) {
        return this.client.post('/admin/transfer/requery', data);
    }
}

module.exports = Transfers;
