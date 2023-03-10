import Chain from '@core/chain/Chain'

declare interface ChainValidator {
    validateChain(chain: Chain): boolean
}
