const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// 配置
//const NODE_URL = 'https://rpc.test.btcs.network'; // 替换为你的以太坊节点的 RPC URL
// const NODE_URL = 'http://localhost:8979';
const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000001005'; // 替换为你的 CandidateHub 合约地址
const CONTRACT_ABI = [
  "function register(address consensusAddr, address payable feeAddr, uint32 commissionThousandths) external payable",
  "function requiredMargin() external view returns (uint256)"
];

// const KEYSTORE_PATH = path.join(__dirname, 'key-5.json'); // 替换为你的 keystore 文件路径
const PASSWORD = 'atoshi'; // 替换为你的 keystore 密码

// 提取私钥并创建钱包对象
async function getWallet(NODE_URL,publicKeyPath) {
  try {
    const KEYSTORE_PATH = path.join(__dirname, publicKeyPath); //
    const keystoreJson = fs.readFileSync(KEYSTORE_PATH, 'utf8');
    const wallet = await ethers.Wallet.fromEncryptedJson(keystoreJson, PASSWORD);
    const provider = new ethers.JsonRpcProvider(NODE_URL);

    try {
      // 获取当前区块高度
      const blockNumber = await provider.getBlockNumber();
      console.log('当前区块高度:', blockNumber);
    } catch (error) {
      console.error('获取区块高度时出错:', error);
    }

    return wallet.connect(provider);
  } catch (error) {
    console.error('解密 keystore 文件失败:', error);
  }
}

// 注册候选人
async function registerCandidate() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('请提供钱包私钥地址和节点 RPC 地址。');
    process.exit(1);
  }

 
  const NODE_URL = args[0];
  const privateKeyPath = args[1];
  console.log('接收到的钱包私钥地址:', privateKeyPath);
  console.log('接收到的节点 RPC 地址:', NODE_URL);

  try {
    const wallet = await getWallet(NODE_URL, privateKeyPath);
    if (!wallet) {
      throw new Error('无法获取钱包对象');
    }

    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

    const walletAddress = await wallet.getAddress();
    console.log('钱包地址:', walletAddress);
    // 替换以下参数为实际值
    const consensusAddr = walletAddress; // 替换为共识地址
    const feeAddr = '0x68786fe80f10449c6cf3acd97299facf15050721'; // 替换为费用地址
    const commissionThousandths = 50; // 替换为实际的佣金千分比
    console.log('consensusAddresses:', consensusAddr);
    console.log('feeAddr:', feeAddr);
    console.log('commissionThousandths:', commissionThousandths);
    console.log("###############");
    // 从合约中读取所需的押金
    const requiredMargin = await contract.requiredMargin();
    console.log('所需的押金:', requiredMargin);

    // 调用 register 方法
    const tx = await contract.register(consensusAddr, feeAddr, commissionThousandths,{value:ethers.parseEther("20000")});

    console.log('交易发送中...');
    const receipt=await tx.wait(); // 等待交易确认
    console.log('注册成功！');

    console.log('交易哈希:', tx.hash);
    console.log('交易确认块号:', receipt.blockNumber);
    console.log('交易确认时间:', receipt.timestamp);

  } catch (error) {
    console.error('注册失败:', error);
  }
}


// 执行注册函数
registerCandidate();
