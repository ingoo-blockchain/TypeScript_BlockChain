import chain from '@core/chain'
import block from '@core/block'
import BlockChain from '@core/blockchain'

export const core = new BlockChain(block, chain)
core.mineBlock(['hello world', 'hello world2', 'hello world3'])
