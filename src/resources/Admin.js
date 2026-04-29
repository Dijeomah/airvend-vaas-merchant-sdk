/**
 * Admin Resource
 *
 * Manage channels, providers, accounts, settlement reports, and notifications.
 * All endpoints require an admin JWT token.
 */

class Admin {
    /**
     * @param {HttpClient} client - HTTP client instance
     */
    constructor(client) {
        this.client = client;
    }

    // ─── Channels ────────────────────────────────────────────────────────────

    /**
     * List all channels
     * @returns {Promise<Object>} List of channels
     *
     * @example
     * const channels = await payant.admin.getChannels();
     */
    async getChannels() {
        return this.client.get('/admin/channels');
    }

    /**
     * Create a new channel
     * @param {Object} data - Channel data
     * @param {string} data.name - Channel name
     * @param {string} data.email - Channel email
     * @param {string} [data.channelType] - Channel type ('merchant' or 'tp')
     * @param {string} [data.webhookUrl] - Webhook URL for transaction notifications
     * @param {number} [data.feeCharge] - Fee charge percentage
     * @param {number} [data.feeCap] - Maximum fee cap
     * @param {number} [data.stampDuty] - Stamp duty amount
     * @returns {Promise<Object>} Created channel
     *
     * @example
     * const channel = await payant.admin.addChannel({
     *   name: 'My Store',
     *   email: 'store@example.com',
     *   webhookUrl: 'https://mystore.com/webhook'
     * });
     */
    async addChannel(data) {
        return this.client.post('/admin/channels/add', data);
    }

    /**
     * Update an existing channel
     * @param {Object} data - Updated channel data
     * @param {string} data.id - Channel ID
     * @returns {Promise<Object>} Updated channel
     *
     * @example
     * await payant.admin.updateChannel({ id: '1', webhookUrl: 'https://newurl.com/webhook' });
     */
    async updateChannel(data) {
        return this.client.post('/admin/channels/update', data);
    }

    /**
     * Add a settlement account to a channel
     * @param {Object} data - Settlement account data
     * @param {string} data.channelId - Channel ID
     * @param {string} data.accountNumber - Bank account number
     * @param {string} data.bankCode - Bank code
     * @param {string} data.accountName - Account holder name
     * @returns {Promise<Object>} Result
     *
     * @example
     * await payant.admin.addSettlementAccount({
     *   channelId: '1',
     *   accountNumber: '0123456789',
     *   bankCode: '058',
     *   accountName: 'John Doe'
     * });
     */
    async addSettlementAccount(data) {
        return this.client.post('/admin/channels/account/add', data);
    }

    /**
     * Add a merchant settlement account to a channel
     * @param {Object} data - Merchant settlement account data
     * @param {string} data.channelId - Channel ID
     * @param {string} data.accountNumber - Bank account number
     * @param {string} data.bankCode - Bank code
     * @param {string} data.accountName - Account holder name
     * @param {string} [data.providerId] - Provider ID
     * @param {string} [data.settlementMode] - Settlement mode ('auto' or 'manual')
     * @returns {Promise<Object>} Result
     *
     * @example
     * await payant.admin.addMerchantSettlementAccount({
     *   channelId: '1',
     *   accountNumber: '0123456789',
     *   bankCode: '058',
     *   accountName: 'John Doe',
     *   settlementMode: 'auto'
     * });
     */
    async addMerchantSettlementAccount(data) {
        return this.client.post('/admin/channels/merchant/account/add', data);
    }

    /**
     * Add a provider fee structure to a channel
     * @param {Object} data - Fee data
     * @param {string} data.channelId - Channel ID
     * @param {string} data.providerId - Provider ID
     * @param {number} data.feeCharge - Fee charge percentage
     * @param {number} [data.feeCap] - Maximum fee cap
     * @returns {Promise<Object>} Result
     *
     * @example
     * await payant.admin.addProviderFee({
     *   channelId: '1',
     *   providerId: '2',
     *   feeCharge: 0.5,
     *   feeCap: 100
     * });
     */
    async addProviderFee(data) {
        return this.client.post('/admin/channels/provider/fee/add', data);
    }

    // ─── Providers ───────────────────────────────────────────────────────────

    /**
     * List all payment providers
     * @returns {Promise<Object>} List of providers
     *
     * @example
     * const providers = await payant.admin.getProviders();
     */
    async getProviders() {
        return this.client.get('/admin/providers');
    }

    /**
     * Add a new payment provider
     * @param {Object} data - Provider data
     * @param {string} data.name - Provider name
     * @param {string} data.code - Provider code (e.g., 'providus', 'gtbank')
     * @param {string} [data.credentials] - JSON credentials string
     * @param {string} [data.prefix] - Account number prefix
     * @returns {Promise<Object>} Created provider
     *
     * @example
     * await payant.admin.addProvider({
     *   name: 'Providus Bank',
     *   code: 'providus',
     *   credentials: JSON.stringify({ clientId: '...', secretKey: '...' })
     * });
     */
    async addProvider(data) {
        return this.client.post('/admin/providers/add', data);
    }

    /**
     * Update a provider
     * @param {string} uuid - Provider UUID
     * @param {Object} data - Updated provider data
     * @returns {Promise<Object>} Updated provider
     *
     * @example
     * await payant.admin.updateProvider('abc-123', { credentials: JSON.stringify({...}) });
     */
    async updateProvider(uuid, data) {
        return this.client.post(`/admin/providers/update/${uuid}`, data);
    }

    // ─── Accounts (admin view) ────────────────────────────────────────────────

    /**
     * List all virtual accounts (admin view)
     * @returns {Promise<Object>} List of accounts
     *
     * @example
     * const accounts = await payant.admin.getAccounts();
     */
    async getAccounts() {
        return this.client.get('/admin/accounts');
    }

    /**
     * Get transactions for all accounts
     * @param {string|number} [all] - Pass 'all' to retrieve all records
     * @returns {Promise<Object>} Transaction list
     *
     * @example
     * const transactions = await payant.admin.getAccountTransactions('all');
     */
    async getAccountTransactions(all = '') {
        return this.client.get(`/admin/accounts/transactions/${all}`);
    }

    /**
     * Create a virtual account (admin)
     * @param {Object} data - Account data
     * @returns {Promise<Object>} Created account
     *
     * @example
     * const account = await payant.admin.addAccount({ accountName: 'John Doe', bvn: '...' });
     */
    async addAccount(data) {
        return this.client.post('/admin/accounts/add', data);
    }

    /**
     * Manually create a virtual account
     * @param {Object} data - Account data including account number
     * @returns {Promise<Object>} Created account
     *
     * @example
     * const account = await payant.admin.addAccountManually({
     *   accountName: 'John Doe',
     *   accountNumber: '1234567890',
     *   providerId: '2'
     * });
     */
    async addAccountManually(data) {
        return this.client.post('/admin/accounts/add/manual', data);
    }

    /**
     * Get all provider transaction notifications
     * @param {string|number} [all] - Pass 'all' to retrieve all records
     * @returns {Promise<Object>} Notification list
     *
     * @example
     * const notifications = await payant.admin.getTransactionNotifications('all');
     */
    async getTransactionNotifications(all = '') {
        return this.client.get(`/admin/accounts/transactions/notifications/${all}`);
    }

    // ─── Settlement Reports ───────────────────────────────────────────────────

    /**
     * Trigger a settlement report for a specific channel
     * @param {string|number} channelId - Channel ID
     * @returns {Promise<Object>} Result
     *
     * @example
     * await payant.admin.triggerSettlementReport('1');
     */
    async triggerSettlementReport(channelId) {
        return this.client.post(`/admin/settlement-report/trigger/${channelId}`);
    }

    /**
     * Trigger settlement reports for all channels
     * @returns {Promise<Object>} Result
     *
     * @example
     * await payant.admin.triggerAllSettlementReports();
     */
    async triggerAllSettlementReports() {
        return this.client.post('/admin/settlement-report/trigger-all');
    }

    // ─── Notifications & Dynamic Accounts ────────────────────────────────────

    /**
     * Requeue a failed transaction notification
     * @param {Object} data - Requeue data
     * @param {string} data.notificationId - Provider notification ID or UUID
     * @returns {Promise<Object>} Result
     *
     * @example
     * await payant.admin.requeueTxNotification({ notificationId: 'uuid-here' });
     */
    async requeueTxNotification(data) {
        return this.client.post('/admin/requery-tx-notification', data);
    }

    /**
     * Disable a dynamic virtual account (admin)
     * @param {Object} data - Disable data
     * @param {string} data.accountNumber - Account number to disable
     * @param {string} data.provider - Provider code
     * @returns {Promise<Object>} Result
     *
     * @example
     * await payant.admin.disableDynamicAccount({ accountNumber: '1234567890', provider: 'globus' });
     */
    async disableDynamicAccount(data) {
        return this.client.post('/admin/dynamic-account/disable', data);
    }
}

module.exports = Admin;
