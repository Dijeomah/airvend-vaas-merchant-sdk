# @airvend/vaas-merchant

Official Node.js SDK for the Airvend MerchantAPI. Easily integrate virtual accounts, settlements, transactions, and payment notifications into your application.

## Installation

```bash
npm install @airvend/vaas-merchant
```

## Quick Start

```javascript
const Payant = require('@airvend/vaas-merchant');

const payant = new Payant({
  apiKey: 'your-api-key'
});

// Create a virtual account
const account = await payant.virtualAccounts.create({
  accountName: 'John Doe',
  bvn: '12345678901',
  phoneNumber: '08012345678'
});

console.log(account.data.accountNumber);
```

## Configuration

```javascript
const payant = new Payant({
  // Required: Your API key (JWT token)
  apiKey: 'your-api-key',

  // Optional: Secret key for webhook signature verification
  secretKey: 'your-webhook-secret',

  // Optional: Custom API base URL (defaults to production)
  baseUrl: 'https://pwt.airvend.ng/api/v1',

  // Optional: Request timeout in milliseconds (default: 30000)
  timeout: 30000
});
```

## Resources

### Virtual Accounts

```javascript
// Create a virtual account
const account = await payant.virtualAccounts.create({
  accountName: 'John Doe',
  bvn: '12345678901',
  phoneNumber: '08012345678',
  email: 'john@example.com', // optional
  provider: 'providus'       // optional
});

// Get account by account number
const account = await payant.virtualAccounts.get('1234567890');

// Get account by phone number
const account = await payant.virtualAccounts.getByPhone('08012345678');

// List all accounts with pagination
const accounts = await payant.virtualAccounts.list({
  page: 1,
  perpage: 20,
  search: 'John'
});

// Disable an account
await payant.virtualAccounts.disable({
  accountNumber: '1234567890',
  provider: 'providus'
});

// Register a virtual account
await payant.virtualAccounts.register('providus', {
  accountName: 'John Doe',
  accountNumber: '1234567890',
  tid: 'terminal-id',
  settlementAccount: '0987654321',
  phoneNumber: '08012345678'
});

// Verify a bank account
const verification = await payant.virtualAccounts.verifyBankAccount('058', {
  accountNumber: '1234567890'
});
```

### Transactions

```javascript
// List all transactions
const transactions = await payant.transactions.list({
  page: 1,
  perpage: 20
});

// Get transactions by account number
const transactions = await payant.transactions.getByAccount('1234567890', {
  reference: 'optional-reference'
});

// Get POS transactions
const posTransactions = await payant.transactions.getByPOS('terminal-id');

// Get POS account details
const posAccount = await payant.transactions.getPOSAccount('terminal-id');
```

### Settlements

```javascript
// List settlements
const settlements = await payant.settlements.list({
  channel: '1',
  page: 1,
  perpage: 20,
  startDate: '2024-01-01',
  endDate: '2024-12-31'
});

// Re-push failed settlements
await payant.settlements.repush({
  startDate: '2024-01-01',
  endDate: '2024-01-31',
  transactionRefs: ['ref1', 'ref2']
});

// Get settlement accounts
const accounts = await payant.settlements.getAccounts({
  channel: '1',
  provider: 'providus'
});

// Toggle settlement mode
await payant.settlements.toggleMode({
  channelId: '1',
  providerId: 'providus',
  settlementType: 'auto', // 'auto' or 'manual'
  vaasActType: 'direct'   // 'direct' or 'globus_tp'
});

// Update settlement status
await payant.settlements.updateStatus('transaction-ref', {
  status: 'success'
});
```

### Reports

```javascript
// Get transaction report
const report = await payant.reports.getTransactions('channel-id', {
  startDate: '2024-01-01',
  endDate: '2024-12-31'
});

// Get provider session report
const sessions = await payant.reports.getProviderSessions('providus', {
  startDate: '2024-01-01',
  endDate: '2024-12-31'
});
```

### Authentication

```javascript
// Login
const auth = await payant.auth.login({
  email: 'user@example.com',
  password: 'password123'
});

// Update client with new token
payant.setApiKey(auth.data.token);

// Register (requires invitation token)
await payant.auth.register({
  token: 'invitation-token',
  email: 'newuser@example.com',
  password: 'securepassword',
  name: 'John Doe'
});

// Forgot password
await payant.auth.forgotPassword({
  email: 'user@example.com'
});

// Reset password
await payant.auth.resetPassword('reset-token', {
  password: 'newSecurePassword'
});
```

### Webhooks

Handle incoming webhooks from Payant:

```javascript
const express = require('express');
const Payant = require('@airvend/vaas-merchant');

const app = express();
const payant = new Payant({
  apiKey: 'your-api-key',
  secretKey: 'your-webhook-secret'
});

app.post('/webhook', express.json(), (req, res) => {
  const signature = req.headers['x-payant-signature'];

  // Verify signature
  if (!payant.webhooks.verifySignature(req.body, signature)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Parse the event
  const event = payant.webhooks.parseEvent(req.body);

  // Handle different event types
  switch (event.type) {
    case 'transaction.success':
      console.log('Payment received:', event.data);
      break;
    case 'transaction.failed':
      console.log('Payment failed:', event.data);
      break;
  }

  // Send acknowledgment
  res.json(payant.webhooks.acknowledge());
});

app.listen(3000);
```

### Health Check

```javascript
// Check API health
const health = await payant.checkHealth();
console.log(health.status); // 'healthy'
```

### Custom Requests

For endpoints not covered by the SDK:

```javascript
// GET request
const result = await payant.request('GET', '/custom-endpoint', { param: 'value' });

// POST request
const result = await payant.request('POST', '/custom-endpoint', { data: 'value' });
```

## Error Handling

The SDK throws specific errors for different scenarios:

```javascript
const {
  AirvendError,
  AuthenticationError,
  ValidationError,
  NotFoundError,
  RateLimitError
} = require('@airvend/vaas-merchant');

try {
  const account = await payant.virtualAccounts.get('invalid-account');
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.log('Invalid or expired API key');
  } else if (error instanceof NotFoundError) {
    console.log('Account not found');
  } else if (error instanceof ValidationError) {
    console.log('Validation failed:', error.errors);
  } else if (error instanceof RateLimitError) {
    console.log('Too many requests, slow down');
  } else if (error instanceof AirvendError) {
    console.log('API error:', error.message, error.statusCode);
  }
}
```

## TypeScript Support

The SDK includes TypeScript definitions:

```typescript
import Payant, { PayantConfig, VirtualAccount, Transaction } from '@airvend/vaas-merchant';

const config: PayantConfig = {
  apiKey: 'your-api-key',
  secretKey: 'your-webhook-secret'
};

const payant = new Payant(config);

const account: VirtualAccount = await payant.virtualAccounts.get('1234567890');
```

## License

MIT
