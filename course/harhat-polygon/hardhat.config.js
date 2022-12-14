require('@nomicfoundation/hardhat-toolbox')
require('@nomiclabs/hardhat-etherscan')

require('dotenv').config()

const MUMBAI_RPC = process.env.ALCHEMY_MUMBAI || ''
const PRIVATE_KEY = process.env.PRIVATE_KEY || ''

module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
      chainId: 31337,
    },
    polygon: {
      url: MUMBAI_RPC,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 5,
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
