const Block = require('./Block')
const Blockchain = require('./Blockchain')

const transactions1 = [
  {
    from: 'me',
    to: 'you',
    value: 5,
  },
  {
    from: 'her',
    to: 'me',
    value: 7,
  },
]

const transactions2 = [
  {
    from: 'him',
    to: 'you',
    value: 4,
  },
  {
    from: 'you',
    to: 'me',
    value: 9,
  },
]

function main() {
  const chain = new Blockchain()

  const block1 = new Block(
    chain.lastBlock.index + 1,
    chain.lastBlock.hash,
    transactions1
  )
  block1.mine()
  chain.addBlock(block1)

  const block2 = new Block(
    chain.lastBlock.index + 1,
    chain.lastBlock.hash,
    transactions2
  )
  block2.mine()
  chain.addBlock(block2)

  console.log(chain)
}

main()
