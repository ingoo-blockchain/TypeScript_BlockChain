import { SHA256 } from 'crypto-js'
import merkle from 'merkle'
import hexToBinary from 'hex-to-binary'
import { BlockStruct } from '@/core/block/BlockStruct'
import { BlockHashException, BlockHeightException, BlockMerkleRootException, BlockValidationException } from '@/exceptions'

export default class Block {
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

    get genesis(): IBlock {
        return this.config.GENESIS
    }

    get interval(): number {
        return this.config.DIFFICULTY_ADJUSTMENT_INTERVAL
    }

    public getDifficulty(params: BlockDifficultyParams, timestamp: number): number {
        const { height, adjustment, previousDifficulty } = params

        if (height <= 0) {
            throw new BlockHeightException('height should be greater than or equal to 0')
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

    public getMerkleRoot(data: any): string {
        if (!Array.isArray(data)) throw new BlockMerkleRootException('The content of Data is not an Array.')
        if (data.length <= 0) throw new BlockMerkleRootException('The data array is empty. Please input valid data.')
        const merkleRoot = merkle('sha256').sync(data).root()
        if (!this.isBlockHash(merkleRoot)) throw new BlockHashException('invalid merkle root')
        return merkleRoot
    }

    private proofOfWork(params: ProofOfWorkParams) {
        const { previousBlock, difficulty, data } = params
        const timestamp = this.getTimestamp()
        const block = new BlockStruct({
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
        if (!this.isBlockHash(newHash)) throw new BlockHashException('Invalid Block hash.')
        return newHash
    }

    public isBlockHash(str: string): boolean {
        const hexRegExp = /^[0-9a-fA-F]+$/
        return hexRegExp.test(str) && str.length === 64 && '0'.repeat(64) !== str
    }

    public isValidNewBlock(previousBlock: IBlock, newBlock: IBlock): IBlock {
        if (previousBlock.height + 1 !== newBlock.height)
            throw new BlockValidationException('Block height is incorrect.')

        if (!this.isBlockHash(previousBlock.hash) || previousBlock.hash !== newBlock.previousHash)
            throw new BlockHashException('The previous hash value is not correct.')

        if (this.createBlockHash(newBlock) !== newBlock.hash)
            throw new BlockValidationException('Block hash is incorrect.')

        return newBlock
    }
}
