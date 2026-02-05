/**
 * TypeScript definitions for @payant/merchant SDK
 */

// Configuration
export interface PayantConfig {
    /** Your API key (JWT token) */
    apiKey: string;
    /** Secret key for webhook verification (optional) */
    secretKey?: string;
    /** API base URL (defaults to production) */
    baseUrl?: string;
    /** Request timeout in milliseconds (default: 30000) */
    timeout?: number;
}

// Virtual Account Types
export interface CreateVirtualAccountData {
    /** Account holder name */
    accountName: string;
    /** Bank Verification Number */
    bvn: string;
    /** Phone number */
    phoneNumber: string;
    /** Email address (optional) */
    email?: string;
    /** Provider code (optional) */
    provider?: string;
}

export interface VirtualAccount {
    accountNumber: string;
    accountName: string;
    bvn?: string;
    phoneNumber?: string;
    tid?: string;
    email?: string;
    Provider?: {
        name: string;
        code?: string;
    };
}

export interface ListOptions {
    page?: number;
    perpage?: number;
    search?: string;
}

export interface PaginatedResponse<T> {
    status?: string;
    message?: string;
    data?: {
        accounts?: T[];
        transactions?: T[];
        settlements?: T[];
        currentPage: number;
        perPage: number;
        total: number;
        pages: number;
    };
}

export interface DisableAccountData {
    accountNumber: string;
    provider: string;
}

export interface RegisterAccountData {
    accountName: string;
    accountNumber: string;
    tid: string;
    settlementAccount: string;
    phoneNumber?: string;
}

export interface VerifyBankAccountData {
    accountNumber: string;
}

// Transaction Types
export interface Transaction {
    id: number;
    reference: string;
    transactionId: string;
    accountNumber: string;
    amount: number;
    settledAmount: number;
    status: string;
    createdAt: string;
}

// Settlement Types
export interface SettlementListOptions extends ListOptions {
    channel: string;
    startDate?: string;
    endDate?: string;
}

export interface Settlement {
    id: number;
    settlementReference: string;
    transactionId: number;
    settledAmount: number;
    status: 'pending' | 'success' | 'failed';
    settlementMode: 'auto' | 'manual';
    initiatedAt?: string;
    completedAt?: string;
}

export interface RepushData {
    startDate?: string;
    endDate?: string;
    transactionRefs?: string[];
}

export interface SettlementAccountsData {
    channel: string;
    provider?: string;
}

export interface ToggleModeData {
    channelId: string;
    providerId: string;
    settlementType: 'auto' | 'manual';
    vaasActType: 'direct' | 'globus_tp';
}

export interface UpdateStatusData {
    status: string;
}

// Report Types
export interface ReportOptions {
    startDate?: string;
    endDate?: string;
}

// Auth Types
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    status: string;
    message: string;
    data: {
        token: string;
        user: {
            id: number;
            email: string;
            name: string;
            roleId: number;
            isActive: boolean;
        };
    };
}

export interface RegisterData {
    token: string;
    email: string;
    password: string;
    name: string;
}

export interface ForgotPasswordData {
    email: string;
}

export interface ResetPasswordData {
    password: string;
}

// Webhook Types
export interface WebhookEvent {
    type?: string;
    data?: any;
    [key: string]: any;
}

export interface AcknowledgeResponse {
    status: 'received';
    timestamp: string;
    [key: string]: any;
}

// Health Check
export interface HealthResponse {
    status: 'healthy' | 'unhealthy';
    timestamp: string;
    uptime?: number;
    database?: string;
    error?: string;
}

// API Response
export interface ApiResponse<T = any> {
    status?: string;
    message?: string;
    data?: T;
}

// Resource Classes
export declare class VirtualAccounts {
    create(data: CreateVirtualAccountData): Promise<ApiResponse<VirtualAccount>>;
    get(accountNumber: string): Promise<ApiResponse<VirtualAccount>>;
    getByPhone(phoneNumber: string): Promise<ApiResponse<VirtualAccount>>;
    list(options?: ListOptions): Promise<PaginatedResponse<VirtualAccount>>;
    disable(data: DisableAccountData): Promise<ApiResponse>;
    register(provider: string, data: RegisterAccountData): Promise<ApiResponse>;
    verifyBankAccount(bankCode: string, data: VerifyBankAccountData): Promise<ApiResponse>;
}

export declare class Transactions {
    list(options?: ListOptions): Promise<PaginatedResponse<Transaction>>;
    getByAccount(accountNumber: string, options?: { reference?: string }): Promise<ApiResponse>;
    getByPOS(tid: string): Promise<ApiResponse>;
    getPOSAccount(tid: string): Promise<ApiResponse>;
}

export declare class Settlements {
    list(options?: SettlementListOptions): Promise<PaginatedResponse<Settlement>>;
    repush(data?: RepushData): Promise<ApiResponse>;
    rePush(data: RepushData): Promise<ApiResponse>;
    getAccounts(data: SettlementAccountsData): Promise<ApiResponse>;
    toggleMode(data: ToggleModeData): Promise<ApiResponse>;
    updateStatus(txRef: string, data: UpdateStatusData): Promise<ApiResponse>;
}

export declare class Reports {
    getTransactions(channelId: string, options?: ReportOptions): Promise<ApiResponse>;
    getProviderSessions(provider: string, options?: ReportOptions): Promise<ApiResponse>;
}

export declare class Webhooks {
    verifySignature(payload: object | string, signature: string): boolean;
    parseEvent(payload: object | string, signature?: string): WebhookEvent;
    acknowledge(data?: object): AcknowledgeResponse;
    getTransactionStatus(provider: string, data: object): Promise<ApiResponse>;
    sendSuccess(data: object): Promise<ApiResponse>;
}

export declare class Auth {
    login(credentials: LoginCredentials): Promise<LoginResponse>;
    register(data: RegisterData): Promise<ApiResponse>;
    forgotPassword(data: ForgotPasswordData): Promise<ApiResponse>;
    resetPassword(token: string, data: ResetPasswordData): Promise<ApiResponse>;
}

// Main Client Class
export declare class AirvendClient {
    constructor(config: PayantConfig);

    /** Virtual Accounts resource */
    virtualAccounts: VirtualAccounts;
    /** Transactions resource */
    transactions: Transactions;
    /** Settlements resource */
    settlements: Settlements;
    /** Reports resource */
    reports: Reports;
    /** Webhooks resource */
    webhooks: Webhooks;
    /** Auth resource */
    auth: Auth;

    /** Update the API key */
    setApiKey(apiKey: string): void;
    /** Check API health status */
    checkHealth(): Promise<HealthResponse>;
    /** Make a custom API request */
    request(method: string, path: string, data?: object): Promise<any>;
}

// Error Classes
export declare class AirvendError extends Error {
    statusCode: number | null;
    constructor(message: string, statusCode?: number);
}

export declare class AuthenticationError extends AirvendError {
    constructor(message?: string);
}

export declare class ValidationError extends AirvendError {
    errors: any;
    constructor(message?: string, errors?: any);
}

export declare class NotFoundError extends AirvendError {
    constructor(message?: string);
}

export declare class RateLimitError extends AirvendError {
    constructor(message?: string);
}

// Default export
export default AirvendClient;
export { AirvendClient as Payant };
