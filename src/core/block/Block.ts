export class Block implements IBlock {
    version: string
    height: number
    timestamp: number
    previousHash: string
    merkleRoot: string
    hash: string
    nonce: number
    difficulty: number
    data: any

    constructor(block: IBlock) {
        this.version = block.version
        this.height = block.height
        this.timestamp = block.timestamp
        this.previousHash = block.previousHash
        this.merkleRoot = block.merkleRoot
        this.nonce = block.nonce
        this.difficulty = block.difficulty
        this.data = block.data
        this.hash = block.hash
    }
}
