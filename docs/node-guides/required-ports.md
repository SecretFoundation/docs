    26656 ingress + egress
        p2p networking port to connect to the tendermint network
        If using a sentry:
          On a validator this port needs to be exposed to sentry nodes
          On a sentry node this port needs to be exposed to the open internet
        If not using a sentry:
          On a validator this port needs to be exposed to the open internet

    26657 egress only
        Tendermint RPC port
        This should be shielded from the open internet

    26658 egress only
        Out of process ABCI app
        This should be shielded from the open internet

    26660 egress only
        Prometheus stats server
        Stats about the gaiad process
        Needs to be enabled in the config file.
        This should be shielded from the open internet

    1317 egress only
        Light Client Daemon
        For automated management of anything you can do with the CLI
        Must be started from cli first
        This should be shielded from the open internet
