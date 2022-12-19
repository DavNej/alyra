const { network } = require('hardhat')
const { developmentChains } = require('../helper-hardhat-config')
const { verify } = require('../utils/verify')

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  const args = []

  const ShimanIsERC20 = await deploy('ShimanIsERC20', {
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
    await verify(ShimanIsERC20.address, args)
  }
}

module.exports.tags = ['all', 'main', 'erc20', 'shiman']
