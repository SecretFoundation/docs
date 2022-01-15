# Installing the CLI & Creating a new address

## Download the appropriate version

* Linux AMD64
```
https://github.com/scrtlabs/SecretNetwork/releases/download/v1.0.3/secretcli-linux-amd64
```

* Linux ARM64
```
https://github.com/scrtlabs/SecretNetwork/releases/download/v1.0.3/secretcli-linux-arm64
```

* MacOS
```
https://github.com/scrtlabs/SecretNetwork/releases/download/v1.0.3/secretcli-darwin-10.6-amd64
```

* Windows
```
https://github.com/scrtlabs/SecretNetwork/releases/download/v1.0.3/secretcli-windows-4.0-amd64.exe
```

## Setup the executable

Rename the file to `secretcli`.

Linux and MacOS users:
```
chmod +x ./secretcli
```


## Create a new address

```
./secretcli keys add <name>
```

See more details on how to use the CLI [here](https://github.com/scrtlabs/SecretNetwork/blob/master/docs/node-guides/secretcli.md)