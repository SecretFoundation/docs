# Trusted Execution Environments  (TEE) —  Intel SGX

Secret Network uses Intel's Software Guard Extensions (SGX) implementation of TEE technology. TEE refers to a secure area of a processor where data is inaccessible to any other component in the system. A TEE acts as a blackbox for computation, input and output can be known, but the state inside the TEE is never revealed.&#x20;

Intel’s Software Guard Extensions (SGX) is a set of security-related instructions built into certain Intel CPUs enabling TEEs. By using SGX chips, the chip owners, system operators, and observers have strong cryptographic guarantees that no party can view what's happening inside of the Secret memory space.&#x20;

This part of the documentation will discuss all aspects of TEE technology and the way that Secret Network implements it for a secure private computation environment.

#### Overview

* Why SGX and security of SGX-SPS CPUs
* Trusted & untrusted core
* Remote attestation
* Sealing



