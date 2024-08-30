// 使用最新的 Web3 版
const { Web3 }= require('web3');  // 如果你使用的是 CommonJS 模块导入方式

// 创建 Web3 实例并连接到你的以太坊节点
const web3 = new Web3('http://localhost:8979'); // 替换为你的私链地址

// 合约地址
const contractAddress = '0x0000000000000000000000000000000000001005'; // 替换为你的合约地址

// 合约ABI
const abi=require("./candidater.json")

// 创建合约实例
const contract = new web3.eth.Contract(abi, contractAddress);

async function getCandidates() {
  try {
    // 调用 getValidators 方法
    const Candidates = await contract.methods.getCandidates().call();
    console.log('Candidates:', Candidates);
  } catch (error) {
    console.error('Error getting Candidates:', error);
  }
}

// 执行函数
getCandidates();
