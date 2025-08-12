# Authentication Commands

Commands for managing authentication with the SecretVM service.

## auth login

Login to the service using your Keplr wallet.

**Usage:** `secretvm-cli auth login [options]`

**Options:**

* `-w, --wallet-address <address>`: Your Keplr wallet address. If in interactive mode and this option is not provided, you will be prompted to enter it.

**Description:**\
This command initiates the login process. It retrieves a CSRF token, then attempts to log in using the provided Keplr wallet address. Successful login will save a session cookie to `~/.secretvm-cli/session.json`.

## auth logout

Logout from the service and clear the current session.

**Usage:** `secretvm-cli auth logout`

**Description:**\
This command clears the saved session information, effectively logging you out of the service.

## status

**Usage:** `secretvm-cli status`

**Description:**\
This command checks the current session. If you are logged in, it will display your user information (email or sub) and session expiry time. If you are not logged in, it will indicate so.

### API keys

**Usage:** `secretvm-cli -k $YOUR_API_KEY`

**Description:**\
You can use your API key for each `secretvm-cli` command. You can generate your API keys on [devportal](https://secretai.scrtlabs.com/keys).
