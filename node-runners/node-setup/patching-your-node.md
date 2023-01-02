# Patching your Node

Nodes on Secret Network are required to be fully patched, and compliant with network requirements. While this requirement makes running a node and maintaining it harder, it is a necessary tradeoff that needs to be done if the network is to remain open and permissionless.

Part of the registration process on the network will validate the patch level of your platform (Motherboard + CPU). This requires your to have the necessary updates that mitigate known vulnerabilities that might lead to compromise of data protected by SGX.&#x20;

Let's start with the different components that need to be updated -

* Processor microcode (ucode) - Microcode is a type of low-level computer programming that is used to control the operations of a microprocessor. It is typically stored in the microprocessor itself or in a read-only memory (ROM) chip that is connected to the microprocessor. Microcode is used to define the basic set of instructions that a microprocessor can execute, as well as the operations that it can perform on data. It is usually written in a specialized microcode programming language, and it forms the lowest level of a computer's instruction set architecture.&#x20;
* SGX Platform Software (PSW) - This software package provides a set of tools and libraries to make use of the Intel SGX instruction set

### Updating The PSW

The PSW packages can be updated using your standard operating system install methods. For example, in Linux do this:

```bash
PSW_PACKAGES='libsgx-enclave-common libsgx-aesm-launch-plugin libsgx-aesm-quote-ex-plugin libsgx-urts sgx-aesm-service libsgx-uae-service autoconf libtool make gcc'
# Add Intels's SGX PPA
echo "deb [arch=amd64] https://download.01.org/intel-sgx/sgx_repo/ubuntu $DISTRO main" |
   sudo tee /etc/apt/sources.list.d/intel-sgx.list
wget -qO - https://download.01.org/intel-sgx/sgx_repo/ubuntu/intel-sgx-deb.key |
   sudo apt-key add -
sudo apt update

sudo apt install -y $PSW_PACKAGES
```

### Updating the Microcode

#### Get your microcode file name

While there are a few ways to update the processor microcode, it is important to note that for SGX, the updated microcode must be loaded through the BIOS. That means that upgrading the microcode using early load or late load (installing through the operating system) will not affect the SGX patch level of the platform.

To find out whether the microcode needs to be updated and find the latest version, we must first get the _family_, _model_, and _stepping_ of our processor.&#x20;

To find the stepping, model, and family of your processor, you can use the `lscpu` command. This command displays detailed information about the CPU architecture.

1. Open a terminal window on your system and type the following command:

```
lscpu
```

2\. The output of this command will include the stepping, model, and family of your processor, as well as other information about the CPU architecture.

Here is an example of the output you might see:

```less
Copy codeArchitecture:          x86_64
CPU op-mode(s):        32-bit, 64-bit
Byte Order:            Little Endian
CPU(s):                4
On-line CPU(s) list:   0-3
Thread(s) per core:    1
Core(s) per socket:    4
Socket(s):             1
NUMA node(s):          1
Vendor ID:             GenuineIntel
CPU family:            6
Model:                 85
Model name:            Intel(R) Core(TM) i7-8550U CPU @ 1.80GHz
Stepping:              3
```

In this example, the family, model and stepping of the processor are 6, 85, and 3, respectively.

Next, we take these values and translate them to hex and structure them as follows: \<family>-\<model>-\<stepping>. In this example we get: `06-55-03`. This is our **microcode file name** for our processor.&#x20;

{% hint style="info" %}
**Pro Tip:** These numbers also allow us to get our CPUID, in the following order:&#x20;

`|model 1st digit|family|model 2nd digit|stepping|`. For example, 06-9e-0d -> 906ED
{% endhint %}

#### Find the correct microcode version for your processor

After we have our microcode file name, we use it to find the latest version of our microcode, which is available here: [https://github.com/intel/Intel-Linux-Processor-Microcode-Data-Files/blob/main/releasenote.md](https://github.com/intel/Intel-Linux-Processor-Microcode-Data-Files/blob/main/releasenote.md). Continuing the previous example, the latest version of microcode for `06-55-03` is `0x0100015e`

#### Check your installed microcode version

Now that we know what our microcode should be, we can compare it to our current microcode. Get your current version with:

&#x20;`cat /proc/cpuinfo | grep microcode` or `dmesg | grep microcode`

{% hint style="info" %}
**Note -** On Azure machines will always return 0xFFFFFFFF as their microcode version regardless of the actual patch level
{% endhint %}

#### Get a BIOS that contains the updated Microcode

If your version does not match the latest one, you will need to update your BIOS. To do that, contact your motherboard vendor, or your cloud service provider and download or request the BIOS version that contains the latest microcode for your CPU. &#x20;

