import { SHA256 } from 'crypto-js'
import merkle from 'merkle'
import hexToBinary from 'hex-to-binary'
import { DIFFICULTY_ADJUSTMENT_INTERVAL, UNIT, BLOCK_GENERATION_INTERVAL, VERSION } from '@/block.config'
import Block from '.'
import { BlockHashLengthError, BlockValidationException } from '@/exceptions'

export default class BlockGenerator {
    constructor() {}

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

        const isValid = this.isValidNewBlock(previousBlock, block)
        return block
    }

    private getDifficulty(params: BlockDifficultyParams): number {
        const { height, adjustment, previousDifficulty } = params
        const timestamp = this.getTimestamp()

        if (height < 0) {
            throw new Error('height should be greater than or equal to 0')
        }

        if (height < 10) return 0
        if (height >= 10 && height < 20) return 1
        if (height % DIFFICULTY_ADJUSTMENT_INTERVAL !== 0) return previousDifficulty

        const timeTaken = timestamp - adjustment.timestamp
        const timeExpected = UNIT * BLOCK_GENERATION_INTERVAL * DIFFICULTY_ADJUSTMENT_INTERVAL

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
        const block = new Block({
            version: VERSION,
            height: difficulty.height,
            timestamp: this.getTimestamp(),
            previousHash: previousBlock.hash,
            merkleRoot: this.getMerkleRoot(data),
            nonce: 0,
            difficulty: this.getDifficulty(difficulty),
            hash: 'f'.repeat(64),
            data,
        })

        let hashBinary = ''

        do {
            block.nonce += 1
            block.difficulty = this.getDifficulty(difficulty)
            block.timestamp = this.getTimestamp()
            const { hash, data, ...blockHeader } = block
            block.hash = this.createBlockHash(blockHeader)
            hashBinary = hexToBinary(block.hash)
        } while (!hashBinary.startsWith('0'.repeat(block.difficulty)))

        return block
    }

    private createBlockHash(blockHeader: BlockHeader): string {
        const hash = SHA256(Object.values(blockHeader).join('')).toString()
        if (hash.length === 64) throw new BlockHashLengthError('Invalid Block Length.')
        return hash
    }

    private isValidNewBlock(previousBlock: Block, newBlock: Block): Block {
        if (previousBlock.height + 1 !== newBlock.height)
            throw new BlockValidationException('Block height is incorrect.')

        if (previousBlock.hash !== newBlock.previousHash)
            throw new BlockValidationException('The previous hash value is not correct.')

        if (this.createBlockHash(newBlock) !== newBlock.hash)
            throw new BlockValidationException('Block hash is incorrect.')

        return newBlock
    }
}
