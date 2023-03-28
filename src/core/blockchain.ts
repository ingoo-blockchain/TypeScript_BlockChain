import Block from './block/Block'
import Chain from './chain/Chain'

export default class BlockChain {
    constructor(private readonly block: Block, private readonly chain: Chain) {}

    get chains() {
        return this.chain.allBlock
    }

    public mineBlock(data: any): IBlock {
        const blockData: BlockData = this.chain.getblockData(data, this.block.interval)
        const newBlock = this.block.create(blockData)
        return this.chain.addBlock(newBlock)
    }
}
