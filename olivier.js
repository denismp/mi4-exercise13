const ethers = require('ethers');
const solc = require('solc');
const PROVIDER = ethers.getDefaultProvider('ropsten');
const fs = require('fs-extra');

const PRIVATE_KEY = '<YOUR PROVATE KEY>';
let ABI, CONTRACT_ADDRESS;

const readFile = fileName => fs.readFileSync(fileName).toString();

(async () => {
    const compileContract = (fileName, contractName) => {
        const code = readFile(fileName);
    
        let solcInput = {
            language: "Solidity",
            sources: {
              contract: {
                content: code
              }
            },
            settings: {
              optimizer: {
                enabled: true
              },
              evmVersion: "byzantium",
              outputSelection: {
                "*": {
                  "": ["legacyAST", "ast"],
                  "*": [
                    "abi",
                    "evm.bytecode.object",
                    "evm.bytecode.sourceMap",
                    "evm.deployedBytecode.object",
                    "evm.deployedBytecode.sourceMap",
                    "evm.gasEstimates"
                  ]
                }
              }
            }
        };
    
        solcInput = JSON.stringify(solcInput);
        const output = solc.compile(solcInput);
        return JSON.parse(output).contracts.contract[contractName];
    }
    
    const deployContract = async (fileName, contractName) => {
        const wallet = new ethers.Wallet(PRIVATE_KEY, PROVIDER);
        const compiledContract = compileContract(fileName, contractName);
        const bytecode = '0x' + compiledContract.evm.bytecode.object;
        ABI = compiledContract.abi;
    
        const factory = new ethers.ContractFactory(ABI, bytecode, wallet);
    
        const contract = await factory.deploy();
        CONTRACT_ADDRESS = contract.address;
        
        console.log('Transaction created: ');
        console.log(contract.deployTransaction);
    
        console.log('----------------------------------');
        console.log('Wait for contract to be mined...');
        console.log('----------------------------------');
        await contract.deployed();
    }

    const addFact = async fact => {
        const wallet = new ethers.Wallet(PRIVATE_KEY, PROVIDER);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);
        const tx = await contract.add(fact);
        console.log('----------------------------------');
        console.log('Wait for transaction to be mined...');
        console.log('----------------------------------');
        await tx.wait();
        console.log('**********************************');
        console.log('Transaction mined!');
        return tx;
    }

    const getFact = async index => {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, PROVIDER);
        return await contract.getFact(index);
    }

    const getFactsCount = async () => {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, PROVIDER);
        return await contract.count();
    }
    
    // execution
    await deployContract('./ArrayOfFacts.sol', 'ArrayOfFacts');
    console.log('**********************************');
    console.log('Contract mined!');
    console.log('Contract address: ' + CONTRACT_ADDRESS);
    
    const fact = 'The Times 03/Jan/2009 Chancellor on brink of second bailout for banks';
    console.log('**********************************');
    console.log('Adding fact...');
    const transaction = await addFact(fact);
    console.log('Transaction: ');
    console.log(transaction);

    console.log('**********************************');
    console.log('Getting fact...');
    let index = 0;
    const factRes = await getFact(index);
    console.log('Fact' + ++index + ' : ' + factRes)

    console.log('**********************************');
    console.log('Counting facts...');
    const count = await getFactsCount();
    console.log('Number of facts: ' + ethers.utils.bigNumberify(count).toNumber());

})();

