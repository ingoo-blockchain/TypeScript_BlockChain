import { BlockGenerator } from '@core/block/BlockGenerator'
import { blockConfig } from '@/config'

export const block = new BlockGenerator(blockConfig)
export * from '@core/block/Block'
export * from '@core/block/BlockGenerator'
