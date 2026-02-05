/**
 * Custom Error Classes for Airvend MerchantSDK
 */

/**
 * Base error class for all Payant errors
 */
class AirvendError extends Error {
    constructor(message, statusCode = null) {
        super(message);
        this.name = 'AirvendError';
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Authentication error (401, 403)
 */
class AuthenticationError extends AirvendError {
    constructor(message = 'Authentication failed') {
        super(message, 401);
        this.name = 'AuthenticationError';
    }
}

/**
 * Validation error (400, 422)
 */
class ValidationError extends AirvendError {
    constructor(message = 'Validation failed', errors = null) {
        super(message, 422);
        this.name = 'ValidationError';
        this.errors = errors;
    }
}

/**
 * Resource not found error (404)
 */
class NotFoundError extends AirvendError {
    constructor(message = 'Resource not found') {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}

/**
 * Rate limit error (429)
 */
class RateLimitError extends AirvendError {
    constructor(message = 'Rate limit exceeded') {
        super(message, 429);
        this.name = 'RateLimitError';
    }
}

module.exports = {
    AirvendError,
    AuthenticationError,
    ValidationError,
    NotFoundError,
    RateLimitError
};
