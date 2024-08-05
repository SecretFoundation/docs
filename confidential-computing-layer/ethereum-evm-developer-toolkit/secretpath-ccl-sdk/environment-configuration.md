---
description: Learn how to install and configure secret-network-ccl npm package
---

# Environment Configuration

### Getting Started

Create a new `package.json`:

```bash
npm init -y
```

Add `secret-network-ccl` and `dotenv` to your `package.json`:&#x20;

```bash
npm i secret-network-ccl && dotenv 
```

### Environment Configuration

Add your EVM private key and [API](https://www.infura.io/) endpoint to your env file:

{% code overflow="wrap" %}
```tsconfig
PRIVATE_KEY=1987d98c566f622124850322fd3a064751bdabe20f50ca9fejfldf83720

INFURA_ENDPOINT=7bb38fdfdlfjldjf022734325edecdf0e
```
{% endcode %}

You're now ready to use `secret-network-ccl`!
