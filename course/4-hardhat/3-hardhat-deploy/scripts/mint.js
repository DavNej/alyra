const { ethers, getNamedAccounts } = require('hardhat')

async function mintAndList() {
  const { deployer } = await getNamedAccounts()

  const amountToMint = 1000

  const alyraIsERC20 = await ethers.getContract('AlyraIsERC20')
  const minTx = await alyraIsERC20.mint(deployer, amountToMint)

  await minTx.wait(1) // good practice wait for 1 block

  let newBalance = await alyraIsERC20.balanceOf(deployer)
  console.log(`New balance of deployer ${deployer} is ${newBalance}`)
}

mintAndList()
  .then(() => {
    process.exit(0)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
