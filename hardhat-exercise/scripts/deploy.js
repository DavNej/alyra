const hre = require('hardhat')

async function main() {
  const Hello = await hre.ethers.getContractFactory('Hello')
  const hello = await Hello.deploy('Dav')

  await hello.deployed()

  console.log(`Hello deployed to ${hello.address}`)
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
