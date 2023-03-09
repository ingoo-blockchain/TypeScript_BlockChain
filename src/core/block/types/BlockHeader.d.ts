declare interface BlockHeader {
    version: string
    height: number
    timestamp: number
    previousHash: string
    merkleRoot: string
    difficulty: number
}
