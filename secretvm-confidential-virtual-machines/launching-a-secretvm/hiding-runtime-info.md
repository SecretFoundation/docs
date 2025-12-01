# 🕶️ Hiding Runtime Info

By default, SecretVM exposes multiple data points through its built-in web server running on port 29343, such as:

* CPU attestation (via /cpu endpoint)
* Docker-compose file (via /docker-compose endpoint)
* Logs (via /logs endpoint)
* Resource usage (via /resources endpoint)
* List of running docker containers (via /services endpoint)

However, there are use cases where the SecretVM owner wants to keep the workload private from the public, and only share it with select few.

This is where the "Hide Runtime Info" setting provides its value:

<figure><img src="../../.gitbook/assets/image (4).png" alt=""><figcaption></figcaption></figure>

If the developer still wants to access those endpoints, they can provide a secret access token, and still be able to access those endpoints by providing teh token as Authorization Bearer or ?token parameter.



**Note:** the /cpu attestation endpoint cannot be hidden and is always present on the machine

