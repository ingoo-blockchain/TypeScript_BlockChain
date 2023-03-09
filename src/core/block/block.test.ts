import Block from '.'

describe('Block', () => {
    const blockData = {
        version: '1',
        height: 0,
        timestamp: 1234567890,
        previousHash: '00000000000000000000000000000000',
        merkleRoot: 'abc',
        nonce: 12345,
        difficulty: 1,
        hash: '1234567890',
        data: 'Hello, world!',
    }

    it('should create a block instance', () => {
        const block = new Block(blockData)

        expect(block.version).toBe('1')
        expect(block.height).toBe(0)
        expect(block.timestamp).toBe(1234567890)
        expect(block.previousHash).toBe('00000000000000000000000000000000')
        expect(block.merkleRoot).toBe('abc')
        expect(block.nonce).toBe(12345)
        expect(block.difficulty).toBe(1)
        expect(block.hash).toBe('1234567890')
        expect(block.data).toBe('Hello, world!')
    })

    it('should update block data', () => {
        const block = new Block(blockData)

        block.data = 'Hello, TypeScript!'
        block.hash = '0987654321'

        expect(block.data).toBe('Hello, TypeScript!')
        expect(block.hash).toBe('0987654321')
    })
})
