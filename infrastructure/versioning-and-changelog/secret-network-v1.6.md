# Secret Network v1.6

The Secret Network v1.6 update did not introduce any breaking changes for developers. General performance improvements were introduced and described below;

* Changed internal WASM engine to Wasm3 from Wasmi. Contract performance increased greatly.
* Reduced gas costs:
  * Default instruction cost 1 -> 2
  * Div instruction cost 16 -> 2
  * Mul instruction cost 4 -> 2
  * Mem instruction cost 2 -> 2
  * Contract Entry cost 100,000 -> 20,000
  * Read from storage base cost 1,000 -> 10
  * Write to storage base cost 2,000 -> 20
* SecretJS 1.5 has been released, and uses GRPC-Gateway endpoints. Check it out [here](https://www.npmjs.com/package/secretjs).

For more details on this upgrade, check the [official release](https://github.com/scrtlabs/SecretNetwork/releases/tag/v1.6.0).

