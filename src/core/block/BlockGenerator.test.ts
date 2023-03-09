import BlockGenerator from './BlockGenerator'
import Block from '.'
import { DIFFICULTY_ADJUSTMENT_INTERVAL, UNIT, BLOCK_GENERATION_INTERVAL, VERSION } from '@/block.config'

describe('BlockGenerator', () => {
    let blockGenerator: BlockGenerator

    beforeEach(() => {
        blockGenerator = new BlockGenerator()
    })

    describe('create', () => {
        const previousBlock = new Block({
            version: VERSION,
            height: 0,
            timestamp: new Date().getTime(),
            previousHash: '',
            merkleRoot: '',
            hash: '',
            nonce: 0,
            difficulty: 0,
            data: [],
        })

        const adjustment = {
            difficulty: 0,
            timestamp: 0,
        }

        const data = ['hello', 'world']

        it('should create a new block', () => {
            const block = blockGenerator.create({
                previousBlock,
                adjustment,
                data,
            })

            expect(block.version).toEqual(VERSION)
            expect(block.height).toEqual(1)
            expect(block.previousHash).toEqual(previousBlock.hash)
            expect(block.data).toEqual(data)
            expect(block.nonce).toBeGreaterThanOrEqual(0)
            expect(block.difficulty).toBeGreaterThanOrEqual(0)
            expect(block.timestamp).toBeGreaterThanOrEqual(0)
            expect(block.hash).not.toEqual('')
        })

        it('should increase the difficulty after DIFFICULTY_ADJUSTMENT_INTERVAL blocks', () => {
            const blocks = []
            let previousBlock = new Block({
                version: VERSION,
                height: 0,
                timestamp: new Date().getTime(),
                previousHash: '',
                merkleRoot: '',
                hash: '',
                nonce: 0,
                difficulty: 0,
                data: [],
            })

            for (let i = 0; i < DIFFICULTY_ADJUSTMENT_INTERVAL; i++) {
                const block = blockGenerator.create({
                    previousBlock,
                    adjustment,
                    data,
                })
                blocks.push(block)
                previousBlock = block
            }

            const lastBlock = blocks[DIFFICULTY_ADJUSTMENT_INTERVAL - 1]
            const newBlock = blockGenerator.create({
                previousBlock: lastBlock,
                adjustment,
                data,
            })

            expect(newBlock.difficulty).toEqual(lastBlock.difficulty)
        })
    })
})
