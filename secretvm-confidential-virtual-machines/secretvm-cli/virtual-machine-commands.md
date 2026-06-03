# Virtual Machine Commands

Commands for managing Virtual Machine instances.

## vm list

List all your virtual machine instances.

**Usage:** `secretvm-cli vm list` or `secretvm-cli vm ls`&#x20;

**Description:**\
Retrieves and displays a list of all VM instances associated with your account. In interactive mode, it shows a table with details like ID, UUID, Name, Status, Type, Price/Hour, IP, Domain, and Creation Date.

## vm templates

List available templates for SecretVM.

**Usage:** `secretvm-cli vm templates`&#x20;

**Description:**\
Displays a list of all available VM templates. Templates provide pre-configured Docker Compose setups, environment variables, and default sizes to help you quickly launch a specific app in SecretVM.

## vm create

Create a new virtual machine.

**Usage:** `secretvm-cli vm create [options]`

**Options:**

* `-n, --name <vmName>`: The name for the new VM. (Required if not in interactive mode)
* `-t, --type <vmType>`: The type of the VM (e.g., small, medium, large). (Required if not in interactive mode)
* `-d, --docker-compose <dockerComposePath>`: Path to the `docker-compose.yaml` (or similar) file for the VM configuration. (Required if not in interactive mode)
* `-s, --tls:` Enable HTTPS with TLS
* `-c, --invite-code <inviteCode>`: An optional invite code.
* `-e, --env <env>`: Path to your .env file
* `-m, --domain`: Your custom controlled FQDN
* `-p, --persistence`: Enable filesystem persistence (state is preserved across reboots)
* `-f, --platform`: AMD SEV-SNP (sev) or Intel TDX (tdx) (default)
* `-E, --environment <env>`: Deployment environment (dev or prod (default)). Dev environment has SSH access and a few other development tools for debugging your SecretVM payload.
* `-T, --template <templateId>`: Create VM from a template (ID or name).
* `-u, --upgradeability`: Enable SecretVM upgradeability feature (state is preserved across docker image upgrades)
* `-l, --docker-credentials`: Credentials for private docker registries (username:password)
* `-r, --docker-registry`: Docker registry where your private image is hosted (default: docker.io)
* `-A, --archive <archivePath>`: Path to a .tar archive with additional files needed for the docker compose.
* `-K, --kms <kmsType>`: Type of KMS to use (GKMS, dstack, contract).
* `--eip8004-registration-json <jsonPath>`: Path to EIP-8004 registration JSON file.
* `--eip8004-chain <chainId>`: Chain to use for EIP-8004 registration (supported: base-mainnet).
* `--enable_ita, --enable_intel_trust_authority`: Enable Intel Trust Authority (ITA) JWT endpoint. TDX platform only. Enabled by default on TDX VMs.
* `--disable_ita`: Disable Intel Trust Authority (ITA) JWT endpoint.
* `--enable_poc, --enable_proof_of_cloud`: Enable Proof of Cloud (PoC) JWT endpoint. Available on all platforms. Disabled by default.
* `--disable-upgrades`: Disable SecretVM upgradeability for this VM.
* `-a, --private`: Enable private mode.
* `-h, --help`: display help for command

**Description:**\
This command allows you to provision a new VM. It requires a name, type, and a Docker Compose file. In interactive mode, if options are not provided, you will be prompted for them. The Docker Compose file is uploaded to configure the VM. Environmental variables are passed securely using KMS contract.

{% hint style="info" %}
**ITA (Intel Trust Authority):** When enabled, the VM exposes a JWT endpoint that provides Intel Trust Authority-signed attestation tokens. This allows third parties to cryptographically verify the VM's TEE integrity via Intel's attestation service. Only available on TDX-based VMs and enabled by default.

**PoC (Proof of Cloud):** When enabled, the VM exposes a JWT endpoint for Proof of Cloud verification. This registers the VM's unique Machine ID with the [ProofOfCloud](https://www.proofofcloud.org) registry, allowing anyone to verify the VM is running on genuine confidential hardware. Available on all platforms.
{% endhint %}

## vm status

View the detailed status and configuration of a specific virtual machine.

**Usage:** `secretvm-cli vm status <vmUUID>`

**Arguments:**

* `<vmUUID>`: The UUID of the virtual machine. (Required)

**Description:**\
Fetches and displays comprehensive details about the specified VM, including its system name, user-defined name, status, state, IP address, domain, creation and update times, configuration (memory, vCPUs, disk size), VM type details (CPU, RAM, disk, price), host information,  network details and provided docker-compose.yaml.

## vm start

Start a virtual machine.

**Usage:** `secretvm-cli vm start <vmId>`

**Arguments:**

* `<vmId>`: The ID of the virtual machine to start. (Required)

**Description:**\
Sends a request to start the specified VM. The command will output the status of the request.

## vm stop

Stop a virtual machine.

**Usage:** `secretvm-cli vm stop <vmId>`

**Arguments:**

* `<vmId>`: The ID of the virtual machine to stop. (Required)

**Description:**\
Sends a request to stop the specified VM. The command will output the status of the request.

## vm edit

Edits an existing virtual machine.

**Usage:** `secretvm-cli vm edit [options]`

**Options:**

* `-n, --name <vmName>`: New name for the VM.
* `-d, --docker-compose <dockerComposePath>`: Path to the updated `docker-compose.yaml` file.
* `-e, --env <env>`: Path to your .env file
* `-p, --persistence`: Enable filesystem persistence (state is preserved across reboots)
* `-l, --docker-credentials`: Credentials for private docker registries (username:password)
* `-r, --docker-registry`: Docker registry where your private image is hosted (default: docker.io)
* `--enable-ita-jwt`: Enable Intel Trust Authority JWT
* `--disable-ita-jwt`: Disable Intel Trust Authority JWT
* `--enable-poc-jwt`: Enable Proof of Cloud JWT
* `--disable-poc-jwt`: Disable Proof of Cloud JWT

\
`-h, --help`: display help for command

**Description:**\
This command allows you to edit an existing VM. Old environment variables and docker credentials (if there were any) will be lost, so it is necessary to provide them again in `edit` command.

{% hint style="info" %}
**Custom ITA API Keys:** If you want to use your own Intel Trust Authority API key instead of the default one, you can pass it via an environment file (`-e .env`) containing: `SECRETVM_ITA_KEYS={"your_key_name": {"api_key": "YOUR_API_KEY", "policy_ids": ["YOUR_POLICY_ID"]}}` This will automatically merge with the default key configuration.
{% endhint %}

## vm remove

Remove (terminate and delete) a virtual machine.

**Usage:** `secretvm-cli vm remove <vmId>`

**Arguments:**

* `<vmId>`: The ID of the virtual machine to remove. (Required)

**Description:**\
This command terminates and deletes the specified VM. In interactive mode, it will ask for confirmation before proceeding as this action is irreversible.

## vm logs

View the logs of a specified virtual machine.

**Usage:** `secretvm-cli vm logs <vmId>`

**Arguments:**

* `<vmId>`: The ID of the virtual machine whose logs you want to view. (Required)

**Description:**\
Fetches and displays the Docker logs for the specified VM.

## vm attestation \<vmId>

View the CPU attestation of a specified virtual machine.

**Usage:** `secretvm-cli vm attestation <vmId>`

**Arguments:**

* `<vmId>`: The ID of the virtual machine for which to retrieve the CPU attestation. (Required)

**Description:**\
Fetches and displays the CPU attestation data for the specified VM.
