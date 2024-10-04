# How to deploy SecretPath on your chain

Secretpath in itself is a trustless protocol, meaning that everyone can deploy a public gateway on their own chain. Here's how to do it:&#x20;

### Prerequisites

Before you begin, make sure you have the following installed on your system:

* **Git**: Version control system for cloning repositories.
* **Foundry**: A blazing fast, portable, and modular toolkit for Ethereum application development.
* **Anaconda**: For creating a virtual environment (Python 3.11).
* **Python 3.11 &** : Required for running the relayer scripts. Python package installer.
* **Access to the Sepolia Testnet**: You'll need to interact with the edeXa Testnet.

## Cloning the Repository and Initial Setup

1.  **Clone the SecretPath Repository**

    ```bash
    git clone -b Solana https://github.com/SecretSaturn/SecretPath.git
    ```
2.  **Navigate to the Public Gateway Directory**

    ```bash
    cd SecretPath/TNLS-Gateways/public-gateway
    ```
3.  **Initialize Submodules**

    ```bash
    git submodule update --init --recursive
    ```

## Deploying the Gateway Contract

You'll deploy the gateway contract using Foundry's `forge` tool.

### **Run the Forge Script**

Replace `<YOUR_PRIVATE_KEY>` with your actual private key. **Keep your private key secure and do not share it.**

```bash
forge script script/DeployGatewayScript.s.sol:DeployGatewayScript \
  --rpc-url "https://rpc.sepolia.org" \
  --broadcast \
  --retries 10 \
  -vvv \
  --optimize \
  --optimizer-runs 10000000 \
  --legacy \
  --private-key <YOUR_PRIVATE_KEY> \
  --evm-version paris
```

### **Handling Gas Price Error**

If you encounter the following error:

```vbnet
Error:
Failed to send transaction

Context:
- server returned an error response: error code -32009: Gas price below configured minimum gas price
```

You need to adjust the gas price.

a. **Estimate the Correct Gas Price**

Visit the Ethereum Sepolia Testnet explorer to check recent gas prices:

```arduino
https://sepolia.etherscan.io
```

b. **Add the Gas Price Flag**

Re-run the forge script with the `--with-gas-price` flag:

```bash
forge script script/DeployGatewayScript.s.sol:DeployGatewayScript \
  --rpc-url "https://rpc.sepolia.org" \
  --broadcast \
  --retries 10 \
  -vvv \
  --optimize \
  --optimizer-runs 10000000 \
  --legacy \
  --private-key <YOUR_PRIVATE_KEY> \
  --evm-version paris \
  --with-gas-price 2gwei
```

### **Understanding the Deployment Output**

Upon successful deployment, you will see two contract addresses:

* **Implementation Address**: The first address, representing the implementation contract.
* **Gateway Address**: The second address, which is the Transparent Upgradeable Proxy contract.

**Note**: The Gateway Admin is your wallet address (you are the owner of the contracts). The Proxy Admin is specified in the logs of the Gateway Address contract deployment. The Proxy Admin contract is exclusively used for upgrading contracts, and the Gateway Admin is the owner of this Proxy Admin contract.

## Configuring the Relayer

### **Navigate to the Relayer Directory**

```bash
cd ../../TNLS-RELAYERS
```

### **Open `config.yml` for Editing**

```bash
nano config.yml
```

### **Add the Following Configuration**

Replace `<YOUR_GATEWAY_ADDRESS>` with the Gateway Address obtained from the deployment step.

```yaml
"11155111": #Ethereum Sepolia
  active: false
  type: "evm"
  chain_id: "11155111"
  api_endpoint: https://eth-sepolia-public.unifra.io
  contract_address: "0x3879E146140b627a5C858a08e507B171D9E43139"
  timeout: 1
```

### **Add Environment Variables**

Create a `.env` file or set the following environment variables. Replace the placeholders with your actual private keys. **Keep your private keys secure and do not share them.**

```markup
ethereum-private-key = <YOUR_ETHEREUM_PRIVATE_KEY>
solana-private-key = <YOUR_SOLANA_PRIVATE_KEY>
secret-private-key = <YOUR_SECRET_PRIVATE_KEY>
```

## Setting Up the Virtual Environment

### **Install Anaconda**

Download and install Anaconda for your operating system:

* [Anaconda Installation Guide](https://docs.anaconda.com/anaconda/install/)

### **Create a Virtual Environment**

```bash
conda create --name secretpath_env python=3.11
```

### **Activate the Virtual Environment**

```bash
conda activate secretpath_env
```

### **Install Dependencies**

Navigate to the relayer directory if you're not already there:

```bash
cd TNLS-RELAYERS
```

Install the required Python packages, make sure to not install depencencies as this may lead to dependency hell.

```bash
pip install -r requirements.txt --no-dependencies
```

## Running the Relayer

### **Start the Relayer**

```bash
python3 web_app.py
```

### **Handling the `LRU` Error**

If you encounter an error related to `lru-dict`, update it using:

```bash
pip install --upgrade lru-dict
```
