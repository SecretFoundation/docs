# 📦 SecretVM Cluster Solutions

SecretVM lets you run more than a single VM. When you need redundancy, high availability, or workloads that scale with demand, you can deploy a **cluster** of SecretVMs that work together — all on confidential infrastructure.

There are two cluster solutions, chosen at creation time under **Deployment Mode**:

| Solution                                                | What it is                                                                                                                  | Reach for it when                                                                                                        |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| [**Load-Balanced Clusters**](load-balanced-clusters.md) | Several identical SecretVMs running the same Docker Compose app behind a managed load balancer, served from one hostname.   | You have a Docker Compose app and want redundancy, high availability, or horizontal scaling across a fixed set of nodes. |
| [**Kubernetes Clusters**](kubernetes-clusters.md)       | A K3s control plane with an autoscaler that provisions and terminates worker-node VMs on demand, plus a built-in dashboard. | You want to run standard Kubernetes manifests on infrastructure that scales itself up and down automatically.            |

### Choosing a solution

* Pick a **Load-Balanced Cluster** if your app is already a Docker Compose service and you mainly want copies of it sharing traffic behind a load balancer, with control over the balancing strategy, sticky sessions, and health checks.
* Pick a **Kubernetes Cluster** if you want a real Kubernetes environment — manifests, Deployments, Services — and want the cluster to add and remove capacity for you as workload demand changes.

Both run on SecretVMs, support secrets and confidential configuration, and are created from **Secret VMs → Create**.

Ready to dive in? Continue to the Load-Balanced Clusters or Kubernetes Clusters guide.
