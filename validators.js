const web3 = require("web3")
const RLP = require('rlp');

// Configure
const validators = [
  
   {
     "consensusAddr": "0x043f606C684E88A74aF49bFf2137C2191a04E17e",
     "feeAddr": "0xD9e314b0e67Ed7DD8cdcc3eE49E8800E0E5AB52C",
   },
   {
     "consensusAddr": "0xe13f6f04068846580214ac080048cd0711b5ECB6",
     "feeAddr": "0xD9e314b0e67Ed7DD8cdcc3eE49E8800E0E5AB52C",
   },
   {
     "consensusAddr": "0x03a28251967E5B7A340673e6387FE2536aaaD110",
     "feeAddr": "0xD9e314b0e67Ed7DD8cdcc3eE49E8800E0E5AB52C",
   },
   {
     "consensusAddr": "0xd819bc15D1C68eF330573d247fbee3f28FB11D82",
     "feeAddr": "0xD9e314b0e67Ed7DD8cdcc3eE49E8800E0E5AB52C",
   },
   {
     "consensusAddr": "0xaa1Fa735345244b606b63b91CfDb238C13C862b9",
     "feeAddr": "0xD9e314b0e67Ed7DD8cdcc3eE49E8800E0E5AB52C",
   },
];

// ===============  Do not edit below ====
function generateExtradata(validators) {
  let extraVanity =Buffer.alloc(32);
  let validatorsBytes = extraDataSerialize(validators);
  let extraSeal =Buffer.alloc(65);
  return Buffer.concat([extraVanity,validatorsBytes,extraSeal]);
}

function extraDataSerialize(validators) {
  let n = validators.length;
  let arr = [];
  for (let i = 0;i<n;i++) {
    let validator = validators[i];
    arr.push(Buffer.from(web3.utils.hexToBytes(validator.consensusAddr)));
  }
  return Buffer.concat(arr);
}

function validatorUpdateRlpEncode(validators) {
  let n = validators.length;
  let vals = [];
  for (let i = 0;i<n;i++) {
    vals.push([
      validators[i].consensusAddr,
      validators[i].feeAddr,
    ]);
  }
  return web3.utils.bytesToHex(RLP.encode(vals));
}

extraValidatorBytes = generateExtradata(validators);
validatorSetBytes = validatorUpdateRlpEncode(validators);

exports = module.exports = {
  extraValidatorBytes: extraValidatorBytes,
  validatorSetBytes: validatorSetBytes,
}