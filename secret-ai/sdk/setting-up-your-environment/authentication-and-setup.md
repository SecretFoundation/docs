# Authentication & Setup

### Authentication & Setup

#### API Key Setup

To use the Secret AI SDK, you need a Secret AI API Key. Visit the [SecretAI Development Portal](https://aidev.scrtlabs.com/) to obtain your key.

Set your API key as an environment variable:

```bash
export SECRET_AI_API_KEY='your_api_key_here'
```

#### Environment Configuration

The SDK supports various configuration options via environment variables:

```bash
# Authentication
export SECRET_AI_API_KEY='your_api_key'

# Secret Network Configuration
export SECRET_NODE_URL='your_lcd_node_url'
export SECRET_CHAIN_ID='secret-4'
export SECRET_WORKER_SMART_CONTRACT='secret1xv90yettghx8uv6ug23knaf5mjqwlsghau6aqa'

# Network & Timeout Settings (seconds)
export SECRET_AI_REQUEST_TIMEOUT='30.0'
export SECRET_AI_CONNECT_TIMEOUT='10.0'

# Retry Configuration
export SECRET_AI_MAX_RETRIES='3'
export SECRET_AI_RETRY_DELAY='1.0'
export SECRET_AI_RETRY_BACKOFF='2.0'
export SECRET_AI_MAX_RETRY_DELAY='60.0'
```
