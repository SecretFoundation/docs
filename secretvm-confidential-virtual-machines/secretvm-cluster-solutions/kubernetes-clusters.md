---
icon: sitemap
---

# Kubernetes Clusters

A **Kubernetes cluster** deploys a [K3s](https://k3s.io) control plane as a SecretVM, together with an autoscaler that automatically provisions and terminates worker-node VMs based on demand. A Kubernetes dashboard is included so you can inspect and manage your workloads. Use this when you want to run standard Kubernetes manifests (Deployments, Services, and so on) on confidential infrastructure that scales itself.

<figure><img src="../../.gitbook/assets/image (54).png" alt=""><figcaption></figcaption></figure>

### Key concepts

| Term                     | Meaning                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------- |
| **Master node**          | The K3s control-plane SecretVM. This is the entry that appears in your VM list.       |
| **Worker node**          | A VM the autoscaler creates to run your workloads. Workers come and go automatically. |
| **Autoscaler**           | The component that adds workers when there's pending work and removes idle ones.      |
| **Node scaling range**   | The minimum and maximum number of worker nodes the autoscaler may run.                |
| **Kubernetes dashboard** | The built-in web UI for viewing and managing cluster workloads.                       |

### Creating a Kubernetes cluster

1. Go to **Secret VMs → Create**.
2. Under **Deployment Mode**, choose **Kubernetes** ("Auto-scaling K3s cluster with worker nodes").
3. Enter a **Cluster Name** (up to 60 characters).
4. Provide your **Docker Compose** / workload configuration and any secrets as usual.
5. Configure the Kubernetes options described below.
6. Click **Launch Kubernetes Cluster**.

The master node is provisioned in the background. Once it's ready it appears in your Secret VMs list with a **K8s Cluster** badge, alongside a count of its current worker nodes.

#### Kubernetes configuration options

**Node Scaling Range**

The bounds the autoscaler operates within:

* **Min Nodes** — the minimum number of worker nodes to keep running. Range **0–10**, default **0**. With a minimum of 0, the cluster scales down to no workers when idle.
* **Max Nodes** — the upper limit on worker nodes. Range **1–20**, default **4**.

Min must be less than or equal to Max.

**k3s Server NodePort Bindings (optional)**

Extra ports to expose on the K3s server, given as a comma- or space-separated list (for example `30080, 30081`). Each port is mapped as `<port>:<port>` on the `k3s-server` service. Leave blank if you don't need to expose additional NodePorts.

**Scale Down Unneeded Duration (optional)**

How long a worker node must sit unneeded before the autoscaler removes it, for example `10m` or `1h`. Default **10m**. Increase it to avoid churn from short idle periods; decrease it to reclaim capacity faster.

**Max Node Provision Time (optional)**

The maximum time the autoscaler waits for a new worker node to become ready before giving up on it, for example `15m` or `30m`. Default **15m**.

### Accessing the cluster

After creation, open the cluster's master node from your Secret VMs list (look for the **K8s Cluster** badge) to reach its detail page.

#### Accessing the Kubernetes dashboard

There are two ways to reach the dashboard from the master node's detail page:

* **Embedded dashboard (in-portal).** Open the **K8s Dashboard** tab. This shows a read-only view of your cluster — nodes, deployments, pods, services, config maps, secrets, events, and more — without leaving the portal. Use it for a quick look at what's running and the health of your workloads.
* **Full dashboard (new tab).** Click the **K8s Dashboard** button in the master node's action bar (next to _Edit K8s Cluster_). This opens the full Kubernetes Dashboard UI in a new browser tab, served from the master node on port **30777**.

{% hint style="info" %}
The dashboard buttons and tab appear only on the **master node**. Worker nodes don't expose a dashboard of their own.
{% endhint %}

To run your own workloads, apply standard Kubernetes manifests (Deployments, Services, ConfigMaps, and so on) as you would on any K3s cluster. As pods are scheduled, the autoscaler provisions worker nodes up to your **Max Nodes** limit; when workers fall idle past the **Scale Down Unneeded Duration**, they're terminated automatically.

{% hint style="info" %}
**Example manifests.** For ready-to-use deployment examples, see the [SecretVM Kubernetes examples repository](https://github.com/scrtlabs/secretvm-k8s-examples).
{% endhint %}

{% hint style="info" %}
Worker nodes are managed for you. They appear in your VM list grouped under the master node, and their count is shown on the master's **K8s Cluster** badge. You normally don't create or delete workers by hand — the autoscaler does it based on load and your scaling range.
{% endhint %}

### Autoscaling behaviour

* The autoscaler **adds** worker nodes when there is pending work that existing nodes can't schedule, up to **Max Nodes**.
* It **removes** a worker once it has been unneeded for the **Scale Down Unneeded Duration**, down to **Min Nodes**.
* A worker that doesn't become ready within the **Max Node Provision Time** is treated as failed.

Tune **Min Nodes** for baseline capacity (keeping warm workers ready for traffic) and **Max Nodes** to cap cost. Adjust the scale-down duration to balance responsiveness against churn.

### Deleting a Kubernetes cluster

Delete the master node from your Secret VMs as you would any VM. This tears down the control plane; the autoscaler stops, and its managed worker nodes are cleaned up.

### Tips

* Keep **Min Nodes** at 0 for spiky or development workloads to avoid paying for idle capacity; raise it for production services that must respond instantly to traffic.
* Only expose the **NodePort** bindings you actually need — each one is published on the K3s server.
* If new workers seem to never come up, check that your **SecretVM API key** is valid and that **Max Node Provision Time** is long enough for a VM to boot in your account.
