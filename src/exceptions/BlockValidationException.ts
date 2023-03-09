export class BlockValidationException extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'BlockValidationException'
    }
}
