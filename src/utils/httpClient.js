/**
 * HTTP Client for Airvend MerchantSDK
 *
 * Handles all HTTP requests to the Payant API with authentication,
 * error handling, and response parsing.
 */

const axios = require('axios');
const { AirvendError, AuthenticationError, ValidationError, NotFoundError, RateLimitError } = require('./errors');

class HttpClient {
    /**
     * Create a new HTTP client
     * @param {Object} config - Client configuration
     * @param {string} config.baseUrl - Base URL for the API
     * @param {string} config.apiKey - API key for authentication
     * @param {string} [config.secretKey] - Secret key (if required)
     * @param {number} [config.timeout=30000] - Request timeout in ms
     */
    constructor(config) {
        this.baseUrl = config.baseUrl.replace(/\/$/, ''); // Remove trailing slash
        this.apiKey = config.apiKey;
        this.secretKey = config.secretKey;
        this.timeout = config.timeout || 30000;

        this.client = axios.create({
            baseURL: this.baseUrl,
            timeout: this.timeout,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        // Add request interceptor for authentication
        this.client.interceptors.request.use(
            (config) => this._addAuthHeaders(config),
            (error) => Promise.reject(error)
        );

        // Add response interceptor for error handling
        this.client.interceptors.response.use(
            (response) => response,
            (error) => this._handleError(error)
        );
    }

    /**
     * Add authentication headers to request
     * @private
     */
    _addAuthHeaders(config) {
        if (this.apiKey) {
            config.headers['Authorization'] = `Bearer ${this.apiKey}`;
        }
        if (this.secretKey) {
            config.headers['X-Secret-Key'] = this.secretKey;
        }
        return config;
    }

    /**
     * Handle API errors
     * @private
     */
    _handleError(error) {
        if (error.response) {
            const { status, data } = error.response;
            const message = data?.message || data?.error || error.message;

            switch (status) {
                case 401:
                    throw new AuthenticationError(message);
                case 403:
                    throw new AuthenticationError('Access denied. Check your API credentials.');
                case 404:
                    throw new NotFoundError(message);
                case 422:
                case 400:
                    throw new ValidationError(message, data?.errors || data?.data);
                case 429:
                    throw new RateLimitError('Rate limit exceeded. Please try again later.');
                default:
                    throw new AirvendError(message, status);
            }
        } else if (error.request) {
            throw new AirvendError('No response received from server. Check your network connection.');
        } else {
            throw new AirvendError(error.message);
        }
    }

    /**
     * Make a GET request
     * @param {string} path - API endpoint path
     * @param {Object} [params] - Query parameters
     * @returns {Promise<Object>} Response data
     */
    async get(path, params = {}) {
        const response = await this.client.get(path, { params });
        return response.data;
    }

    /**
     * Make a POST request
     * @param {string} path - API endpoint path
     * @param {Object} [data] - Request body
     * @returns {Promise<Object>} Response data
     */
    async post(path, data = {}) {
        const response = await this.client.post(path, data);
        return response.data;
    }

    /**
     * Make a PUT request
     * @param {string} path - API endpoint path
     * @param {Object} [data] - Request body
     * @returns {Promise<Object>} Response data
     */
    async put(path, data = {}) {
        const response = await this.client.put(path, data);
        return response.data;
    }

    /**
     * Make a DELETE request
     * @param {string} path - API endpoint path
     * @returns {Promise<Object>} Response data
     */
    async delete(path) {
        const response = await this.client.delete(path);
        return response.data;
    }
}

module.exports = HttpClient;
