require('@nomicfoundation/hardhat-toolbox')
require('@nomiclabs/hardhat-etherscan')

require('dotenv').config()

const MUMBAI_RPC = process.env.ALCHEMY_MUMBAI || ''
const PRIVATE_KEY = process.env.PRIVATE_KEY || ''
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || ''

module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
      chainId: 31337,
    },
    polygonMumbai: {
      url: MUMBAI_RPC,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 80001,
    },
  },
  polygonscan: {
    apiKey: {
      polygonMumbai: POLYGONSCAN_API_KEY,
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
