const ethers = require('ethers');
const solc = require('solc');
const Contract = ethers.Contract;
const provider = ethers.getDefaultProvider('ropsten');
const fs = require('fs-extra');

function readFile(fileName) {
    return fs.readFileSync(fileName, 'utf8');
}

function compileContract(fileName, contractName) {
    let contractStr = readFile(fileName);
    console.log(contractStr);
    let output = solc.compile(contractStr);
    console.log(output);
    return output.contracts[':' + contractName];
}
const compiledContract = compileContract('./ArrayOfFacts.sol','ArrayOfFacts');
console.log(compiledContract);

const abi = compiledContract.interface;