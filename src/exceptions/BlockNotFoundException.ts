export class BlockNotFoundException extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'BlockNotFoundException'
        // Object.setPrototypeOf(this, BlockNotFoundException.prototype)
    }
}
