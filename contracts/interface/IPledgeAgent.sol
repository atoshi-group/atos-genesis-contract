// SPDX-License-Identifier: Apache2.0
pragma solidity 0.8.4;

interface IPledgeAgent {
  function addRoundReward(address[] calldata agentList, uint256[] calldata rewardList) payable external;
  function getHybridScore(address[] calldata candidates) external returns(uint256[] memory, uint256);
  function setNewRound(address[] calldata validatorList,  uint256 totalCoin, uint256 round) external;
  function distributeStakingReward(address candidate) external;
  function onFelony(address agent) external;
}
