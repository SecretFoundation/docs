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
            path: "/ledger-nano-s",
          },
        ],
      },
      {
        title: "Node Operators", // requireds
        collapsable: true, // optional, defaults to true
        sidebarDepth: 1, // optional, defaults to 1
        children: [
          {
            title: "Secret Light Client",
            path: "/validators-and-full-nodes/secretcli",
            sidebarDepth: 1,
          },
          {
            title: "SecretNodes",
            path: "/validators-and-full-nodes/secret-nodes",
            sidebarDepth: 1,
            children: [
              {
                title: "Setup SGX",
                path: "/validators-and-full-nodes/setup-sgx",
              },
              {
                title: "Run a Full Node",
                path: "/validators-and-full-nodes/run-full-node-mainnet",
              },
              {
                title: "Join as a Validator",
                path: "/validators-and-full-nodes/join-validator-mainnet",
              },
              {
                title: "Backup a Validator",
                path: "/validators-and-full-nodes/backup-a-validator",
              },
              {
                title: "Migrate a Validator",
                path: "/validators-and-full-nodes/migrate-a-validator",
              },
              {
                title: "Sentry Nodes",
                path: "/validators-and-full-nodes/sentry-nodes",
              },
              {
                title: "Active Node Peers",
                //path: '/validators-and-full-nodes/active-node-peers'
              },
              {
                title: "Vulcan Network Upgrade",
                path: "/upgrade-secret-1-to-secret-2",
              },
            ],
          },
          {
            title: "Delegators",
            path: "/validators-and-full-nodes/delegating-mainnet",
          },
        ],
      },
    ],
  },
};
