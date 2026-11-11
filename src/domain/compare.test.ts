import { describe, expect, it } from 'vitest'
import { bestIndices } from './compare'

describe('bestIndices', () => {
  it('finds the highest value', () => {
    expect(bestIndices([50, 80, 65], 'highest')).toEqual([1])
  })

  it('finds the lowest value', () => {
    expect(bestIndices([900, 750, 1200], 'lowest')).toEqual([1])
  })

  it('returns every index that ties for the best value', () => {
    expect(bestIndices([80, 80, 60], 'highest')).toEqual([0, 1])
  })

  it('highlights nothing when all values are equal', () => {
    expect(bestIndices([70, 70, 70], 'highest')).toEqual([])
  })

  it('ignores missing values', () => {
    expect(bestIndices([null, 40, 60], 'highest')).toEqual([2])
  })

  it('highlights nothing when there is only one value to compare', () => {
    expect(bestIndices([null, 60, null], 'highest')).toEqual([])
  })
})