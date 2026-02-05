/**
 * Airvend MerchantClient
 *
 * Official Node.js SDK for Airvend MerchantAPI.
 * Provides easy access to virtual accounts, settlements, transactions, and more.
 */

const HttpClient = require('./utils/httpClient');
const VirtualAccounts = require('./resources/VirtualAccounts');
const Transactions = require('./resources/Transactions');
const Settlements = require('./resources/Settlements');
const Reports = require('./resources/Reports');
const Webhooks = require('./resources/Webhooks');
const Auth = require('./resources/Auth');

// Default API base URL
const DEFAULT_BASE_URL = 'https://pwt.airvend.ng/api/v1';

class AirvendClient {
    /**
     * Create a new Payant client
     * @param {Object} config - Client configuration
     * @param {string} config.apiKey - Your API key (JWT token)
     * @param {string} [config.secretKey] - Secret key for webhook verification
     * @param {string} [config.baseUrl] - API base URL (defaults to production)
     * @param {number} [config.timeout=30000] - Request timeout in milliseconds
     *
     * @example
     * const payant = new AirvendClient({
     *   apiKey: 'your-api-key',
     *   secretKey: 'your-webhook-secret' // Optional, for webhook verification
     * });
     */
    constructor(config) {
        if (!config || !config.apiKey) {
            throw new Error('API key is required. Get your API key from the Payant dashboard.');
        }

        this.config = {
            apiKey: config.apiKey,
            secretKey: config.secretKey || null,
            baseUrl: config.baseUrl || DEFAULT_BASE_URL,
            timeout: config.timeout || 30000
        };

        // Initialize HTTP client
        this._httpClient = new HttpClient(this.config);

        // Initialize resources
        this.virtualAccounts = new VirtualAccounts(this._httpClient);
        this.transactions = new Transactions(this._httpClient);
        this.settlements = new Settlements(this._httpClient);
        this.reports = new Reports(this._httpClient);
        this.webhooks = new Webhooks(this._httpClient, this.config.secretKey);
        this.auth = new Auth(this._httpClient);
    }

    /**
     * Update the API key (useful for token refresh)
     * @param {string} apiKey - New API key
     */
    setApiKey(apiKey) {
        this.config.apiKey = apiKey;
        this._httpClient = new HttpClient(this.config);

        // Reinitialize resources with new client
        this.virtualAccounts = new VirtualAccounts(this._httpClient);
        this.transactions = new Transactions(this._httpClient);
        this.settlements = new Settlements(this._httpClient);
        this.reports = new Reports(this._httpClient);
        this.webhooks = new Webhooks(this._httpClient, this.config.secretKey);
        this.auth = new Auth(this._httpClient);
    }

    /**
     * Check API health status
     * @returns {Promise<Object>} Health status
     *
     * @example
     * const health = await payant.checkHealth();
     * console.log(health.status); // 'healthy'
     */
    async checkHealth() {
        return this._httpClient.get('/health');
    }

    /**
     * Make a custom API request
     * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
     * @param {string} path - API endpoint path
     * @param {Object} [data] - Request body or query params
     * @returns {Promise<Object>} API response
     *
     * @example
     * // Custom GET request
     * const result = await payant.request('GET', '/custom-endpoint', { param: 'value' });
     *
     * // Custom POST request
     * const result = await payant.request('POST', '/custom-endpoint', { data: 'value' });
     */
    async request(method, path, data = {}) {
        method = method.toUpperCase();

        switch (method) {
            case 'GET':
                return this._httpClient.get(path, data);
            case 'POST':
                return this._httpClient.post(path, data);
            case 'PUT':
                return this._httpClient.put(path, data);
            case 'DELETE':
                return this._httpClient.delete(path);
            default:
                throw new Error(`Unsupported HTTP method: ${method}`);
        }
    }
}

module.exports = AirvendClient;
