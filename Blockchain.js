const Block = require('./Block')

class Blockchain {
  constructor() {
    const genesisData = 'I am THE genesis block 💫'
    const genesisBlock = new Block(0, null, genesisData)

    this.chain = [genesisBlock]
  }

  get size() {
    return this.chain.length
  }

  get lastBlock() {
    return this.chain[this.size - 1]
  }

  addBlock(block) {
    if (!this.isValid(block)) {
      throw new Error('Block is corrupted ⛔️', block)
    }

    this.chain.push(block)
    console.log('Block successfully added 🧱', block)
    return block
  }

  isValid(block = null) {
    const chainToValidate = block ? [...this.chain, block] : this.chain

    return chainToValidate.reduce((result, currBlock, index, chain) => {
      if (index === 0) return true
      return result && currBlock.prevHash === chain[index - 1].hash
    }, true)
  }
}

module.exports = Blockchain
