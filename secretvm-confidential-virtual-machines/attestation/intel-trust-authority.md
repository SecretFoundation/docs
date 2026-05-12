# 📝 Intel Trust Authority

**What is Intel Trust Authority?**

[Intel Trust Authority (ITA)](https://www.intel.com/content/www/us/en/security/trust-authority.html) is a zero-trust, independent attestation service that verifies the trustworthiness of compute assets. It provides assurance that your Confidential Computing environments (such as Intel TDX) are genuine and correctly configured, regardless of who manages the data center.

Upon successful appraisal, ITA issues a cryptographically signed **JSON Web Token (JWT)**, serving as a portable, universally verifiable proof of the VM's integrity.

**Why use ITA with SecretVM?**

Integrating ITA alongside Secret Network's native KMS brings powerful benefits:

* **Universal Portability:** Standardized JWTs can be verified seamlessly by off-chain services, web backends, and non-blockchain applications.
* **Independent Root of Trust:** Provides an operator-independent root of trust backed directly by Intel's infrastructure.
* **Custom Security Policies:** Easily enforce specific appraisal policies (via `POLICY_ID`) on runtime measurements before a JWT is issued.

**Enabling ITA in SecretVM**

By default, an ITA token is generated for every TDX-based SecretVM. This default token is appraised and checked against Secret Network's custom security policy using our fallback API key.

If you wish to manage your own attestations or enforce custom policies, you can override these defaults during deployment via the **Secret AI DevPortal** or the **SecretVM CLI**.

<table><thead><tr><th width="200">Parameter</th><th width="150">Required</th><th>Description</th></tr></thead><tbody><tr><td><code>ITA_API_KEY</code></td><td>No</td><td>The API key used to authenticate with the Intel Trust Authority service. If omitted, Secret Labs provides a default fallback key. You can supply your own API key to manage and track your attestations.</td></tr><tr><td><code>POLICY_ID</code></td><td>No</td><td>A custom policy identifier defined in your Intel Trust Authority account to enforce specific measurement appraisals. If omitted, the default Secret Network policy is used.</td></tr></tbody></table>

**Retrieving the ITA JWT**

There are three primary ways to obtain the ITA JWT for your SecretVM:

**1. Direct Endpoint on the SecretVM (Recommended)** Because ITA is enabled by default on TDX-based VMs, the JWT is served dynamically from the VM itself. You can retrieve it at any time by making a simple HTTP GET request to the `/ita_jwt` endpoint on your SecretVM.

**2. Via the Secret AI DevPortal** The JWT can also be easily generated and copied directly from the Secret AI DevPortal UI. The portal communicates with the VM's internal attestation server to generate and display the token on demand.

**3. Manual Request to Intel Trust Authority** Users can obtain the JWT manually by interacting directly with the Intel Trust Authority API:

1. **Quote Generation:** Obtain a fresh raw hardware quote directly from the underlying TDX hardware within your SecretVM (e.g., via the internal `secret-vm-attest-rest-server`).
2. **Appraisal Request:** Transmit this hardware quote, alongside your `ITA_API_KEY` and `POLICY_ID`, directly to the Intel Trust Authority API (e.g., `api.eu.trustauthority.intel.com`).
3. **Issuance:** If the quote successfully satisfies your policy and Intel's baseline security requirements, ITA will return a signed JWT directly to you.
