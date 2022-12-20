const { network } = require('hardhat')
const { developmentChains } = require('../helper-hardhat-config')
const { verify } = require('../utils/verify')

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  const args = []

  const Bank = await deploy('Bank', {
    from: deployer,
    args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })

  //Verify the smart contract
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETERSCAN_API_KEY
  ) {
    log('Verifying...')
    await verify(Bank.address, args)
  }
}

module.exports.tags = ['all', 'main', 'bank']
