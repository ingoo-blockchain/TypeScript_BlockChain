import { SHA256 } from 'crypto-js'
import merkle from 'merkle'
import hexToBinary from 'hex-to-binary'
import { Block } from '@core/block/Block'
import { BlockHashLengthError, BlockValidationException } from '@/exceptions'

export class BlockGenerator {
    constructor(private readonly config: BlockConfig) {}

    create(blockData: BlockData): IBlock {
        const { previousBlock, adjustment } = blockData
        const { height, difficulty: previousDifficulty } = previousBlock

        const difficulty: BlockDifficultyParams = {
            height: height + 1,
            previousDifficulty,
            adjustment,
        }

        const block = this.proofOfWork({
            previousBlock,
            difficulty,
            data: blockData.data,
        })

        return this.isValidNewBlock(previousBlock, block)
    }

    get genesis(): Block {
        return this.config.GENESIS
    }

    get interval(): number {
        return this.config.DIFFICULTY_ADJUSTMENT_INTERVAL
    }

    private getDifficulty(params: BlockDifficultyParams, timestamp: number): number {
        const { height, adjustment, previousDifficulty } = params

        if (height < 0) {
            throw new Error('height should be greater than or equal to 0')
        }

        if (height < 10) return 0
        if (height >= 10 && height < 20) return 1
        if (height % this.config.DIFFICULTY_ADJUSTMENT_INTERVAL !== 0) return previousDifficulty

        const timeTaken = timestamp - adjustment.timestamp
        const timeExpected =
            this.config.UNIT * this.config.BLOCK_GENERATION_INTERVAL * this.config.DIFFICULTY_ADJUSTMENT_INTERVAL

        if (timeTaken < timeExpected / 2) return adjustment.difficulty + 1
        if (timeTaken > timeExpected * 2) return adjustment.difficulty - 1
        return adjustment.difficulty
    }

    private getTimestamp(): number {
        return new Date().getTime()
    }

    private getMerkleRoot(data: any): string {
        if (!Array.isArray(data)) throw new Error('The content of Data is not an Array.')
        return merkle('sha256').sync(data).root()
    }

    private proofOfWork(params: ProofOfWorkParams) {
        const { previousBlock, difficulty, data } = params
        const timestamp = this.getTimestamp()
        const block = new Block({
            version: this.config.VERSION,
            height: difficulty.height,
            timestamp: this.getTimestamp(),
            previousHash: previousBlock.hash,
            merkleRoot: this.getMerkleRoot(data),
            nonce: 0,
            difficulty: this.getDifficulty(difficulty, timestamp),
            hash: 'f'.repeat(64),
            data,
        })

        let hashBinary = ''

        do {
            block.nonce += 1
            block.timestamp = this.getTimestamp()
            block.difficulty = this.getDifficulty(difficulty, block.timestamp)

            block.hash = this.createBlockHash(block)
            hashBinary = hexToBinary(block.hash)
        } while (!hashBinary.startsWith('0'.repeat(block.difficulty)))

        return block
    }

    private createBlockHash(block: IBlock): string {
        const { hash, data, ...blockHeader } = block
        const newHash = SHA256(Object.values(blockHeader).sort().join('')).toString()
        if (newHash.length !== 64) throw new BlockHashLengthError('Invalid Block Length.')
        return newHash
    }

    private isValidNewBlock(previousBlock: IBlock, newBlock: IBlock): IBlock {
        if (previousBlock.height + 1 !== newBlock.height)
            throw new BlockValidationException('Block height is incorrect.')

        if (previousBlock.hash !== newBlock.previousHash)
            throw new BlockValidationException('The previous hash value is not correct.')

        if (this.createBlockHash(newBlock) !== newBlock.hash)
            throw new BlockValidationException('Block hash is incorrect.')

        return newBlock
    }
}
