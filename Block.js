const sha256 = require('crypto-js/sha256') // https://github.com/brix/crypto-js
const Base64 = require('crypto-js/enc-base64')

class Block {
  constructor(index, prevHash, data = []) {
    this.index = index
    this.timeStamp = Date.now()
    this.data = data
    this.prevHash = prevHash
    this.nonce = 0
    this.difficulty = '00'
  }

  get hash() {
    return Base64.stringify(
      sha256(
        this.index + this.timeStamp + this.data + this.prevHash + this.nonce
      )
    )
  }

  mine() {
    console.log('Mining block ...')
    while (!this.hash.startsWith(this.difficulty)) {
      this.nonce++
    }
    console.log('Block mined ! 🎉', this.hash)
  }
}

module.exports = Block
