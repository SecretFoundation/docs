module.exports = {
  title: "Secret Network",
  description: "Privacy is a Public Good",
  head: [["link", { rel: "icon", href: "/logo.png" }]],
  themeConfig: {
    logo: "/logo.png",
    nav: [
      { text: "Home", link: "https://scrt.network" },
      { text: "Blog", link: "https://blog.scrt.network" },
      { text: "Discord", link: "https://chat.scrt.network" },
      { text: "Forum", link: "https://forum.scrt.network" },
      { text: "Twitter", link: "https://twitter.com/SecretNetwork" },
      { text: "Github", link: "https://github.com/scrtlabs/SecretNetwork" },
      { text: "Telegram", link: "https://t.co/lIiXm3c1hu" },
    ],
    sidebar: [
      {
        title: "Introduction", // required
        path: "/", // optional, link of the title, which should be an absolute path and must exist
        collapsable: true, // optional, defaults to true
        sidebarDepth: 1, // optional, defaults to 1
        children: [
          {
            title: "Overview",
            path: "/overview",
          },
          {
            title: "About the Network",
            path: "/network",
          },
          {
            title: "Protocol",
            path: "/protocol/protocol",
          },
          {
            title: "Network Architecture",
            path: "/protocol/architecture",
          },
          {
            title: "Development Roadmap",
            path: "/protocol/roadmap",
          },
          {
            title: "Using SCRT with Ledger (CLI)",
            path: "/guides/ledger-nano",
          },
        ],
      },
      // {
      //   title: "Ecosystem", // required
      //   path: "/", // optional, link of the title, which should be an absolute path and must exist
      //   collapsable: true, // optional, defaults to true
      //   sidebarDepth: 1, // optional, defaults to 1
      //   children: [
      //     {
      //       title: "Secret Apps",
      //       path: "/ecosystem/apps",
      //     },
      //     {
      //       title: "Community Projects",
      //       path: "/ecosystem/projects",
      //     },
      //   ],
      // },
      {
        title: "Developers", // required
        path: "/dev/developers", // optional, link of the title, which should be an absolute path and must exist
        collapsable: true, // optional, defaults to true
        sidebarDepth: 1, // optional, defaults to 1
        children: [
          {
            title: "Secret Contracts",
            path: "/dev/secret-contracts.md",
          },
          {
            title: "Privacy Model",
            path: "/dev/privacy-model-of-secret-contracts.md",
          },
          {
            title: "Development Guide",
            path: "/dev/developing-secret-contracts.md",
          },
          {
            title: "Quickstart",
            path: "/dev/quickstart.md",
          },
          {
            title: "SecretJS",
            path: "/dev/secret-js",
          },
          {
            title: "Tutorials",
            path: "/dev/tutorials.md",
          },
        ],
      },
      {
        title: "Secret CLI", // required
        path: "/cli/secretcli", // optional, link of the title, which should be an absolute path and must exist
        collapsable: true, // optional, defaults to true
        sidebarDepth: 1, // optional, defaults to 1
        children: [
          {
            title: "Install Secret CLI",
            path: "/cli/install-cli",
          },
          {
            title: "Secret CLI",
            path: "/cli/secretcli",
          },
          {
            title: "Governance",
            path: "/guides/governance",
          },
        ],
      },
      {
        title: "Node Operators", // requireds
        collapsable: true, // optional, defaults to true
        path: "/node-guides/run-full-node-mainnet", // optional, link of the title, which should be an absolute path and must exist
        sidebarDepth: 1, // optional, defaults to 1
        children: [
          {
            title: "Mainnet",
            path: "/node-guides/secret-nodes",
            sidebarDepth: 1,
            children: [
              {
                title: "Hardware Compliance",
                path: "/node-guides/hardware-compliance",
              },
              {
                title: "VPS Compliance",
                path: "/node-guides/vps-compliance",
              },
              {
                title: "Setup SGX",
                path: "/node-guides/setup-sgx",
              },
              {
                title: "Run Full Node",
                path: "/node-guides/run-full-node-mainnet",
              },
              {
                title: "Basic Security",
                path: "/node-guides/basic-security",
              },
              {
                title: "Join as a Validator",
                path: "/node-guides/join-validator-mainnet",
              },
              {
                title: "Sync with State Sync",
                path: "/node-guides/state-sync",
              },
              {
                title: "Migrate a Validator",
                path: "/node-guides/migrate-a-validator",
              },
              {
                title: "Sentry Node Architecture",
                path: "/node-guides/sentry-nodes",
              },
              {
                title: "Node Monitoring",
                path: "/node-guides/node-monitoring",
                sidebarDepth: 1,
                children: [
                  {
                    title: "Manual Installation",
                    path: "/node-guides/monitoring-manual-install",
                  },
                  {
                    title: "Run with Docker",
                    path: "/node-guides/monitoring-docker",
                  },
                ],
              },
              {
                title: "Archive Nodes",
                path: "/node-guides/archive-nodes",
              },
              {
                title: "Prune Everything Nodes",
                path: "/node-guides/prune-everything",
              },
              {
                title: "Active Node Peers",
                //path: '/node-guides/active-node-peers'
              },
              {
                title: "Quick Sync",
                path: "/node-guides/quick-sync",
              },
              {
                title: "Vulcan Network Upgrade (OLD)",
                path: "/upgrade-secret-1-to-secret-2",
              },
            ],
          },
          {
            title: "IBC Relayers", // required
            path: "/relayers/setting-up-hermes", // optional, link of the title, which should be an absolute path and must exist
            collapsable: true, // optional, defaults to true
            sidebarDepth: 1, // optional, defaults to 1
            children: [
              {
                title: "Setting Up Hermes",
                path: "/relayers/setting-up-hermes",
              },
            ],
          },
          {
            title: "Backup", // required
            path: "/", // optional, link of the title, which should be an absolute path and must exist
            collapsable: true, // optional, defaults to true
            sidebarDepth: 1, // optional, defaults to 1
            children: [
              {
                title: "Validator Backup",
                path: "/backup/backup-a-validator",
              },
              {
                title: "Full Node Backup",
                path: "/backup/backup-a-full-node",
              },
              {
                title: "Wallets",
                path: "/backup/wallets",
              },
              {
                title: "Client Transaction Key",
                path: "/backup/client-tx-key",
              },
            ],
          },
          {
            title: "Delegators",
            path: "/node-guides/delegating-mainnet",
          },
          {
            title: "Testnet",
            sidebarDepth: 1,
            collapsable: true, // optional, defaults to trues
            children: [
              {
                title: "Validators (CLI)",
                sidebarDepth: 0,
                path: "/testnet/install_cli",
                children: [
                  {
                    title: "Setup SGX",
                    path: "/testnet/setup-sgx-testnet",
                  },
                  {
                    title: "Verify SGX",
                    path: "/testnet/verify-sgx",
                  },
                  {
                    title: "Run a Full Node",
                    path: "/testnet/run-full-node-testnet",
                  },
                  {
                    title: "Run a Full Node Docker",
                    path: "/testnet/run-full-node-docker",
                  },
                  {
                    title: "Join as a Validator",
                    path: "/testnet/join-validator-testnet",
                  },
                  {
                    title: "Backup a Validator",
                    path: "/testnet/backup-a-testnet-validator",
                  },
                  {
                    title: "Migrate a Validator",
                    path: "/testnet/migrate-a-testnet-validator",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Protocol", // required
        path: "/protocol/intro", // optional, link of the title, which should be an absolute path and must exist
        collapsable: true, // optional, defaults to true
        sidebarDepth: 0, // optional, defaults to 1
        children: [
          "/protocol/components",
          "/protocol/encryption-specs",
          "/protocol/transactions",
          "/protocol/sgx",
        ],
      },
      {
        title: "Post Mortems",
        collapsable: true, // optional, defaults to true
        sidebarDepth: 1, // optional, defaults to 1
        children: [
          {
            title: "Testnet Halt 95",
            path: "/post-mortems/testnet-halt-95",
          },
          {
            title: "September 2021 Earn Contract Exploit",
            path: "/post-mortems/september-2021-exploit",
          },
        ],
      },
      {
        title: "Foundation",
        children: [
          { title: "About", path: "/foundation/foundation" },
          { title: "Committees", path: "/foundation/committees" },
        ],
      },
    ],
  },
};
