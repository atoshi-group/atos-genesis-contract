const web3 = require("web3")
const RLP = require('rlp');

// Configure
const validators = [
  
   {
     "consensusAddr": "0xa4eCD346d065827d303E95934eD712E978693d97",
     "feeAddr": "0xa4eCD346d065827d303E95934eD712E978693d97",
   },
   {
     "consensusAddr": "0x2Af1516cBA4b8aBd55E98eD2AABF91D367F02734",
     "feeAddr": "0x2Af1516cBA4b8aBd55E98eD2AABF91D367F02734",
   },
   {
     "consensusAddr": "0x217d71773cAF8916484800B959248DAfC44A0629",
     "feeAddr": "0x217d71773cAF8916484800B959248DAfC44A0629",
   },
   {
     "consensusAddr": "0x82F74B5Adc6Cc4aCAc54D80a2559317284fE2b87",
     "feeAddr": "0x82F74B5Adc6Cc4aCAc54D80a2559317284fE2b87",
   },
   {
     "consensusAddr": "0x68786fe80F10449C6cF3aCD97299fAcf15050721",
     "feeAddr": "0x68786fe80F10449C6cF3aCD97299fAcf15050721",
   },
   {
    "consensusAddr": "0xAB8F65a007481a346D907E9BB4c2a83bdb8e9aA9",
    "feeAddr": "0xAB8F65a007481a346D907E9BB4c2a83bdb8e9aA9",
    },
    {
    "consensusAddr": "0xA4458700cfadb165FA7ED5E650835F214482956f",
    "feeAddr": "0xA4458700cfadb165FA7ED5E650835F214482956f",
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