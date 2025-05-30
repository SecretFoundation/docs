# Virtual Machine Commands

Commands for managing Virtual Machine instances.

## vm list

List all your virtual machine instances.

**Usage:**`secretvm-cli vm listsecretvm-cli vm ls`

**Description:**\
Retrieves and displays a list of all VM instances associated with your account. In interactive mode, it shows a table with details like ID, UUID, Name, Status, Type, Price/Hour, IP, Domain, and Creation Date.

## vm create

Create a new virtual machine.

**Usage:**`secretvm-cli vm create [options]`

**Options:**

* `-n, --name <vmName>`: The name for the new VM. (Required if not in interactive mode)
* `-t, --type <vmType>`: The type of the VM (e.g., small, medium, large). (Required if not in interactive mode)
* `-d, --docker-compose <dockerComposePath>`: Path to the `docker-compose.yaml` (or similar) file for the VM configuration. (Required if not in interactive mode)
* `-c, --invite-code <inviteCode>`: An optional invite code.

**Description:**\
This command allows you to provision a new VM. It requires a name, type, and a Docker Compose file. In interactive mode, if options are not provided, you will be prompted for them. The Docker Compose file is uploaded to configure the VM.

## vm status

View the detailed status and configuration of a specific virtual machine.

**Usage:**`secretvm-cli vm status <vmUUID>`

**Arguments:**

* `<vmUUID>`: The UUID of the virtual machine. (Required)

**Description:**\
Fetches and displays comprehensive details about the specified VM, including its system name, user-defined name, status, state, IP address, domain, creation and update times, configuration (memory, vCPUs, disk size), VM type details (CPU, RAM, disk, price), host information,  network details and provided docker-compose.yaml.

## vm start

Start a virtual machine.

**Usage:**`secretvm-cli vm start <vmId>`

**Arguments:**

* `<vmId>`: The ID of the virtual machine to start. (Required)

**Description:**\
Sends a request to start the specified VM. The command will output the status of the request.

## vm stop

Stop a virtual machine.

**Usage:**`secretvm-cli vm stop <vmId>`

**Arguments:**

* `<vmId>`: The ID of the virtual machine to stop. (Required)

**Description:**\
Sends a request to stop the specified VM. The command will output the status of the request.

## vm remove

Remove (terminate and delete) a virtual machine.

**Usage:**`secretvm-cli vm remove <vmId>`

**Arguments:**

* `<vmId>`: The ID of the virtual machine to remove. (Required)

**Description:**\
This command terminates and deletes the specified VM. In interactive mode, it will ask for confirmation before proceeding as this action is irreversible.

## vm logs

View the logs of a specified virtual machine.

**Usage:**`secretvm-cli vm logs <vmId>`

**Arguments:**

* `<vmId>`: The ID of the virtual machine whose logs you want to view. (Required)

**Description:**\
Fetches and displays the Docker logs for the specified VM.

## vm attestation \<vmId>

View the CPU attestation of a specified virtual machine.

**Usage:**`secretvm-cli vm attestation <vmId>`

**Arguments:**

* `<vmId>`: The ID of the virtual machine for which to retrieve the CPU attestation. (Required)

**Description:**\
Fetches and displays the CPU attestation data for the specified VM.
