export const DIFFICULTY_ADJUSTMENT_INTERVAL: number = 10
export const BLOCK_GENERATION_INTERVAL: number = 10
export const UNIT: number = 60
export const VERSION: string = '1.0.0'

export const GENESIS: IBlock = {
    version: '1.0.0',
    height: 0,
    hash: '0'.repeat(64),
    timestamp: 1231006506,
    previousHash: '0'.repeat(64),
    merkleRoot: '0'.repeat(64),
    difficulty: 0,
    nonce: 0,
    data: ['genesis block'],
}

export const blockConfig: BlockConfig = {
    DIFFICULTY_ADJUSTMENT_INTERVAL,
    BLOCK_GENERATION_INTERVAL,
    UNIT,
    VERSION,
    GENESIS,
}
