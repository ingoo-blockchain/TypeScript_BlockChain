export class BlockHashLengthError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'BlockHashLengthError'
    }
}
