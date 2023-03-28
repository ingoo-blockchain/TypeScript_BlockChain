import Block from './Block'
import { BlockValidationException, BlockHeightException, BlockHashException } from '@/exceptions'

describe('Block', () => {
    const config: BlockConfig = {
        VERSION: '1.0.0',
        DIFFICULTY_ADJUSTMENT_INTERVAL: 10,
        UNIT: 1000,
        BLOCK_GENERATION_INTERVAL: 10,
        GENESIS: {
            version: '1.0.0',
            height: 0,
            timestamp: 0,
            previousHash: '0'.repeat(64),
            merkleRoot: '1'.repeat(64),
            nonce: 0,
            difficulty: 0,
            hash: 'f'.repeat(64),
            data: ['genesis block'],
        },
    }
    const block = new Block(config)

    describe('create', () => {
        it('새로운 블록을 생성할 수 있어야 한다.', () => {
            const previousBlock = block.genesis
            const adjustment = {
                difficulty: 0,
                timestamp: previousBlock.timestamp,
            }
            const blockData: BlockData = {
                previousBlock,
                adjustment,
                data: ['block data...'],
            }
            const newBlock = block.create(blockData)
            expect(newBlock.height).toEqual(previousBlock.height + 1)
            expect(newBlock.previousHash).toEqual(previousBlock.hash)
            expect(block.isValidNewBlock(previousBlock, newBlock)).toEqual(newBlock)
        })

        it('이전 블록의 height가 올바르지 않으면 에러를 throw해야 한다', () => {
            const previousBlock = block.genesis
            const adjustment = {
                difficulty: 0,
                timestamp: previousBlock.timestamp,
            }
            const blockData: BlockData = {
                previousBlock: { ...previousBlock, height: -1 },
                adjustment,
                data: [],
            }
            expect(() => block.create(blockData)).toThrow(BlockHeightException)
        })

        it('이전 블록의 hash값이 올바르지 않으면 에러를 throw해야 한다', () => {
            const previousBlock = block.genesis
            const adjustment = {
                difficulty: 0,
                timestamp: previousBlock.timestamp,
            }
            const blockData: BlockData = {
                previousBlock: { ...previousBlock, hash: 'invalid-hash' },
                adjustment,
                data: [],
            }
            expect(() => block.create(blockData)).toThrow(BlockHashException)
        })

        it('새로운 블록의 hash값이 올바르지 않으면 에러를 throw해야 한다', () => {
            const previousBlock = block.genesis
            const adjustment = {
                difficulty: 0,
                timestamp: previousBlock.timestamp,
            }
            const blockData: BlockData = {
                previousBlock,
                adjustment,
                data: [],
            }
            const newBlock = { ...block.create(blockData), hash: 'invalid-hash' }
            expect(() => block.isValidNewBlock(previousBlock, newBlock)).toThrow(BlockValidationException)
        })
    })

    describe('getDifficulty', () => {
        it('height가 0이하이면 에러를 throw해야 한다', () => {
            const params = { height: 0, previousDifficulty: 0, adjustment: { timestamp: 0, difficulty: 0 } }
            expect(() => block.getDifficulty(params, new Date().getTime())).toThrow(BlockHeightException)
        })

        it('height가 10보다 작으면 0이어야 한다', () => {
            const params = { height: 9, previousDifficulty: 0, adjustment: { timestamp: 0, difficulty: 0 } }
            expect(block.getDifficulty(params, new Date().getTime())).toBe(0)
        })

        it('높이가 10에서 19 사이면 1의 난이도를 반환해야합니다.', () => {
            const params = { height: 15, previousDifficulty: 0, adjustment: { timestamp: 0, difficulty: 0 } }
            expect(block.getDifficulty(params, new Date().getTime())).toBe(1)
        })

        it('블록 높이가 DIFFICULTY_ADJUSTMENT_INTERVAL의 배수가 아닌 경우 이전 난이도를 반환해야합니다.', () => {
            const params = { height: 31, previousDifficulty: 2, adjustment: { timestamp: 0, difficulty: 0 } }
            expect(block.getDifficulty(params, new Date().getTime())).toBe(2)
        })

        it('높이가 음수인 경우 오류를 throw해야합니다.', () => {
            const params: BlockDifficultyParams = {
                height: -1,
                previousDifficulty: 0,
                adjustment: {
                    difficulty: 0,
                    timestamp: 0,
                },
            }
            expect(() => block.getDifficulty(params, 0)).toThrow(BlockHeightException)
        })

        it('높이가 10보다 작으면 0을 반환해야합니다.', () => {
            const params: BlockDifficultyParams = {
                height: 5,
                previousDifficulty: 0,
                adjustment: {
                    difficulty: 0,
                    timestamp: 0,
                },
            }
            expect(block.getDifficulty(params, 0)).toEqual(0)
        })
    })

    describe('isBlockHash', () => {
        it('유효한 블록 해시일 경우 true를 반환해야 함', () => {
            const validHash = '2e7d972646f8bfa7f3459d06c3c3f1db8e00e569b96161c69a6a432a6bb95427'
            expect(block.isBlockHash(validHash)).toBe(true)
        })

        it('해시값이 16진수 문자열이 아닐 경우 false를 반환해야 함', () => {
            const nonHexHash = 'g'.repeat(64)
            expect(block.isBlockHash(nonHexHash)).toBe(false)
        })

        it('해시값의 길이가 64가 아닐 경우 false를 반환해야 함', () => {
            const shortHash = '0'.repeat(63)
            const longHash = '0'.repeat(65)
            expect(block.isBlockHash(shortHash)).toBe(false)
            expect(block.isBlockHash(longHash)).toBe(false)
        })
    })

    describe('getMerkleRoot', () => {
        it('주어진 데이터 배열에 대한 올바른 머클 루트값을 반환해야 함', () => {
            const data = ['a', 'b', 'c', 'd']
            const merkleRoot = block.getMerkleRoot(data)
            expect(merkleRoot).toEqual('AB4587D9F4AD6990E0BF4A1C5A836C78CCE881C2B7C4287C0A7DA15B47B8CF1F')
        })

        it('입력값이 배열이 아닐 경우 에러를 throw해야 함', () => {
            const data = 'abcde'
            expect(() => block.getMerkleRoot(data)).toThrow(Error)
        })
    })
})
