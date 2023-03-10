import { chain } from '@core/chain'
import { block } from '@core/block'
import BlockChain from '@core/blockchain'

export const blockchain = new BlockChain(block, chain)
blockchain.mineBlock(['hello world', 'hello world2', 'hello world3'])
console.log(blockchain)
