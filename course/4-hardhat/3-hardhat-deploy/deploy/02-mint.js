const { network, ethers } = require('hardhat')

module.exports = async ({ getNamedAccounts }) => {
  const { deployer } = await getNamedAccounts()

  const alyraIsERC20 = await ethers.getContract('AlyraIsERC20')
  const minTx = await alyraIsERC20.mint(deployer, 1000)

  await minTx.wait(1) // good practice
  let balance = await alyraIsERC20.balanceOf(deployer)
  console.log(`Balance of deployer ${deployer} is ${balance}`)
}

module.exports.tags = ['all', 'erc20', 'main']
