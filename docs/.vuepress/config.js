module.exports = {
  title: "Secret Network",
  description: "Privacy is a Public Good",
  head: [["link", { rel: "icon", href: "/logo.png" }]],
  themeConfig: {
    logo: "/logo.png",
    nav: [
      { text: "Home", link: "https://scrt.network" },
      { text: "Blog", link: "https://blog.scrt.network" },
      { text: "Chat", link: "https://chat.scrt.network" },
      { text: "Forum", link: "https://forum.scrt.network" },
      { text: "Twitter", link: "https://twitter.com/SecretNetwork" },
      { text: "Github", link: "https://github.com/enigmampc/SecretNetwork" },
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
      {
        title: "Secret CLI", // required
        path: "/", // optional, link of the title, which should be an absolute path and must exist
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
        ],
      },
      {
        title: "Node Operators", // requireds
        collapsable: true, // optional, defaults to true
        sidebarDepth: 1, // optional, defaults to 1
        children: [
          {
            title: "SecretNodes",
            path: "/node-guides/secret-nodes",
            sidebarDepth: 1,
            children: [
              {
                title: "Hardware Compliance",
                path: "/node-guides/hardware-compliance",
              },
              {
                title: "VPS Compliance",
                //path: '/node-guides/vps-compliance'
              },
              {
                title: "Setup SGX",
                path: "/node-guides/setup-sgx",
              },
              {
                title: "Run a Full Node",
                path: "/node-guides/run-full-node-mainnet",
              },
              {
                title: "Join as a Validator",
                path: "/node-guides/join-validator-mainnet",
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
                title: "Archive Nodes",
                path: "/node-guides/archive-nodes",
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
        ],
      },
    ],
  },
};
