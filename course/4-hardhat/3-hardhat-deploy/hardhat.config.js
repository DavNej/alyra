require('dotenv').config()

require('@nomicfoundation/hardhat-toolbox')
require('@nomiclabs/hardhat-etherscan')
require('hardhat-deploy')

const ALCHEMY_GOERLI = process.env.ALCHEMY_GOERLI || ''
const PRIVATE_KEY = process.env.PRIVATE_KEY || ''
const ETERSCAN_API_KEY = process.env.ETERSCAN_API_KEY || ''

module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
      chainId: 31337,
    },
    goerli: {
      url: ALCHEMY_GOERLI,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 5,
      blockConfirmations: 6,
    },
  },
  etherscan: {
    apiKey: {
      goerli: ETERSCAN_API_KEY,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
    },
  },
  solidity: {
    compilers: [
      {
        version: '0.8.17',
      },
    ],
  },
}
