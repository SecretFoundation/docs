# Key Types

### Local&#x20;

Local key types are Secret Network keys owned by a secretcli user (i.e controls the private keys). Local accounts are made using the `secretcli keys add <alias>` command.&#x20;

```bash
- name: test
  type: local # This is the 'local' key type
  address: secret1knpfllytv22umrlahglwmhjxkgavccjltxwnca
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"A0QMBqFY4J39i6NrH4qR5uOEnyytpkyeWFg/e0sPd8NJ"}'
  mnemonic: ""
```

### Multi

Multi key types, are Secret Network keys representing multi-signature wallet addresses. They are generated using the `secretcli keys add --multisig=name1,name2,name3[...] --multisig-threshold=K command.`

```bash
- name: test_multisig
  type: multi # This is the 'multi' key type
  address: secret1whdl9yjy8c7p3062xjehf2m69evljp8yfcv9zt
  pubkey: '{"@type":"/cosmos.crypto.multisig.LegacyAminoPubKey","threshold":2,"public_keys":[{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"AiXwUPtwTJqxKZq/BjKi+7EFhqR2Aj9QT94lFzb5Ednp"},{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"A7QMHOt+yLGddDxey51QLofwsTJWfqyzYmNOB9L1Oz1S"},{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"A0QMBqFY4J39i6NrH4qR5uOEnyytpkyeWFg/e0sPd8NJ"}]}'
  mnemonic: ""
```

### Offline&#x20;

Offline key types are Secret Network keys that are imported into a secretcli users keyring, but NOT owned by the user. They are generated using the `secretcli keys add <alias> --pubkey=<public_`_`address_`_`key>` command.&#x20;

```bash
- name: testpubkey
  type: offline # This is the 'offline' key type
  address: secret1kx668pa7py992x5m54zju9mn7ynruqtgp8lgge
  pubkey: '{\"@type\":\"/cosmos.crypto.secp256k1.PubKey\",\"key\":\"A2Wb8D5w+LKPNQ7z1VhiD5Q+8SnIFMMKjDyQXBhnlZwo\"}'
  mnemonic: ""
```

