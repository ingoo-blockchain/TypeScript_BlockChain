import Chain from '@core/chain/Chain'
import { block } from '@core/block/'
import { ChainValidator } from '@/@types/ChainValidator'
import { VerifyChain } from '@core/chain/VerifyChain'

const validate: ChainValidator[] = [new VerifyChain()]
export const chain = new Chain([block.genesis], validate)
