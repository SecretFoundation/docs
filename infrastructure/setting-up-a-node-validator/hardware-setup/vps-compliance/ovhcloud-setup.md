# OVHCloud Setup

Websites: [Global](https://www.ovhcloud.com/en/) or [United States](https://us.ovhcloud.com/)

{% hint style="danger" %}
Currently, it is advised to exercise caution when considering OVHCloud servers, as there are concerns regarding the inadequate updating of their mainboards.&#x20;

Please contact the node support in case you got more questions:&#x20;

* You can find help in Telegram [here](https://t.me/SCRTNodeSupport)
* Visit the Secret Network Discord [here](https://discord.com/invite/SJK32GY) and ask in #node-discussion or #node-support for help
{% endhint %}

### Selecting a Server

The following are examples of [Hardware Compliant](../hardware-compliance.md) servers:

* Example in the US: [https://us.ovhcloud.com/bare-metal/infra/infra-2-le/](https://us.ovhcloud.com/bare-metal/infra/infra-2-le/)
* Global example: [https://www.ovhcloud.com/en/bare-metal/rise/rise-3/](https://www.ovhcloud.com/en/bare-metal/rise/rise-3/)

{% hint style="danger" %}
OVHCloud servers can come with either an ASUS or Asrock motherboard. The Asus motherboard does **NOT** support Intel SPS. If you receive the Asus motherboard, you'll need to create a ticket to have the motherboard replaced with the Asrock motherboard: [Asrock E3C246D4U2-2T](https://www.asrockrack.com/general/productdetail.asp?Model=E3C246D4U2-2T#Specifications)
{% endhint %}

### Enabling SGX

1. Navigate to the server's management page
2. Under General Information, ensure SGX is enabled

![Enable SGX](<../../../../../.gitbook/assets/Screen Shot 2022-07-03 at 10.30.42 AM.png>)

3\. Navigate to the IPMI tab. This will be used to disable overclocking and other necessary settings.

![IPMI Console Selection](<../../../../../.gitbook/assets/image (10).png>)

4\. Enable Remote KVM

![](<../../../../../.gitbook/assets/image (7).png>)

5\. Create a DEL hotkey

![DEL hotkey](<../../../../../.gitbook/assets/image (11).png>)

6\. Reset the server, and continue executing the DEL hotkey until you enter the BIOS.

7\. Disable Intel Speedstep Technology

![Intel SpeedStep](<../../../../../.gitbook/assets/image (3).png>)

8\. Under Chipset Configuration:

![BIOS Settings](<../../../../../.gitbook/assets/Screen Shot 2022-07-03 at 7.20.33 PM.png>)

9\. Save and Exit the bios

10\. Reset the server again

11\. Continue from [Setting Up a Node](../../node-setup/)
