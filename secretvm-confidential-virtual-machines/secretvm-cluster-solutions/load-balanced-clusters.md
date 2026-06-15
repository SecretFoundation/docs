---
icon: diagram-project
---

# Load-Balanced Clusters

## Clusters

A **Cluster** runs several identical SecretVMs behind a managed load balancer. All nodes run the same Docker Compose file and share a single public hostname; incoming traffic is distributed across the nodes according to the strategy you choose. Use a cluster when you need redundancy, high availability, or horizontal scaling for a stateless (or session-aware) workload.

<figure><img src="../../.gitbook/assets/image (55).png" alt=""><figcaption></figcaption></figure>

### Key concepts

| Term                 | Meaning                                                                            |
| -------------------- | ---------------------------------------------------------------------------------- |
| **Node / member VM** | One SecretVM in the cluster. Every node runs the same Docker Compose.              |
| **Load balancer**    | The managed front door that receives all traffic and forwards it to healthy nodes. |
| **Strategy**         | The rule used to decide which node handles each request.                           |
| **Health check**     | A periodic probe the load balancer uses to mark a node healthy or unhealthy.       |
| **Sticky sessions**  | Pins a given user to the same node for the life of their session.                  |
| **Cluster hostname** | The single `https://…` URL that serves your cluster.                               |

### Creating a cluster

1. Go to **Secret VMs → Create**.
2. Under **Deployment Mode**, choose **Cluster** ("Multiple VMs behind a load balancer").
3. Enter a **Cluster Name** (up to 60 characters).
4. Provide your **Docker Compose** file and any secrets, exactly as you would for a single VM. Every node in the cluster runs this same configuration.
5. Configure the cluster options described below.
6. Click **Launch Cluster**.

The cluster is provisioned in the background: each node is created, the load balancer is configured, and the nodes are registered as backends. When finished, the cluster appears in your Secret VMs list with a **Cluster** badge and is reachable at its generated hostname.

#### Cluster configuration options

**Number of VMs**

How many nodes to launch (default **2**). You can add or remove nodes later.

**Load Balancing Strategy**

How requests are spread across the nodes:

| Strategy                  | Behaviour                                                       | Best for                                    |
| ------------------------- | --------------------------------------------------------------- | ------------------------------------------- |
| **Round Robin** (default) | Distributes requests evenly across all backends in rotation.    | Stateless apps with uniform capacity.       |
| **Least Connections**     | Routes to the backend with the fewest active connections.       | Long-lived requests or mixed workloads.     |
| **Power of Two Choices**  | Picks two backends at random and routes to the less loaded one. | Reducing hot spots better than pure random. |
| **IP Hash**               | Routes requests from the same client IP to the same backend.    | A stateless alternative to sticky cookies.  |

**Backend Weights**

Only shown when **Round Robin** is selected. Assign each node a weight from **1 to 10** (default **1**). A node with a higher weight receives proportionally more traffic — useful when nodes have uneven capacity.

**Sticky Sessions**

Off by default. When enabled, each user is pinned to the same backend via a cookie. Turn this on when your app stores session state on the server side (for example HTTP sessions or in-memory caches) so a user keeps hitting the node that holds their state.

**Backend Connection**

Tells the load balancer how to reach your app **on each node**:

* **Scheme** — `HTTPS` (default) or `HTTP`.
* **Port** — the port your app listens on, `1`–`65535` (default **443**).

**Health Check**

How the load balancer decides whether a node is healthy enough to receive traffic:

* **Scheme** — `HTTPS` (default) or `HTTP`.
* **Path** — the endpoint to probe (default `/cpu`).
* **Port** — the port to probe, `1`–`65535` (default **29343**).

A node that fails its health check is automatically pulled out of rotation until it recovers.

**Custom Domain (optional)**

By default the cluster is served from an automatically generated hostname. To serve it from your own domain instead, enter it here (for example `api.example.com`).

{% hint style="warning" %}
Before creating the cluster, point an **A record** for your custom domain to the LB Manager IP shown in the form. The cluster won't serve traffic on your domain until DNS resolves to that address.
{% endhint %}

### Managing a cluster

Open a cluster from the Secret VMs list (look for the **Cluster** badge) to reach its overview page. From there you can monitor it, change its membership, and update its configuration.

#### Overview tab

The overview shows live information about the cluster:

* **Header** — the cluster name, a status indicator, and the cluster hostname with buttons to open it in a new tab or copy the URL. A **Refresh** button reloads the live data.
* **Cluster Info** — strategy, whether sticky sessions are enabled, the health-check path and port, max connections, SSL certificate expiry, creation date, and node count.
* **Traffic** — total requests, average and P95 latency, and bandwidth out. Shows "No traffic data yet" until requests have been served.
* **SecretVMs (n)** — the list of member nodes. Each row shows the node name, domain, memory and vCPU, its run status, and a **health badge** from the load balancer (**Healthy**, **Unhealthy**, or an unknown `LB: ?` state). From here you can add or remove nodes.
* **Requests by Status Code** — a breakdown of responses (e.g. HTTP 200, 404, 5xx) so you can spot error spikes.

#### Compose File tab

Shows the Docker Compose file the cluster runs. You can copy it, or click **Edit** to change the configuration for the whole cluster (see Updating).

#### Adding a node

1. On the overview page, in the **SecretVMs** card, click **Add SecretVM**. (The button is disabled when the cluster already has 3 nodes or is mid-update.)
2. Give the new node a **VM Name** unique within the cluster.
3. The Docker Compose is pre-filled from the cluster. Adjust secrets if needed.
4. Submit. A new node is created and registered with the load balancer.

The cluster stays reachable at its hostname the entire time.

{% hint style="info" %}
A cluster can hold a maximum of **3** nodes. At the limit, the add button reads **Cluster at VM Limit (3)** and is disabled.
{% endhint %}

#### Removing a node

In the **SecretVMs** card, click the remove (✕) button on a node. Removing a node permanently terminates that VM and takes it out of the load balancer. This cannot be undone.

#### Updating the cluster configuration

To change the app running on every node:

1. Open the cluster and go to the **Compose File** tab, then click **Edit** (or open the **Edit Cluster VMs** page directly).
2. Edit the Docker Compose and/or secrets.
3. Click **Apply to All VMs**.

Changes are applied to the nodes **sequentially**, one at a time, so the cluster keeps serving traffic throughout the rollout.

{% hint style="warning" %}
**Non-upgradeable VMs are restarted and their persistent state is lost** when you apply an update. If the cluster was not created as upgradeable, you must also re-enter your encrypted secrets — previous values are not retained.
{% endhint %}

#### Deleting a cluster

From the overview (or edit) page, click **Delete Cluster** and confirm. This permanently deletes the cluster, its load balancer configuration, and **all** member VMs. This action cannot be undone.

### Tips

* Prefer **Round Robin** with equal weights for stateless apps; reach for **Sticky Sessions** or **IP Hash** only when your app keeps per-user state on the server.
* Make sure your health-check endpoint is cheap and fast — it's hit repeatedly on every node.
* Roll out config changes during low-traffic windows when nodes are non-upgradeable, since each one restarts as it updates.
