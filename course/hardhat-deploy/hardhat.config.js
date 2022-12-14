require('@nomicfoundation/hardhat-toolbox')
require('@nomiclabs/hardhat-etherscan')
require('hardhat-deploy')

require('dotenv').config()

const GOERLI_RPC = process.env.INFURA_GOERLI || ''
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
      url: GOERLI_RPC,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 5,
    },
  },
  etherscan: {
    apiKey: {
      goerli: ETERSCAN_API_KEY,
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
