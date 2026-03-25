# Attestation Verification Commands

## verify quote

Verifies the validity of an attestation quote

**Usage:**&#x20;

```
secretvm-cli verify quote --quote-file  <file with quote> 
```

**Description:**\
The command verifies the given quote and returns the parsed quote and all its fields

## verify workload

Verifies the validity of an attestation quote and whether the goven docker-compose file matches the attestation. If successful, proves that the machine is indeed running the given docker-compose file.

**Usage:**

```
secretvm-cli verify workload --quote-file <quote.txt> \--docker-compose <compose.yaml>
```

**Description:**\
Verifies that the given docker-compose file matches the attestation, i.e. that the confidential VM that provided the attestation is actually running the expected workload.

The command returns the parseed quote an additional workloadResults object with the following fields:

```
"workloadResult": {
    "status": "<success|failure>",
    "message": "Docker workload matches attestation",
    "vm_type": "<small|medium|large etc.>",
    "artifacts_ver": "v0.0.25",
    "environment": <prod or dev>,
    "rtmr3": "<value of RTMR3",
    "dockerFilesSha256Used": "<hash of docker files archive if present",
    "arfifactsLink": "<link to the VM artifacts>"
}
```

## verify proof-of-cloud

Verifies if a given machine is present in the ProofOfCloud registry (see [www.proofofcloud.org](https://www.proofofcloud.org))

**Usage:**

```
secretvm-cli verify proof-of-cloud --quote-file <quote.txt> 
```

**Description:**\
The command verifies that the given attestation quote is valid, retrieves the unique MachineID from the quote and checks if the machine is registered with ProofOfCloud.\
The command returns the following structure:

```
{
 "status":"success",
  "result":{
      "verified":true,
      "proof_of_cloud":true,
      "origin":"scrt",
       "machine_id":"5ba771ce30cf85428d90dc28ef8bd121"
  }
}
```
