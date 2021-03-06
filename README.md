# mi4-exercise13
Playing with Smart Contracts using Ethers.js

Exercises: Playing with Smart Contracts using Ethers.js
In this exercise, we will use the ethers.js library to interact with a smart contract deployed on the Ethereum Ropsten Testnet. We will first compile a contract, deploy it and finally invoke some of the contract’s functions once it’s deployed.
1.	Compiling a Smart Contract
The Smart Contract object is a meta-class, so many of its functions are not defined until it is instantiated with an Application Binary Interface (ABI) which is usually generated by a compiler, such as the Solidity Compiler. Therefore, we will use the solc-js library – JavaScript bindings for the Solidity Compiler.
To start, create a new project directory in an appropriate place; open a terminal session and initialize a package.json file inside the project directory:
npm init -y
After that, install solc-js:
npm install ––save solc
Because we will be reading a smart contract from a file, we will need a file-system library:
npm install ––save fs-extra
Last but not least, we need to install ethers.js:
npm install ––save ethers

After we have installed our dependencies, create a JavaScript file called ethers-workflow.js and require them:
 
Provider links to a running node in order to connect to the Ethereum blockchain for issuing queries and sending state changing transactions. It is simply a connection to the network. For the purposes of this exercise, we will use Ropsten as our provider. 
Now, we will create a simple smart contract called ArrayOfFacts.sol which will store an array of strings called facts in the blockchain. Only the owner of the contract can add facts but anyone should be able to get a count of how many facts there are and retrieve a specific fact by index.

 
Now that we have written the smart contract, we will create a function in ethers-workflow.js which reads a file and returns its content:
 
Let’s now create a function to compile the smart contract: we will create a function called compileContract which takes two parameters: the file name and the contract name. It will return an output of the compiled contract:
 
Upon compilation of the contract, the output will appear as below: 




Let’s save a reference to the ABI for later use:
 
2.	Deploy a Smart Contract
Now that we have compiled our ArrayOfFacts.sol smart contract, it is time to deploy it on the Ropsten Testnet. For the example of the exercise, we will take one private key from MetaMask and use it to sign the deployment transaction.
 
If you do not have ETHt, use the MetaMask faucet: https://faucet.metamask.io/ 
 
 
Export the private key:
 
Create a constant to reference the private key copied from Metamask somewhere in ethers-workflow.js (don’t forget to prefix 0x onto your private key!)
 
Then create a deployContract function, which takes a Private Key, contract filename and the contract’s name as parameters.
To deploy a contract to the Ethereum Network, we must have its bytecode and its Application Binary Interface (ABI), both of which are usually generated by the Solidity Compiler during compilation. Then, we will use the Contract.getDeployTransaction (bytecode, interface …) method, which generates the transaction needed to deploy the contract specified by the bytecode and interface. Any additional configuration details of the transaction can be passed in as the last parameter as an object (for example: gas limit, gas price, etc.). 
Then, using the wallet object, we will send the transaction and receive the transaction through a callback:
 
 
As we can see, in this format, we receive hash of the transaction, the sender, the data, but on which address is the contract deployed? Therefore, we will use an ethers utility function which will give us the address of a deployed contract given a specific transaction. Let’s modify the deployContract method.
 
 
In addition, you can wait for the transaction to be mined with Provider.waitForTransaction (txHash), which returns an object storing the contract’s address. Keep in mind you will have to wait a few seconds until the transaction is mined.
 
Save a reference to our contract address in ethers-workflow.js:
 
Now if we go to Ropsten Etherscan and paste the address of the contract, we should see an overview of our contract:
 
3.	Playing with the Smart Contract
Now that our smart contract is deployed, we will write to it using ethers to add facts. In order to do this, we will use ethers.Contract (addressOrName, abi, providerOrSigner) method which connects to the contract address defined in the ABI. The method also takes a providerOrSigner which may be any instance of a Wallet, Provider or Custom Signer. For the purposes of this exercise, we will use a Wallet instance.
Create a method called addFact, which takes an contract address, an ABI of the contract, a private key for the wallet and a fact. The method will return a callback of the created transaction.


 
 
In Ropsten Etherscan:
 
What will happen if someone, different from contract owner, tries to add a fact to the contract?
 
Now, let’s create a method, which calls the contract’s function getFact(uint256 index). Keep in mind that when you want to GET something from a contract, you do not need a wallet! Therefore, we will just use the provider:
 
 
Last but not least, let’s create a function to call the count() method of the contract, which returns the count of the facts in the contract:
 
 
What to Submit?
Create a zip file (e.g. username-playing-smart-contracts-ethers-js.zip) holding the ethers-workflow.js file with the methods, a snapshot of the Ropsten Etherscan contract address and its transactions.
Submit your zip file as homework at the course Website.

NOTES:
The document for this exercise is out-of-date.  Refer to the ethers-workflow.js file for the solution.


