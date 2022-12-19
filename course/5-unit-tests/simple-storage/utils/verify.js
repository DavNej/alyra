const { run } = require('hardhat')

async function verify(contractAddress, args) {
  console.log('Verifying contract...')
  try {
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (err) {
    if ((err.message, toLowerCase().includes('already verified'))) {
      console.error('already verified')
    } else {
      console.error(err)
    }
  }
}

module.exports = {
  verify,
}
