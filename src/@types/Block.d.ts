declare interface IBlock extends BlockHeader {
    version: string
    height: number
    timestamp: number
    previousHash: string
    merkleRoot: string
    hash: string
    nonce: number
    difficulty: number
    data: any
}
