/**
 * Auth Resource
 *
 * Authentication operations - login, register, password management.
 */

class Auth {
    /**
     * @param {HttpClient} client - HTTP client instance
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * Login to get authentication token
     * @param {Object} credentials - Login credentials
     * @param {string} credentials.email - User email
     * @param {string} credentials.password - User password
     * @returns {Promise<Object>} Authentication response with token
     *
     * @example
     * const auth = await payant.auth.login({
     *   email: 'user@example.com',
     *   password: 'password123'
     * });
     * console.log(auth.token);
     */
    async login(credentials) {
        return this.client.post('/login', credentials);
    }

    /**
     * Register a new user (requires invitation token)
     * @param {Object} data - Registration data
     * @param {string} data.token - Invitation token
     * @param {string} data.email - User email
     * @param {string} data.password - User password
     * @param {string} data.name - User name
     * @returns {Promise<Object>} Registration result
     *
     * @example
     * const result = await payant.auth.register({
     *   token: 'invitation-token',
     *   email: 'newuser@example.com',
     *   password: 'securepassword',
     *   name: 'John Doe'
     * });
     */
    async register(data) {
        return this.client.post('/register', data);
    }

    /**
     * Request password reset
     * @param {Object} data - Reset request data
     * @param {string} data.email - User email
     * @returns {Promise<Object>} Reset request result
     *
     * @example
     * await payant.auth.forgotPassword({ email: 'user@example.com' });
     */
    async forgotPassword(data) {
        return this.client.post('/forgot-password', data);
    }

    /**
     * Reset password with token
     * @param {string} token - Password reset token
     * @param {Object} data - New password data
     * @param {string} data.password - New password
     * @returns {Promise<Object>} Reset result
     *
     * @example
     * await payant.auth.resetPassword('reset-token', {
     *   password: 'newSecurePassword123'
     * });
     */
    async resetPassword(token, data) {
        return this.client.post(`/reset-password/${token}`, data);
    }
}

module.exports = Auth;
