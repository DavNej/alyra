const Storage = artifacts.require('Storage')

module.exports = async deployer => {
  await deployer.deploy(Storage)
}
