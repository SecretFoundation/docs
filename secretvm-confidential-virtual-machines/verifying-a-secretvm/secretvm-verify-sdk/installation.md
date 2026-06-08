---
icon: download
---

# Installation

{% tabs %}
{% tab title="Node.js" %}
```bash
npm install secretvm-verify
```

Requires Node.js >= 18. Built-in `crypto` and `fetch` are used; no native modules.

For the CLI:

```bash
npm install -g secretvm-verify
secretvm-verify --help
```
{% endtab %}

{% tab title="Python" %}
```bash
pip install secretvm-verify
```

Requires Python >= 3.10. Pulls in `requests`, `cryptography`, `PyYAML`, `web3`, and [`dcap-qvl`](https://pypi.org/project/dcap-qvl/) (TDX quote verification — implemented as a PyO3 binding to the upstream Rust crate).

CLI:

```bash
python -m secretvm.verify.cli --help
```
{% endtab %}
{% endtabs %}
