const solc = require('solc');
const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');
const { Command } = require('commander');
const web3 = require('web3');

const program = new Command();
program.option('-c, --chainid <chainid>', 'chain id, mainnet 1116 testnet 1115 devnet 1112', '1167');
program.option('-o, --output <output-file>', 'Genesis json file', './genesis.json');
program.option('-t, --template <template>', 'Genesis template json', './genesis-template.json');
program.parse(process.argv);

const validators = require('./validators');
const init_holders = require('./init_holders');
const init_cycle = require('./init_cycle');

const contracts = [
  { key: 'validatorContract', file: 'contracts/ValidatorSet.sol', name: 'ValidatorSet' },
  { key: 'systemRewardContract', file: 'contracts/SystemReward.sol', name: 'SystemReward' },
  { key: 'slashContract', file: 'contracts/SlashIndicator.sol', name: 'SlashIndicator' },
  { key: 'btcLightClient', file: 'contracts/BtcLightClient.sol', name: 'BtcLightClient' },
  { key: 'relayerHub', file: 'contracts/RelayerHub.sol', name: 'RelayerHub' },
  { key: 'candidateHub', file: 'contracts/CandidateHub.sol', name: 'CandidateHub' },
  { key: 'govHub', file: 'contracts/GovHub.sol', name: 'GovHub' },
  { key: 'pledgeAgent', file: 'contracts/PledgeAgent.sol', name: 'PledgeAgent' },
  { key: 'burn', file: 'contracts/Burn.sol', name: 'Burn' },
  { key: 'foundation', file: 'contracts/Foundation.sol', name: 'Foundation' },
];

function findImports(importPath) {
  try {
    const fullPath = path.resolve(__dirname, importPath);
    const content = fs.readFileSync(fullPath, 'utf8');
    return { contents: content };
  } catch (e) {
    return { error: `File not found: ${importPath}` };
  }
}

function compileContract(contract) {
  console.log(`Compiling ${contract.file}...`);
  return new Promise((resolve, reject) => {
    const contractPath = path.resolve(__dirname, contract.file);
    const source = fs.readFileSync(contractPath, 'utf8');

    const input = {
      language: 'Solidity',
      sources: {
        [contract.file]: {
          content: source
        }
      },
      settings: {
        outputSelection: {
          '*': {
            '*': ['evm.bytecode.object']
          }
        },
        optimizer: {
          enabled: true,
          runs: 10000
        }
      }
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

    if (output.errors) {
      output.errors.forEach(err => {
        console.error(err.formattedMessage);
      });
    }

    const compiledContract = output.contracts[contract.file];
    for (const contractName in compiledContract) {
      const contractData = compiledContract[contractName];
      console.log(`Compiled ${contract.file}:${contractName}`);
      resolve({ key: contract.key, bytecode: contractData.evm.bytecode.object });
    }
  });
}

Promise.all(contracts.map(compileContract)).then(compiledContracts => {
  const data = {
    chainId: program.chainid,
    initHolders: init_holders,
    initCycle: init_cycle,
    extraData: web3.utils.bytesToHex(validators.extraValidatorBytes)
  };

  compiledContracts.forEach(contract => {
    data[contract.key] = contract.bytecode || null;
  });

  const templateString = fs.readFileSync(program.template, 'utf8');
  const resultString = nunjucks.renderString(templateString, data);
  console.log('Generated genesis.json:');
  console.log(resultString);

  fs.writeFileSync(program.output, resultString);
  console.log(`Genesis file generated: ${program.output}`);
}).catch(error => {
  console.error('Error compiling contracts:', error);
});