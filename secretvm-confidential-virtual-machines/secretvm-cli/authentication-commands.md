# Authentication Commands

Commands for managing authentication with the SecretVM service.

## auth login

Login to the service using your Keplr wallet.

**Note**: Works only in interactive mode (`-i, --interactive`)

**Usage:** `secretvm-cli auth login`

**Description:** \
Initiates an interactive browser-based login session. This command opens the SecretAI sign-in page for authentication via Keplr wallet and starts a local server to capture the resulting credentials.

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
