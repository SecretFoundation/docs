# Converting from Chainlink VRF to Secret VRF in four steps

{% hint style="info" %}
Got improvements or suggestions on how to convert your ChainlinkVRF contract to SecretVRF ? Please ask in the Secret Network [Telegram](https://t.me/SCRTCommunity) or Discord.
{% endhint %}

Converting from Chainlink VRF to Secret VRF is easier than you expect. Within four easy steps you can free your contract from bloat and use the lightweight and faster Secret VRF solution.&#x20;

We start off with the example code from Chainlink from [here](https://docs.chain.link/vrf/v2/getting-started#how-can-i-use-chainlink-vrf):&#x20;

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {VRFCoordinatorV2Interface} from "@chainlink/contracts@1.0.0/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";
import {VRFConsumerBaseV2} from "@chainlink/contracts@1.0.0/src/v0.8/vrf/VRFConsumerBaseV2.sol";

contract VRFD20 is VRFConsumerBaseV2 {
    uint256 private constant ROLL_IN_PROGRESS = 42;

    VRFCoordinatorV2Interface COORDINATOR;

    // Your subscription ID.
    uint64 s_subscriptionId;

    // Sepolia coordinator. For other networks,
    // see https://docs.chain.link/docs/vrf-contracts/#configurations
    address vrfCoordinator = 0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625;

    // The gas lane to use, which specifies the maximum gas price to bump to.
    // For a list of available gas lanes on each network,
    // see https://docs.chain.link/docs/vrf-contracts/#configurations
    bytes32 s_keyHash =
        0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c;

    // Depends on the number of requested values that you want sent to the
    // fulfillRandomWords() function. Storing each word costs about 20,000 gas,
    // so 40,000 is a safe default for this example contract. Test and adjust
    // this limit based on the network that you select, the size of the request,
    // and the processing of the callback request in the fulfillRandomWords()
    // function.
    uint32 callbackGasLimit = 40000;

    // The default is 3, but you can set this higher.
    uint16 requestConfirmations = 3;

    // For this example, retrieve 1 random value in one request.
    // Cannot exceed VRFCoordinatorV2.MAX_NUM_WORDS.
    uint32 numWords = 1;
    address s_owner;

    // map rollers to requestIds
    mapping(uint256 => address) private s_rollers;
    // map vrf results to rollers
    mapping(address => uint256) private s_results;

    event DiceRolled(uint256 indexed requestId, address indexed roller);
    event DiceLanded(uint256 indexed requestId, uint256 indexed result);

    constructor(uint64 subscriptionId) VRFConsumerBaseV2(vrfCoordinator) {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        s_owner = msg.sender;
        s_subscriptionId = subscriptionId;
    }

    function rollDice(
        address roller
    ) public onlyOwner returns (uint256 requestId) {
        require(s_results[roller] == 0, "Already rolled");
        // Will revert if subscription is not set and funded.
        requestId = COORDINATOR.requestRandomWords(
            s_keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );

        s_rollers[requestId] = roller;
        s_results[roller] = ROLL_IN_PROGRESS;
        emit DiceRolled(requestId, roller);
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        uint256 d20Value = (randomWords[0] % 20) + 1;
        s_results[s_rollers[requestId]] = d20Value;
        emit DiceLanded(requestId, d20Value);
    }

    function house(address player) public view returns (string memory) {
        require(s_results[player] != 0, "Dice not rolled");
        require(s_results[player] != ROLL_IN_PROGRESS, "Roll in progress");
        return getHouseName(s_results[player]);
    }

    function getHouseName(uint256 id) private pure returns (string memory) {
        string[20] memory houseNames = [
            "Targaryen",
            "Lannister",
            "Stark",
            "Tyrell",
            "Baratheon",
            "Martell",
            "Tully",
            "Bolton",
            "Greyjoy",
            "Arryn",
            "Frey",
            "Mormont",
            "Tarley",
            "Dayne",
            "Umber",
            "Valeryon",
            "Manderly",
            "Clegane",
            "Glover",
            "Karstark"
        ];
        return houseNames[id - 1];
    }

    modifier onlyOwner() {
        require(msg.sender == s_owner);
        _;
    }
}
```

## Removing Chainlink bloat

In the first step, we remove the imports and the inheritance of the VRFConsumerBaseV2 and add our SecretVRF interface from this. There is no&#x20;

```solidity
import {VRFCoordinatorV2Interface} from "@chainlink/contracts@1.0.0/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";
import {VRFConsumerBaseV2} from "@chainlink/contracts@1.0.0/src/v0.8/vrf/VRFConsumerBaseV2.sol";

contract VRFD20 is VRFConsumerBaseV2 {
    uint256 private constant ROLL_IN_PROGRESS = 42;

    VRFCoordinatorV2Interface COORDINATOR;

    // Your subscription ID.
    uint64 s_subscriptionId;

    // Sepolia coordinator. For other networks,
    // see https://docs.chain.link/docs/vrf-contracts/#configurations
    address vrfCoordinator = 0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625;

    // The gas lane to use, which specifies the maximum gas price to bump to.
    // For a list of available gas lanes on each network,
    // see https://docs.chain.link/docs/vrf-contracts/#configurations
    bytes32 s_keyHash =
        0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c;
        
    // Depends on the number of requested values that you want sent to the
    // fulfillRandomWords() function. Storing each word costs about 20,000 gas,
    // so 40,000 is a safe default for this example contract. Test and adjust
    // this limit based on the network that you select, the size of the request,
    // and the processing of the callback request in the fulfillRandomWords()
    // function.
    uint32 callbackGasLimit = 40000;
    //...
}
```

to get to this:

```solidity
interface ISecretVRF { 
    function requestRandomness(uint32 _numWords, uint32 _callbackGasLimit) external payable returns (uint256 requestId); 
}
contract VRFD20 {
    uint256 private constant ROLL_IN_PROGRESS = 42;
    //...
    
    // Depends on the number of requested values that you want sent to the
    // fulfillRandomWords() function. Storing each word costs about 20,000 gas,
    // so 40,000 is a safe default for this example contract. Test and adjust
    // this limit based on the network that you select, the size of the request,
    // and the processing of the callback request in the fulfillRandomWords()
    // function.
    uint32 callbackGasLimit = 40000;
    
    // Sepolia Gateway. For other networks,
    // see https://docs.chain.link/docs/vrf-contracts/#configurations
    address public VRFGateway = 0x3879E146140b627a5C858a08e507B171D9E43139;
}

```

Here, the behavior of the `callbackGasLimit` is different than in ChainlinkVRF. The callback Gas limit is simply all of the gas that you need to pay in order to make callback, which includes the verification of the result as well. The callback gas is the amount of gas that you have to pay for the message coming on the way back. We recommend at least using `100_000+` in Callback gas to ensure that enough gas is available. In case you did not pay enough gas, the contract callback execution will fail.&#x20;

## Simplifying the Constructor

Next, we can also simplify the constructor since we do not need to define any extra variables or subscriptionIds. Going from this:&#x20;

```solidity
constructor(uint64 subscriptionId) VRFConsumerBaseV2(vrfCoordinator) {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        s_owner = msg.sender;
        s_subscriptionId = subscriptionId;
}
```

to this

```solidity
constructor()  {
        s_owner = msg.sender;
}
```

## Change request randomness function

Next, we need to slightly adjust the behavior of the function `rollDice(address roller)` function and how it calls the Request Randomness function within Secret VRF. Here, we need to use the Secet VRF gateway and call it directly instead.

{% hint style="info" %}
&#x20;Make sure to now mark this function as `payable`!
{% endhint %}

```solidity
function rollDice(
        address roller
    ) public payable onlyOwner returns (uint256 requestId) {
        require(s_results[roller] == 0, "Already rolled");
        // Will revert if subscription is not set and funded.

        // Get the VRFGateway contract interface 
        ISecretVRF vrfContract = ISecretVRF(VRFGateway);
    
        // Call the VRF contract to request random numbers. 
        // Returns requestId of the VRF request. A  contract can track a VRF call that way.
        uint256 requestId = vrfContract.requestRandomness{value: msg.value}(_numWords, _callbackGasLimit);

        s_rollers[requestId] = roller;
        s_results[roller] = ROLL_IN_PROGRESS;
        emit DiceRolled(requestId, roller);
    }
}
```

Please make sure to actually prepay the right amount of callback gas directly as a value transfer into the contract. The callback gas is the amount of gas that you have to pay for the message coming on the way back. If you do pay less than the amount specified below, your Gateway TX will fail:&#x20;

```solidity
/// @notice Increase the task_id to check for problems 
/// @param _callbackGasLimit the Callback Gas Limit

function estimateRequestPrice(uint32 _callbackGasLimit) private view returns (uint256) {
    uint256 baseFee = _callbackGasLimit*block.basefee;
    return baseFee;
}
```

Since this check is dependent on the current `block.basefee` of the block it is included in, it is recommended that you estimate the gas fee beforehand and add some extra overhead to it. An example of how this can be implemented in your frontend can be found in this [example](https://github.com/SecretSaturn/VRFDemo/blob/6f396e7174fcad297e26455e11b1fa3814ceea16/src/submit.ts#L124) and here:&#x20;

```javascript
//Then calculate how much gas you have to pay for the callback
//Forumla: callbackGasLimit*block.basefee.
//Use an appropriate overhead for the transaction, 1,5x = 3/2 is recommended since gasPrice fluctuates.

const gasFee = await provider.getGasPrice();
const amountOfGas = gasFee.mul(callbackGasLimit).mul(3).div(2);
```

## Add a check for the Secret VRF Gateway

Lastly, we'll add a small check to ensure that we actually got an incoming call from the SecretVRF gateway contract. For this, remove the `internal` and `override` flags on the function and add the require:

```solidity
function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) external {
        require(msg.sender == address(VRFGateway), "only Secret Gateway can fulfill");

        uint256 d20Value = (randomWords[0] % 20) + 1;
        s_results[s_rollers[requestId]] = d20Value;
        emit DiceLanded(requestId, d20Value);
}
```

## Conclusion

That's all that you need to convert your contract from ChainlinkVRF to SecretVRF.

<figure><img src="../../../../.gitbook/assets/image.png" alt=""><figcaption></figcaption></figure>
