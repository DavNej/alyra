// const { MerkleTree } = require('merkletreejs');

const sha256 = require('crypto-js/sha256') // https://github.com/brix/crypto-js
const Base64 = require('crypto-js/enc-base64')

class Block {
  constructor(index, prevHash, data = [], difficulty) {
    this.index = index
    this.timeStamp = Date.now()
    this.data = data
    this.prevHash = prevHash
    this.nonce = 0
    this.hash = this.getHash()
    this.difficulty = difficulty
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
    console.log('\nMining block ...')
    while (!this.hash.startsWith(this.difficulty)) {
      this.nonce++
      this.getHash()
    }
    console.log('Block mined ! 🎉', this.hash)
  }
}

module.exports = Block

/**
class Block {
   previousHash: string;
   timestamp: number;
   transactionsList: Transaction[];
   merkelRoot: string;
  difficulty: number;
  nonce: number;
  // merkleTree: MerkleTree;
  merkleTree: string;
  
  constructor(previousHash, transactionsList) {
    this.previousHash = previousHash;
    this.transactionsList = transactionsList;
    this.timestamp = Date.now();
    this.merkelRoot = this.computeMerkelRoot();
    
    this.nonce = 0;
    this.difficulty = 1;
  }
  
  computeMerkelRoot(): string {
    const leaves = this.transactionsList.map(x => SHA256(x));
    this.merkleTree = new MerkleTree(leaves, SHA256);
    
    return tree.getRoot().toString('hex');
  }
  
  computeHash(nonce) {
    return SHA256(
      this.previousHash +
      this.timestamp +
      JSON.stringify(this.transactionsList) +
      this.merkelRoot +
      nonce
      ).toString();
  }

  mine() {
    let nonce = 0;
    
    // Todo: Add difficulty
    while (this.computeHash(nonce).indexOf('0') !== 0) {
      nonce += 1;
    }
    
    return nonce;
  }
  
  verify(nonce) {
    this.computeHash(nonce);
    this.hash = hash;
    
    console.log(this.merkleTree.verify(proof, leaf, root)); // true
    this.header = this.makeHeader(previousHash, transactionsList);
  }
}

*/
