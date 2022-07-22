# Init

## What Is The Init? What Goes Inside?

The Init function is the function that will run once (and only once) immediately upon initializing your smart contract after uploading it to the network. It is meant to set up the smart contract with all vital code that must be run first before any users have the ability to run a handle. For those familiar with a solidity constructor on Ethereum, the Init serves the exact same purpose.

If you have any vital info to save to the state such as Config parameters or an admin/operator address to name a few options, those should probably be specified here. In addition, if your contract requires entropy for randomization or needs to register to receive a SNIP-20 token for payment, those operations should also be performed here, as other handles will rely on that data to be already initialized.



##
