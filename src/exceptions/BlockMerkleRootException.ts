export class BlockMerkleRootException extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'BlockMerkleRootException'
    }
}
