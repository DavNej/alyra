/**
 * Simple proof of work algorithm
 */

const crypto = require('crypto')

function hash(buffer) {
  let f = crypto.createHash('sha256')
  let h = f.update(buffer)
  return h.digest()
}

// Compute hash code from binary buffer
let message = Buffer.from('Hello world').toString('hex') // 48656c6c6f20776f726c64
hash(message).toString('hex') // 64ec88ca00b268e5ba1a35678a1b5316d212f4f366b2477232534a8aeca37f3c

// Compute PoW with target of 000
const TARGET = '000'
let nonce = 0
let hashValue = hash(message + nonce).toString('hex')

while (hashValue.indexOf(TARGET) !== 0) {
  nonce += 1
  hashValue = hash(message + nonce).toString('hex')
}

nonce // 2076
