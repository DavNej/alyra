const sha256 = require('crypto-js/sha256') // https://github.com/brix/crypto-js
const Base64 = require('crypto-js/enc-base64')

class Block {
  constructor(index, prevHash, data = []) {
    this.index = index
    this.timeStamp = new Date()
    this.data = data // [{ from, to, value }]
    this.prevHash = prevHash
    this.nonce = 0
    this.hash = this.getHash()
    this.difficulty = '00'
  }

  getHash() {
    this.hash = Base64.stringify(
      sha256(
        this.index + this.timeStamp + this.data + this.prevHash + this.nonce
      )
    )
    return this.hash
  }

  mine() {
    while (!this.hash.startsWith(this.difficulty)) {
      this.nonce++
      this.getHash()
      console.log(this.nonce)
    }
    console.log('Block mined ! 🎉', this.hash)
  }
}

module.exports = Block
