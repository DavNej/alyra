import crypto from 'crypto-js' // https://www.npmjs.com/package/crypto-js

class Block {
  constructor(data = [], prevHash, index) {
    // timeStamp
    // data - from - to - value
    // hash
    // prevHash
    // index
    // nonce
  }

  getHash() {
    // Hexadécimal
  }

  mine() {
    // Faire une boucle
    // Nonce++;
    // GetHash
    // Si 0000 Ca sera miné parfait
    // Sinon continue la boucle
  }
}

class Blockchain {
  constructor() {
    // Chain
    // Construire un Block Génésis
  }

  getLastBlock() {
    // Permet de récupérer le bloc length - 1 d'une blockchain
    // return block
  }

  addBlock(block) {
    // Permet de rajouter un block à une Blockchain
  }

  isValid(blockchain = this) {
    // Permet de vérifier si la blockchain est valide
  }
}
