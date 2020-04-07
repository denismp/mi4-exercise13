const ethers = require('ethers');

// The Contract interface
let abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "fact",
				"type": "string"
			}
		],
		"name": "addFact",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getCount",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getFact",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];

// The bytecode from Solidity, compiling the above source
let bytecode = "0x608060405234801561001057600080fd5b5033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506103cc806100616000396000f300608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680637d5966121461005c578063a87d942c146100c5578063e63b372d146100f0575b600080fd5b34801561006857600080fd5b506100c3600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050610196565b005b3480156100d157600080fd5b506100da610234565b6040518082815260200191505060405180910390f35b3480156100fc57600080fd5b5061011b60048036038101908080359060200190929190505050610240565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561015b578082015181840152602081019050610140565b50505050905090810190601f1680156101885780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156101f257600080fd5b600081908060018154018082558091505090600182039060005260206000200160009091929091909150908051906020019061022f9291906102fb565b505050565b60008080549050905090565b606060008281548110151561025157fe5b906000526020600020018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156102ef5780601f106102c4576101008083540402835291602001916102ef565b820191906000526020600020905b8154815290600101906020018083116102d257829003601f168201915b50505050509050919050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061033c57805160ff191683800117855561036a565b8280016001018555821561036a579182015b8281111561036957825182559160200191906001019061034e565b5b509050610377919061037b565b5090565b61039d91905b80821115610399576000816000905550600101610381565b5090565b905600a165627a7a72305820ca3152c975377090636943a316ea2da7d7336e0d8cdbd3c81b79a1ad1028d3640029"

// Connect to the network
let provider = ethers.getDefaultProvider('ropsten');

// Load the wallet to deploy the contract with
let privateKey = '0x0123456789012345678901234567890123456789012345678901234567890123';
let wallet = new ethers.Wallet(privateKey, provider);

// Deployment is asynchronous, so we use an async IIFE
(async function () {

    // Create an instance of a Contract Factory
    let factory = new ethers.ContractFactory(abi, bytecode, wallet);

    // Notice we pass in "Hello World" as the parameter to the constructor
    //let contract = await factory.deploy("Hello World");
    let contract = await factory.deploy();

    // The address the Contract WILL have once mined
    // See: https://ropsten.etherscan.io/address/0x2bd9aaa2953f988153c8629926d22a6a5f69b14e
    console.log(contract.address);
    // "0x2bD9aAa2953F988153c8629926D22A6a5F69b14E"

    // The transaction that was sent to the network to deploy the Contract
    // See: https://ropsten.etherscan.io/tx/0x159b76843662a15bd67e482dcfbee55e8e44efad26c5a614245e12a00d4b1a51
    console.log(contract.deployTransaction.hash);
    // "0x159b76843662a15bd67e482dcfbee55e8e44efad26c5a614245e12a00d4b1a51"

    // The contract is NOT deployed yet; we must wait until it is mined
    await contract.deployed();

    // Done! The contract is deployed.

    let fact = 'The Time 03/Jan/2009 Chancellor on brink of second bailout for banks.';
    addFact(privateKey, abi, contract.address, fact);
})();

async function addFact(privateKey,abi,contractAddress,fact) {
    let wallet = new ethers.Wallet(privateKey,provider);
    let contract = new ethers.Contract(contractAddress,abi,wallet);

    const tx = await contract.add(fact);
    await tx.wait();
    return tx;
}
