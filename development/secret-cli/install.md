# Install

To install the _secretcli_ [download the latest version here. ](https://github.com/scrtlabs/SecretNetwork/releases)Download the appropriate version of the _secretcli_ based on the operating system you are using:

* secretcli-Linux
* secretcli-macOS
* secretcli-MacOS-arm64&#x20;
* secretcli-Windows&#x20;

### Linux

After downloading secretcli-Linux you will need to navigate to the folder you have download it to make secretcli-Linux an executable program using a graphical user interface (GUI) or the command-line.

**Note:** Installing secretcli-Linux will ONLY give you access to the 'secretcli' commands. For 'secretcli' and 'secretd' commands install one of the .deb packages.&#x20;

#### GUI

Right click on the secretcli-Linux file and select 'Properties', then select 'Permissions', and then check the 'Allow executing the file as program' box beside the 'Execute' column.&#x20;

![Make secretcli-Linux executable.](../../.gitbook/assets/secretcliguiinstall.png)

#### Command-line

To make secretcli-Linux executable using the command-line navigate to where the file is located and use the following command:

```
chmod +x secretcli-Linux
```

#### Next Steps

You can now use the secretcli by using the following command inside of the folder it is located in with:&#x20;

```
./secretcli-Linux
```

You will see some outputs related to available commands, flags, and usage.&#x20;

It is recommended to rename seretcli-Linux to 'secretcli', and move the executable file into the correct location so it is automatically executable by typing 'secretcli' anywhere within the command-line.&#x20;

To achieve this use the following commands in the directory containing secretcli-Linux:&#x20;

```
sudo mv secretcli-Linux /usr/local/bin/secretcli
```

### Mac

### Windows
