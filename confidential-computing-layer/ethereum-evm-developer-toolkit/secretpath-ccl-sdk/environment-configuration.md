# Environment Configuration

### Getting Started

Create a new `package.json`:

```
npm init -y
```

Add `secret-network-ccl` to your `package.json`:&#x20;

```javascript
npm i secret-network-ccl
```

### Environment Configuration

Add your EVM private key and API endpoint for your chain of choice:

```javascript
let privateKey = process.env.PRIVATE_KEY;
let endpoint = `https://sepolia.infura.io/v3/${process.env.INFURA_ENDPOINT}`;
```
