const Storage = artifacts.require('Storage')

module.exports = async deployer => {
  await deployer.deploy(Storage, { value: 1000 })

  var instance = await Storage.deployed()
  console.log({ initialBalance })

  const initialBalance = await instance.retrieve()
  console.log({ initialBalance })

  await instance.store(18)
  const newValue = await instance.retrieve()
  console.log({ newValue })
}
