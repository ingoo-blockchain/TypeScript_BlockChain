export class BlockHeightException extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'BlockHeightException'
    }
}
