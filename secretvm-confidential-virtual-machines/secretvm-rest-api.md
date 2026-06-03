# ⚙️ SecretVM REST API

### Base URL

Use your deployment origin, e.g. `https://secretai.scrtlabs.com`.

### Authentication

* **Bearer / x-api-key**: `Authorization: Bearer <token>`
* **Public**: No auth required.

### Error responses

Most endpoints return JSON like `{ statusCode, message }` on errors. Some return `{ error: string }` or `{ success: false, ... }`. Each endpoint lists the HTTP status codes it uses.

***

### VM

#### POST `/api/vm/create`

* Description: Create a new VM from a Docker Compose file.
* Auth: Bearer (agent signature also supported).
* Arguments:
  * Multipart file: `dockercompose` (required).
  * Body (multipart fields): `name`, `vmTypeId`, `inviteCode?`, `secrets_plaintext?`, `secrets_encrypted?`, `secrets_key?`, `docker_credentials_encrypted?`, `docker_credentials_key?`, `fs_persistence?`, `custom_domain?`, `skip_launch?`, `description?`, `environment?`, `private?`, `dev_token?`, `skip_attest?`, `kms_provider?`, `platform?`, `cloudflareApiKey?`, `eip8004_registration?` (JSON string).
* Errors: `400` missing/invalid fields, `401` unauthorized, `402` insufficient balance, `429` rate limit, `500`.
* Success: Created VM object (id, name, vmDomain, vm\_uid, etc.).
* Example: `curl -X POST https://secretai.scrtlabs.com/api/vm/create -H 'Authorization: Bearer …' -F 'name=my-vm' -F 'vmTypeId=small' -F 'dockercompose=@./docker-compose.yml'`

#### GET `/api/vm/instances`

* Description: List VM instances accessible to the user.
* Auth: Bearer.
* Arguments: none.
* Errors: `401`, `404`, `500`.
* Success: List of accessible VM instances.
* Example: `curl -s https://secretai.scrtlabs.com/api/vm/instances -H 'Authorization: Bearer …'`

#### GET `/api/vm/:id`

* Description: Fetch details for a specific VM.
* Auth: Bearer.
* Arguments: Path `id`.
* Errors: `400`, `404`, `500`.
* Success: VM object with VM type, host, and team info.
* Example: `curl -s https://secretai.scrtlabs.com/api/vm/VM_ID -H 'Authorization: Bearer …'`

#### GET `/api/vm/types`

* Description: List available VM sizes and types.
* Auth: Public.
* Arguments: none.
* Errors: `500`.
* Success: VM type list.
* Example: `curl -s https://secretai.scrtlabs.com/api/vm/types`

#### GET `/api/vm/templates`

* Description: List VM templates.
* Auth: Public.
* Arguments: none.
* Errors: `500`.
* Success: `{ count, status, templates[], timestamp }`.
* Example: `curl -s https://secretai.scrtlabs.com/api/vm/templates`

#### GET `/api/vm/latest-artifacts`

* Description: Get the latest artifacts version for the user's VMs.
* Auth: Bearer.
* Arguments: none.
* Errors: `404` no VMs, `500`.
* Success: `{ artifacts_version, status }`.
* Example: `curl -s https://secretai.scrtlabs.com/api/vm/latest-artifacts -H 'Authorization: Bearer …'`

#### POST `/api/vm/:id/launch`

* Description: Launch a VM with optional updated compose and secrets.
* Auth: Bearer.
* Arguments:
  * Path `id`.
  * Multipart optional: `dockercompose` file.
  * Body: `secrets_plaintext?`, `secrets_encrypted?`, `secrets_key?`, `docker_credentials_*?`, `description?`, `fs_persistence?`.
* Errors: `400`, `402`, `404`, `500` (and upstream status codes).
* Success: `{ status, vm: { id, vm_status, vm_name } }`.
* Example: `curl -X POST https://secretai.scrtlabs.com/api/vm/VM_ID/launch -H 'Authorization: Bearer …' -F 'dockercompose=@./compose.yml'`

#### POST `/api/vm/:id/start`

* Description: Start a stopped VM.
* Auth: Bearer.
* Arguments: Path `id`.
* Errors: `400`, `402`, `404`, `500` (and upstream status codes).
* Success: `{ status, vm: { id, vm_status, vm_name } }`.
* Example: `curl -X POST https://secretai.scrtlabs.com/api/vm/VM_ID/start -H 'Authorization: Bearer …'`

#### POST `/api/vm/:id/stop`

* Description: Stop a running VM.
* Auth: Bearer.
* Arguments: Path `id`.
* Errors: `400`, `404`, `500` (and upstream status codes).
* Success: Upstream stop JSON (e.g. `{ status, message, details }`).
* Example: `curl -X POST https://secretai.scrtlabs.com/api/vm/VM_ID/stop -H 'Authorization: Bearer …'`

#### DELETE `/api/vm/:id/terminate`

* Description: Terminate (delete) a VM.
* Auth: Bearer.
* Arguments: Path `id`.
* Errors: `400`, `403`, `404`, `500` (and upstream status codes).
* Success: `{ status, vm: { id, vm_name } }`.
* Example: `curl -X DELETE https://secretai.scrtlabs.com/api/vm/VM_ID/terminate -H 'Authorization: Bearer …'`

#### GET `/api/vm/:id/eip8004`

* Description: Fetch EIP-8004 metadata for a VM.
* Auth: Bearer.
* Arguments: Path `id`.
* Errors: `400`, `404`.
* Success: `{ metadata, agentUri, error? }` (metadata can be `null`).
* Example: `curl -s https://secretai.scrtlabs.com/api/vm/VM_ID/eip8004 -H 'Authorization: Bearer …'`

#### POST `/api/vm/batch/start`

* Description: Start multiple VMs in batch.
* Auth: Bearer.
* Arguments: JSON body `{ ids: string[] }`.
* Errors: `400` empty ids, `404` no accessible VMs.
* Success: `{ success, jobs: [{ vmId, vmInstanceId, jobId }] }`.
* Example: `curl -X POST https://secretai.scrtlabs.com/api/vm/batch/start -H 'Authorization: Bearer …' -H 'Content-Type: application/json' -d '{"ids":["id1","id2"]}'`

#### POST `/api/vm/batch/stop`

* Description: Stop multiple VMs in batch.
* Auth: Bearer.
* Arguments: JSON body `{ ids: string[] }`.
* Errors: `400`, `404`.
* Success: `{ success, jobs: [...] }`.
* Example: `curl -X POST https://secretai.scrtlabs.com/api/vm/batch/stop -H 'Authorization: Bearer …' -H 'Content-Type: application/json' -d '{"ids":["id1"]}'`

#### POST `/api/vm/batch/restart`

* Description: Restart multiple VMs in batch.
* Auth: Bearer.
* Arguments: JSON body `{ ids: string[] }`.
* Errors: `400`, `404`.
* Success: `{ success, jobs: [...] }`.
* Example: `curl -X POST https://secretai.scrtlabs.com/api/vm/batch/restart -H 'Authorization: Bearer …' -H 'Content-Type: application/json' -d '{"ids":["id1"]}'`

#### POST `/api/vm/batch/delete`

* Description: Terminate multiple VMs in batch.
* Auth: Bearer.
* Arguments: JSON body `{ ids: string[] }`.
* Errors: `400`, `404`.
* Success: `{ success, jobs: [...] }`.
* Example: `curl -X POST https://secretai.scrtlabs.com/api/vm/batch/delete -H 'Authorization: Bearer …' -H 'Content-Type: application/json' -d '{"ids":["id1"]}'`

***

### Cluster

#### POST `/api/cluster/create-background`

* Description: Queue creation of a load-balanced VM cluster.
* Auth: Bearer.
* Arguments:
  * Multipart file: `dockercompose` (required), `dockerfiles?`.
  * Body: `clusterName`, `vmTypeId`, `vmCount` (1–3), `strategy` (`roundrobin|leastconn|p2c|hrw|leasttime`), `stickySession?`, `weights?`, `backendScheme?`, `backendPort?`, health-check fields, secrets/creds, `environment?`, `private?`, `dev_token?`, `kms_provider?`, `platform?`, `skip_attest?`, `enable_app_cert?`, `password_plaintext?`, `fs_persistence?`, `upgradeability?`.
* Errors: `400`, `401`, `404`, `500`.
* Success: `{ jobId, status: 'pending' }`.
* Example: `curl -X POST https://secretai.scrtlabs.com/api/cluster/create-background -H 'Authorization: Bearer …' -F 'clusterName=cluster1' -F 'vmTypeId=small' -F 'strategy=roundrobin' -F 'dockercompose=@./compose.yml'`

#### GET `/api/cluster/:id`

* Description: Fetch cluster details and member VMs.
* Auth: Bearer.
* Arguments: Path `id`.
* Errors: `404`.
* Success: Cluster detail + `vms[]` + optional load balancer info.
* Example: `curl -s https://secretai.scrtlabs.com/api/cluster/CLUSTER_ID -H 'Authorization: Bearer …'`

#### DELETE `/api/cluster/:id`

* Description: Delete a cluster and its members.
* Auth: Bearer.
* Arguments: Path `id`.
* Errors: `404`.
* Success: `{ deleted: true, id }`.
* Example: `curl -X DELETE https://secretai.scrtlabs.com/api/cluster/CLUSTER_ID -H 'Authorization: Bearer …'`

#### PUT `/api/cluster/:id/docker-compose`

* Description: Update the stored cluster Docker Compose.
* Auth: Bearer.
* Arguments: Path `id`; JSON body `{ dockerCompose }` (raw YAML string).
* Errors: `400`, `404`, `409`.
* Success: `{ updated: true, clusterId }`.
* Example: `curl -X PUT https://secretai.scrtlabs.com/api/cluster/CLUSTER_ID/docker-compose -H 'Authorization: Bearer …' -H 'Content-Type: application/json' -d '{"dockerCompose":"version: \"3\"\\n..."}'`

#### GET `/api/cluster/:id/traffic`

* Description: Fetch cluster traffic metrics.
* Auth: Bearer.
* Arguments: Path `id`.
* Errors: `404`, `503`.
* Success: Traffic metrics from LB manager.
* Example: `curl -s https://secretai.scrtlabs.com/api/cluster/CLUSTER_ID/traffic -H 'Authorization: Bearer …'`

#### GET `/api/cluster/:id/stats`

* Description: Fetch cluster stats.
* Auth: Bearer.
* Arguments: Path `id`.
* Errors: `404`.
* Success: Stats from LB manager.
* Example: `curl -s https://secretai.scrtlabs.com/api/cluster/CLUSTER_ID/stats -H 'Authorization: Bearer …'`

#### GET `/api/cluster/:id/metrics`

* Description: Fetch cluster metrics.
* Auth: Bearer.
* Arguments: Path `id`.
* Errors: `404`.
* Success: Metrics from LB manager.
* Example: `curl -s https://secretai.scrtlabs.com/api/cluster/CLUSTER_ID/metrics -H 'Authorization: Bearer …'`

#### GET `/api/cluster/:id/backends`

* Description: List cluster load balancer backends.
* Auth: Bearer.
* Arguments: Path `id`.
* Errors: `404`.
* Success: `{ backends: [...] }`.
* Example: `curl -s https://secretai.scrtlabs.com/api/cluster/CLUSTER_ID/backends -H 'Authorization: Bearer …'`

#### POST `/api/cluster/:id/vms/add-background`

* Description: Queue adding a VM to a cluster.
* Auth: Bearer.
* Arguments: Path `id`; JSON body `{ dockerComposeBase64, secrets_*?, docker_credentials_*?, kms_provider?, description?, skip_attest?, dev_token?, private?, platform?, enable_app_cert?, vmName?, dockerfilesBase64? }`.
* Errors: `400`, `404`, `409` (cluster full).
* Success: `{ success, jobId, status, message, vmName }`.
* Example: `curl -X POST https://secretai.scrtlabs.com/api/cluster/CLUSTER_ID/vms/add-background -H 'Authorization: Bearer …' -H 'Content-Type: application/json' -d '{"dockerComposeBase64":"BASE64..."}'`

#### DELETE `/api/cluster/:id/vms/:vmId`

* Description: Remove a VM from a cluster.
* Auth: Bearer.
* Arguments: Path `id`, `vmId`.
* Errors: `404`.
* Success: `{ deleted: true, vmId }`.
* Example: `curl -X DELETE https://secretai.scrtlabs.com/api/cluster/CLUSTER_ID/vms/VM_ID -H 'Authorization: Bearer …'`

#### POST `/api/cluster/:id/update-vms-background`

* Description: Queue an update of all cluster VMs.
* Auth: Bearer.
* Arguments: Path `id`; JSON body `{ dockerComposeBase64, secrets_*?, docker_credentials_*?, kms_provider?, description? }`.
* Errors: `400`, `404`, `409`.
* Success: `{ success, jobId, status: 'pending', message }`.
* Example: `curl -X POST https://secretai.scrtlabs.com/api/cluster/CLUSTER_ID/update-vms-background -H 'Authorization: Bearer …' -H 'Content-Type: application/json' -d '{"dockerComposeBase64":"BASE64..."}'`

***

### Pricing

#### GET `/api/pricing`

* Description: List model pricing.
* Auth: Public.
* Arguments: none.
* Errors: none explicit.
* Success: `{ models: [{ key, name, inputPrice, outputPrice }] }`.
* Example: `curl -s https://secretai.scrtlabs.com/api/pricing`

#### GET `/api/coin-price/current`

* Description: Get the current coin price.
* Auth: Public.
* Arguments: none.
* Errors: returns `{ success:false }` on failure.
* Success: `{ success, data?: { symbol, price_usd, timestamp, source } }`.
* Example: `curl -s https://secretai.scrtlabs.com/api/coin-price/current`

#### GET `/api/coin-price/history`

* Description: Get historical coin prices.
* Auth: Public.
* Arguments: Query `hours?` (1–168, default 24).
* Errors: returns `{ success:false }` on invalid hours.
* Success: `{ success, data?: { symbol, hours, prices[], count } }`.
* Example: `curl -s 'https://secretai.scrtlabs.com/api/coin-price/history?hours=48'`

***

### Attestation & Verification

#### POST `/api/verify-docker`

* Description: Verify a Docker Compose file against TDX measurements.
* Auth: Public.
* Arguments: Multipart `dockercompose` (required); body fields `MRTD`, `RTMR0`, `RTMR1`, `RTMR2`, `rtmr3`, optional `dockerFilesSha256`.
* Errors: `405`, `400` missing fields, and `200` with `{ status:'error' }` for mismatch.
* Success: `{ status:'success', vm_type, artifacts_ver, rtmr3, ... }`.
* Example: `curl -X POST https://secretai.scrtlabs.com/api/verify-docker -F 'dockercompose=@compose.yml' -F 'MRTD=...' -F 'RTMR0=...' -F 'RTMR1=...' -F 'RTMR2=...' -F 'rtmr3=...'`

#### POST `/api/verify-docker-sev`

* Description: Verify a Docker Compose file against SEV measurements.
* Auth: Public.
* Arguments: Multipart `dockercompose` (required); body `family_id`, `image_id`, `measurement`.
* Errors: `405`, `400`, and `200` with `{ status:'error', code:'MISMATCH' }`.
* Success: `{ status:'success', vm_type, artifacts_ver, measurement, host_id }`.
* Example: `curl -X POST https://secretai.scrtlabs.com/api/verify-docker-sev -F 'dockercompose=@compose.yml' -F 'family_id=...' -F 'image_id=...' -F 'measurement=...'`

#### POST `/api/resolve-attestation`

* Description: Resolve attestation measurements to artifacts.
* Auth: Public.
* Arguments: JSON body `{ MRTD, RTMR0, RTMR1, RTMR2 }`.
* Errors: `405`, `400`, `404`, `500`.
* Success: `{ status:'success', vm_type, artifacts_ver }`.
* Example: `curl -X POST https://secretai.scrtlabs.com/api/resolve-attestation -H 'Content-Type: application/json' -d '{"MRTD":"...","RTMR0":"...","RTMR1":"...","RTMR2":"..."}'`

#### POST `/api/quote-parse`

* Description: Parse a TDX DCAP quote.
* Auth: Public.
* Arguments: JSON body `{ quote }`.
* Errors: `400`, `500`.
* Success: Parsed quote JSON with collateral/status fields.
* Example: `curl -X POST https://secretai.scrtlabs.com/api/quote-parse -H 'Content-Type: application/json' -d '{"quote":"..."}'`

#### POST `/api/quote-parse-sev`

* Description: Parse an SEV quote.
* Auth: Public.
* Arguments: JSON body `{ quote, processor_model? }`.
* Errors: `400`, `500` (verify failures may return 200 with `collateral.error`).
* Success: `{ collateral, status, quote }`.
* Example: `curl -X POST https://secretai.scrtlabs.com/api/quote-parse-sev -H 'Authorization: Bearer …' -H 'Content-Type: application/json' -d '{"quote":"..."}'`

#### GET `/api/gateway-attestation`

* Description: Validate gateway attestation evidence.
* Auth: Public.
* Arguments: Query `domain` or `host`, optional `port` (default 443), `includeCrtSh?`.
* Errors: `400`, `502`.
* Success: `{ checks, ... }`.
* Example: `curl -s 'https://secretai.scrtlabs.com/api/gateway-attestation?domain=example.com'`

#### GET `/api/secretvm-cert-check`

* Description: Validate SecretVM TLS certificate and attestation.
* Auth: Public.
* Arguments: Query `domain` or `host`, optional `port` (default 29343).
* Errors: `400`, `502`.
* Success: `{ ok, checks, ... }`.
* Example: `curl -s 'https://secretai.scrtlabs.com/api/secretvm-cert-check?domain=vm.example.com'`
