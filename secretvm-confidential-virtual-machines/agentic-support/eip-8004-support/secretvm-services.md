# 🍽️ SecretVM services

### Default Services

When registering on 8004, two default services are created to enable easy verification of authenticity of the agentic VM:

#### teequote

The teequote service exposes the VM’s attestation quote.

This endpoint allows external clients, validators, or integrators to retrieve attestation evidence for the running VM and verify that it is executing inside a trusted execution environment.

#### workload

The workload service exposes the VM workload manifest.

In SecretVM, this is the deployed docker-compose.yaml, allowing clients to inspect the declared workload configuration associated with the registered agent.

#### Custom Services

ERC-8004 allows an agent to advertise any number of service endpoints in its registration file. Service entries commonly include at least:

* name
* endpoint
* optional version

SecretVM follows this model and lets you add additional custom services to describe extra APIs, agent capabilities, or integration points. This is aligned with ERC-8004, which explicitly supports customizable endpoint lists rather than restricting agents to a fixed interface.&#x20;

Examples of additional services you may want to register:

* inference API
* MCP endpoint
* A2A endpoint
* health/status endpoint
* custom business API

