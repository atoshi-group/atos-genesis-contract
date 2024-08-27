// 引入ethers库
const { ethers } = require("ethers");

// 你自建节点的RPC URL
const NODE_URL = 'http://localhost:8979'; // 请根据你的节点配置调整这个URL

// 创建与自建节点连接的ethers provider
const provider = new ethers.JsonRpcProvider(NODE_URL);

// 获取当前区块高度的异步函数
async function getBlockHeight() {
  try {
    // 获取当前区块高度
    const blockNumber = await provider.getBlockNumber();
    console.log('当前区块高度:', blockNumber);
  } catch (error) {
    console.error('获取区块高度时出错:', error);
  }
}

// 调用函数
getBlockHeight();

