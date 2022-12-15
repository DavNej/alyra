const { network } = require('hardhat')
const { developmentChains } = require('../helper-hardhat-config')
const { verify } = require('../utils/verify')

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  log('--------------------------------------')
  const args = ['Jackson', 'Michael', 52]

  const Identification = await deploy('Identification', {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })

  //Verify the smart contract
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETERSCAN_API_KEY
  ) {
    log('Verifying...')
    await verify(Identification.address, args)
  }
}

module.exports.tags = ['']
