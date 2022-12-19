require('@nomicfoundation/hardhat-toolbox')
require('@nomiclabs/hardhat-etherscan')
require('hardhat-gas-reporter')
require('solidity-coverage')

require('hardhat-deploy')
require('dotenv').config()

const PRIVATE_KEY = process.env.PRIVATE_KEY || ''

const ALCHEMY_GOERLI = process.env.ALCHEMY_GOERLI || ''
const ALCHEMY_MUMBAI = process.env.ALCHEMY_MUMBAI || ''

const ETERSCAN_API_KEY = process.env.ETERSCAN_API_KEY || ''
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || ''

module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
      chainId: 31337,
    },
    goerli: {
      url: ALCHEMY_GOERLI,
      chainId: 5,
      accounts: [`0x${PRIVATE_KEY}`],
      blockConfirmations: 6,
    },
    polygonMumbai: {
      url: ALCHEMY_MUMBAI,
      chainId: 80001,
      accounts: [`0x${PRIVATE_KEY}`],
      blockConfirmations: 6,
    },
  },
  etherscan: {
    apiKey: {
      goerli: ETERSCAN_API_KEY,
      polygonMumbai: POLYGONSCAN_API_KEY,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
    },
  },
  gasReporter: {
    enabled: true,
  },
  solidity: {
    compilers: [
      {
        version: '0.8.17',
      },
    ],
  },
}
