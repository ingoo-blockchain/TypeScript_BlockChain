declare interface Adjustment {
    difficulty: number
    timestamp: number
}

declare interface BlockDifficultyParams {
    height: number
    adjustment: Adjustment
    previousDifficulty: number
}
