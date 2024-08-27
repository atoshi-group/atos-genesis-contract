// 使用最新的 Web3 版
const { Web3 }= require('web3');  // 如果你使用的是 CommonJS 模块导入方式

// 创建 Web3 实例并连接到你的以太坊节点
const web3 = new Web3('http://localhost:8979'); // 替换为你的私链地址

// 合约地址
const contractAddress = '0x0000000000000000000000000000000000001000'; // 替换为你的合约地址

// 合约ABI
const abi=require("./validater.json")

// 创建合约实例
const contract = new web3.eth.Contract(abi, contractAddress);

async function getValidators() {
  try {
    // 调用 getValidators 方法
    const validators = await contract.methods.getValidators().call();
    console.log('Validators:', validators);
  } catch (error) {
    console.error('Error getting validators:', error);
  }
}

// 执行函数
getValidators();
