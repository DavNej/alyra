const { ethers, getNamedAccounts } = require('hardhat')

async function addPerson() {
  const { deployer } = await getNamedAccounts()

  const address = '0xbe188D6641E8b680743A4815dFA0f6208038960F'
  const lastName = 'Einstein'
  const firstName = 'Albert'
  const age = 140

  console.log({ deployer })

  const identification = await ethers.getContract('Identification')

  const addPersonTx = await identification.addPerson(
    address,
    lastName,
    firstName,
    age
  )

  await addPersonTx.wait(1) // good practice wait for 1 block

  const newPerson = await identification.getPerson(address)
  console.log(`Albert should be ${newPerson}`)
}

addPerson()
  .then(() => {
    process.exit(0)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
