import { BlockGenerator } from './block/BlockGenerator'
import Chain from './chain/Chain'

export default class BlockChain {
    constructor(private readonly block: BlockGenerator, private readonly chain: Chain) {}

    public mineBlock(data: any): IBlock {
        const blockData: BlockData = this.chain.getblockData(data, this.block.interval)
        const newBlock = this.block.create(blockData)
        return this.chain.addBlock(newBlock)
    }
}
