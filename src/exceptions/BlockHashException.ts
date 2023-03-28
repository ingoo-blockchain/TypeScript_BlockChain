export class BlockHashException extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'BlockHashException'
    }
}
