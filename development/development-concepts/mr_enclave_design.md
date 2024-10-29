The transition to mr_enclave consists of 3 parts:
	1. The way how the sealed files will be created (which key would be used)
	2. Authorization control, a way for current enclave to verify that the next enclave is eligible for the export.
	3. The export procedure itself, where the current enclave transcodes the sealed files for the next enclave
