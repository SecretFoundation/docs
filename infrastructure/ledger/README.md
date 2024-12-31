# 🔐 Use Ledger hardware wallet

This guide is for Ledger Nano S, S+, and X.

### Introduction

A Ledger device is a hardware wallet that is considered one of the most secure ways to store your digital assets. A Ledger device uses an offline, or "cold storage," method of generating private keys, making it a preferred method for many crypto users. This guide will help you to connect your Ledger device to the Secret Network's CLI and GUI wallets. The wallets enable you to send and receive SCRT as well as stake/delegate SCRT with the Ledger device.

### Prerequisites

**1.** This guide assumes you have a **verified, genuine** Ledger Nano S,S+ or X device.

**2.** If you don't, or you using your Ledger device for the first time, you should check Ledger's [Getting Started](https://support.ledger.com/hc/en-us/articles/4404389503889-Getting-started-with-Ledger-Live?docs=true) guide.

**3.** We also advise you to check your Ledger device's genuineness and upgrade your firmware to the newest one available.

**4.** Have a machine with [Ledger Live](https://www.ledger.com/ledger-live) installed.

**5.** Have the latest version of our latest binaries installed in case you use Secret CLI. You can get it [here](https://github.com/scrtlabs/SecretNetwork/releases/latest).

### Install Cosmos (or Secret) Ledger App

**1.** Open Ledger Live.

![Ledger Live](https://raw.githubusercontent.com/SecretSaturn/docs/Old\_main\_backup/docs/guides/LedgerLiveScreen.png)

**2.** Now go to Manager and search "Cosmos" or "secret":
> Note : The Secret ledger app may not always be available in search. Try turning on "Experimental". Otherwise using the "Cosmos" app is considered stable.

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

## Ping.pub GUI wallet

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

### Support

For support please contact the Secret Support [here](https://linktr.ee/SCRTSupport).
