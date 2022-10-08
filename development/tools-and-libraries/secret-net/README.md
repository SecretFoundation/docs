# Secret.NET 
**Secret.NET** (full port of the secret.js Client) is a .NET SDK for writing applications that interact with the Secret Network blockchain.

* Written in C# / .NET 6 including MAUI Support.
* Can be used in MAUI Apps on Android, iOS, Windows and Mac.
* Provides simple abstractions over core data structures.
* Supports every possible message and transaction type.
* Exposes every possible query type.
* Handles input/output encryption/decryption for Secret Contracts.
* The SDK has a wallet built in and does not currently require / support external wallets.
* Custom APIs / clients for specific smart contracts can be easily created (see packages for tokens / SNIP20 or NFT / SNIP721).

![](../../../.gitbook/assets/SecretNET.png)

You can find the full version of the docs at [https://github.com/0xxCodemonkey/SecretNET/](https://github.com/0xxCodemonkey/SecretNET/)

## Install / Add Secret.NET to a project
The following packages are available via NuGet:
- **SecretNET**
- **SecretNET.Token** (Token client providing all methods of SNIP-20 reference implementation.)
- **SecretNET.NFT** (NFT client providing all methods of SNIP-721 / 722 reference implementation.)

And can be easily installed
``` nuget.exe ``` -CLI:
``` bash 
nuget install SecretNET
nuget install SecretNET.Token
nuget install SecretNET.NFT
```
[NuGet-Paket-Manager-Console](https://docs.microsoft.com/de-de/nuget/consume-packages/install-use-packages-powershell):
```  bash
Install-Package SecretNET
Install-Package SecretNET.Token
Install-Package SecretNET.NFT
```

## What is .NET MAUI?

**.NET Multi-platform App UI (.NET MAUI)** is a cross-platform framework for creating native mobile and desktop apps with C# and XAML.

Using .NET MAUI, you can develop apps that can run on Android, iOS, macOS, and Windows from a single shared code-base.

.NET MAUI is open-source and is the evolution of Xamarin.Forms, extended from mobile to desktop scenarios, with UI controls rebuilt from the ground up for performance and extensibility. Using .NET MAUI, you can create multi-platform apps using a single project, but you can add platform-specific source code and resources if necessary. One of the key aims of .NET MAUI is to enable you to implement as much of your app logic and UI layout as possible in a single code-base.

## Who .NET MAUI is for

.NET MAUI is for developers who want to:
- Write cross-platform apps in XAML and C#, from a single shared code-base in Visual Studio.
- Share UI layout and design across platforms.
- Share code, tests, and business logic across platforms.

## More informations about .NET MAUI: 
- [What is .NET MAUI?](https://learn.microsoft.com/en-us/dotnet/maui/what-is-maui)
- [Learn how to use .NET MAUI to build apps that run on mobile devices and on the desktop using C# and Visual Studio.](https://learn.microsoft.com/en-us/training/paths/build-apps-with-dotnet-maui/)
- [Resources to Get Started with .NET MAUI](https://devblogs.microsoft.com/dotnet/learn-dotnet-maui/)
