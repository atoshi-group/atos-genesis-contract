# Core Genesis Contracts

This repo holds all the genesis contracts on Core blockchain, which are part of the core implementations of Satoshi Plus consensus. For more information about Core blockchain and Satoshi Plus consensus, please read the [technical whitepaper](https://docs.coredao.org/core-white-paper-v1.0.5/).



## List of Contracts

- [CandidateHub.sol](./contracts/CandidateHub.sol): This contract manages all validator candidates on Core blockchain. It also exposes the method `turnRound` for the consensus engine to execute the `turn round` workflow. 
- [PledgeAgent.sol](./contracts/PledgeAgent.sol): This contract manages user delegate, also known as stake, including both coin delegate and hash delegate.
- [SlashIndicator.sol](./contracts/SlashIndicator.sol): This contract manages slash/jail operations to validators on Core blockchain.
- [SystemReward.sol](./contracts/SystemReward.sol): This smart contract manages funds for relayers and verifiers.
- [ValidatorSet.sol](./contracts/ValidatorSet.sol): This contract manages elected validators in each round. All rewards for validators on Core blockchain are minted in genesis block and stored in this contract. 



## Prepare

Install dependency:
```shell script
npm install
```



## Run Tests

```shell
# install test dependency
pip install -r requirements.txt

# generate contracts for testing
./generate-test-contracts.sh

# run brownie tests
brownie test -v --stateful false
```



Flatten all system contracts:

```shell script
npm run flatten
```



## Generate genesis.json

1. Edit `init_holders.js` file to alloc the initial CORE holders.
2. Edit `validators.js` file to alloc the initial validator set.
3. Edit `init_cycle.js` file to change core blockchain parameters.
4. Edit `generate-btclightclient.js` file to change `initConsensusStateBytes`.
5. Run ` node generate-genesis.js` to generate genesis.json.



## License

The library is licensed under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0),
also included in our repository in the [LICENSE](LICENSE) file.
