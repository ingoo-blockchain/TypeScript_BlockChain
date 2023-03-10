import { ChainValidator } from '@/@types/ChainValidator'
import Chain from '@core/chain/Chain'

export class VerifyChain implements ChainValidator {
    validateChain(chain: Chain): boolean {
        return true
    }
}
