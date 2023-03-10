import Chain from '@core/chain/Chain'
import { Block } from '@core/block'

export default class a {
    constructor(private readonly chain: Chain) {}

    public getAdjustmentBlock(interval: number): IBlock {
        const height = this.chain.length < interval ? 0 : this.chain.length - interval
        return this.chain.getBlockByHeight(height)
    }

    public changeChainByCondition(receivedChain: Chain): boolean {
        return true
    }

    verifyChain(): boolean {
        return true
    }
}
