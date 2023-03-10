import { ChainValidator } from '@/@types/ChainValidator'
import { BlockNotFoundException, LatestBlockNotFoundException } from '@/exceptions'
import { Block } from '@core/block'

export default class Chain {
    constructor(private readonly blocks: IBlock[], private readonly validators: ChainValidator[]) {}

    validate(): boolean {
        for (const validator of this.validators) {
            if (!validator.validateChain(this)) return false
        }
        return true
    }

    public serialize(): string {
        return JSON.stringify(this.blocks)
    }

    public getblockData(data: any, interval: number): BlockData {
        const previousBlock: IBlock = this.latestBlock
        const { difficulty, timestamp } = this.getAdjustmentBlock(interval)
        const adjustment: Adjustment = {
            difficulty,
            timestamp,
        }

        return {
            previousBlock,
            adjustment,
            data,
        }
    }

    public static deserialize(data: string): Chain {
        const blocks: IBlock[] = JSON.parse(data)
        const chain = new Chain(blocks, [])

        return chain
    }

    get latestBlock(): Block {
        const index = this.blocks.length
        if (index === 0) throw new LatestBlockNotFoundException('Latest block not found')
        return this.blocks[index - 1]
    }

    get allBlock(): Block[] {
        return [...this.blocks]
    }

    get length(): number {
        return this.blocks.length
    }

    public addBlock(block: IBlock): IBlock {
        this.blocks.push(block)
        return block
    }

    getBlockByHash(hash: string): Block {
        const f = (block: Block) => block.hash === hash
        return this.getBlock(f)
    }

    getBlockByHeight(height: number): Block {
        const f = (block: Block) => block.height === height
        return this.getBlock(f)
    }

    getBlock(f: (block: Block) => boolean): Block {
        const block = this.blocks.find(f)
        if (block === undefined) throw new BlockNotFoundException('Block Not Found')
        return block
    }

    public getAdjustmentBlock(interval: number): IBlock {
        const height = this.length < interval ? 0 : this.length - interval
        return this.getBlockByHeight(height)
    }
}
