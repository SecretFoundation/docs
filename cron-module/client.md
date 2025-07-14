# Client

#### CLI

A user can query and interact with the `cron` module using the CLI.

**Query**

The `query` commands allow users to query `cron` state.

```bash
secretd query cron --help
```

**params**

The `params` command allows users to query module parameters.

```bash
secretd query cron params [flags]
```

Example:

```bash
secretd query cron params
```

Example Output:

```yaml
params:
  limit: 10
  security_address: secret10d07y265gmmuvt4z0w9aw880jnsr700jc88vt0
```
