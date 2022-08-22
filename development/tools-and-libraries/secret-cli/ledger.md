# Ledger Secret

## Using SCRT with Ledger

This guide is for Ledger Nano S, S+, and X.

### Introduction

A Ledger device is a hardware wallet that is considered one of the most secure ways to store your digital assets. A Ledger device uses an offline, or "cold storage," method of generating private keys, making it a preferred method for many crypto users. This guide will help you to connect your Ledger device to the Secret Network's CLI and GUI wallets. The wallets enable you to send and receive SCRT as well as stake/delegate SCRT with the Ledger device.

### Prerequisites

**1.** This guide assumes you have a **verified, genuine** Ledger Nano S,S+ or X device.

**2.** If you don't, or you using your Ledger device for the first time, you should check Ledger's [Getting Started](https://support.ledger.com/hc/en-us/articles/4404389503889-Getting-started-with-Ledger-Live?docs=true) guide.

**3.** We also advise you to check your Ledger device's genuineness and upgrade your firmware to the newest one available.

**4.** Have a machine with [Ledger Live](https://www.ledger.com/ledger-live) installed.

**5.** Have the latest version of our latest binaries installed in case you use Secret CLI. You can get it [here](https://github.com/scrtlabs/SecretNetwork/releases/latest).

### Install Secret Ledger App

**1.** Open Ledger Live.

![Ledger Live](https://raw.githubusercontent.com/SecretSaturn/docs/Old\_main\_backup/docs/guides/LedgerLiveScreen.png)

**2.** Now go to Manager and search "secret":&#x20;

![Secret Ledger App](https://raw.githubusercontent.com/SecretSaturn/docs/Old\_main\_backup/docs/guides/InstallSecret.png)

**3.** Hit "Install" and wait for the process to complete.

{% hint style="info" %}
Note: **To run the commands in Secret CLI or the GUI wallets below, or any command that requires signing with your Ledger device, you need your Ledger device to be opened on the Secret App:**\
![](https://raw.githubusercontent.com/SecretSaturn/docs/Old\_main\_backup/docs/guides/SecretReady.png)
{% endhint %}

#### Fixing Connection Issues

* Prepare your Linux host to work with Ledger

Some users may not have their Ledger device recognized by their Linux host. To fix this issue implement the fix for connection issues on Linux from the [Ledger support page](https://support.ledger.com/hc/en-us/articles/115005165269-Connection-issues-with-Windows-or-Linux)

```bash
wget -q -O - https://raw.githubusercontent.com/LedgerHQ/udev-rules/master/add_udev_rules.sh | sudo bash
```

* MacOS

You will need at least MacOS 10.14 Mojave, which introduced the Security feature of allowing Full Disk Access, which Ledger Live needs in order to enable the `--ledger` flag in `secretcli`. Refer to the MacOS section in the [Ledger support page](https://support.ledger.com/hc/en-us/articles/115005165269-Connection-issues-with-Windows-or-Linux).


### SecretNodes GUI Wallet

The SecretNodes GUI Wallet provides basic capabilities for Secret such as staking and transferring SCRT tokens. Visit the SecretNodes GUI Wallet site for Secret [here](secretnodes.com). You do not need to import an account for the usage. 


#### Display your account / Receive SCRT

**1.** To display your account, first head to the SSCRT page [here](https://secretnodes.com/secret/accounts/secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek) and press "Send"

![SecretNodes Address Screen](https://raw.githubusercontent.com/SecretSaturn/docs/Old\_main\_backup/docs/guides/SecretNodesAddress.png)

**2.** Next, select "Manual Ledger" as the Wallet Type

![Select Wallet Type](https://raw.githubusercontent.com/SecretSaturn/docs/Old\_main\_backup/docs/guides/SecretNodesWalletType.png)

**3.** Then select "Secret" as the Wallet App

![Select Wallet App](https://raw.githubusercontent.com/SecretSaturn/docs/Old\_main\_backup/docs/guides/SecretNodesWalletApp.png)

**4.** Now you can see your "Account balance" on the top left of the window.

![Account prompt](https://raw.githubusercontent.com/SecretSaturn/docs/Old\_main\_backup/docs/guides/SecretNodesReceiveAccount.png)

Lastly, copy the displayed account address ("From Address") in the SecretNodes wallet to receive SCRT. 

#### Send SCRT

Head to the display your account again.

![Send SCRT](https://raw.githubusercontent.com/SecretSaturn/docs/Old\_main\_backup/docs/guides/SecretNodesSendSCRT.png)

From there, insert the Account you want to send the funds to ("To address") and the amount you want to send ("Amount to Send").

Hit "Send" to send the transaction to the Ledger device. On your Ledger device, verify the transaction details on the device display, before confirming and signing it.


### Ping.pub GUI wallet

The ping.pub GUI wallet provides basic capabilities for Secret such as creating an account, staking and transferring SCRT tokens. Visit the ping.pub site for Secret [here](https://ping.pub/secret).

#### Import an account

**1.** Open the tab in the right top corner and click "Import Address."

![Ping.pub home screen](https://raw.githubusercontent.com/SecretSaturn/docs/Old\_main\_backup/docs/guides/PingPubWalletImport.png)

**2.** Then, select "Ledger via WebUSB" and confirm with "Next".

![Import Address](https://raw.githubusercontent.com/SecretSaturn/docs/Old\_main\_backup/docs/guides/PingPubWalletImport2.png)

**3.** Pick a name for your wallet and continue with "Next".

![Account Coordination](https://raw.githubusercontent.com/SecretSaturn/docs/Old\_main\_backup/docs/guides/PingPubWalletImport3.png)

**4.** Lastly, check the displayed address in Ping.pub against the one displayed on your Ledger device, before confirming it on your Ledger device. Only then confirm with "Save" on the website.

![Save Account](https://raw.githubusercontent.com/SecretSaturn/docs/Old\_main\_backup/docs/guides/PingPubWalletImport4.png)

#### Display your account

**1.** To display your account, head to the drop down menu in the top right corner and select "Accounts."

![Ping.pub home screen](https://raw.githubusercontent.com/SecretSaturn/docs/Old\_main\_backup/docs/guides/PingPubAccountsDropDown.png)

**2.** You can see all of your registered accounts in Ping.pub.

![Accounts Section](https://raw.githubusercontent.com/SecretSaturn/docs/Old\_main\_backup/docs/guides/PingPubAccounts.png)

**3.** To see your account balance and transactions in detail, click on the account to show the details.

![Wallet Address](https://raw.githubusercontent.com/SecretSaturn/docs/Old\_main\_backup/docs/guides/PingPubAccountDetail.png)

Copy the displayed account address in the Ping.pub wallet to receive SCRT. Please make sure that you verified your receiving address on the Ledger device to prevent loss of funds.

#### Send SCRT

To send SCRT, display your account balance. By selecting "Transfer", a window will appear in which you can input the destination address/Recipient and the amount you want to send.

![Transfer Tokens](https://raw.githubusercontent.com/SecretSaturn/docs/Old\_main\_backup/docs/guides/PingPubWalletTransfer.png)

Lastly, hit "Send" to send the transaction to the Ledger device. On your Ledger device, verify the transaction details on the device display, before confirming and signing it.

### SecretCLI

For a more advanced user, it is possible to interface with the CLI utility, SecretCLI with a Ledger device. You can get it [here](https://github.com/scrtlabs/SecretNetwork/releases/latest). These are some basic examples of commands you can use with your Ledger device. You may notice that most commands stay the same, you just need to add the `--ledger` flag.

#### Import an account

> Note: You can use any number you'd like for your account number. Be sure to remember the number you used, so you can recover if needed. The default for the account number is 0.

```bash
secretcli keys add <account name> --ledger --account <account number> 
```

#### Display your account address

```bash
secretcli keys show -a <account name>
```

#### Add an account to `secretcli` that already exists on your Ledger device

_You'll use this when you, say, using a different machine._

```bash
secretcli keys add <account name> --ledger --account <account number on your Ledger device> --recover 
```

{% hint style="danger" %}
**Warning: if you run the above command without the `--ledger` flag, the CLI will prompt you to enter your BIP39 mnemonic, which is your Ledger device recovery phrase. YOU DO NOT WANT TO DO THIS. This will essentially save your private key locally, which defeats the purpose of using a Ledger device.**
{% endhint %}

_The commands below assume that you run them on the same machine where you have a Secret Network node running. If you wish to connect to a remote Secret Network node while you interact with your Ledger device locally, the following command will use SCRT Lab's public node:_

```bash
secretd config node https://lcd-secret.scrtlabs.com:443/rpc
```

#### Send tokens

```bash
secretcli tx send <account name or address> <to_address> <amount> --ledger 
```

#### Delegate SCRT to a validator

```bash
secretcli tx staking delegate <validator address> <amount to bond> --from <account key> --ledger
```

#### Collect rewards and commission

```bash
secretcli tx distribution withdraw-rewards --from <account name> --commission --ledger
```

#### Vote on proposals

```bash
secretcli tx gov vote <proposal-id> <vote> --from <account name> --ledger
```

#### Deposit snip-20 token

```bash
secretcli tx snip20 deposit <contract address or label> --amount <amount> --from <account name> --ledger
```

#### Transfer snip-20 token

```bash
secretcli tx snip20 transfer <contract address or label> <to_address> <amount> --from <account name> --ledger
```

### Support

For support please contact the Secret Support [here](https://linktr.ee/SCRTSupport).
