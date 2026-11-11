import { describe, expect, it } from 'vitest'
import type { Cpu, Gpu, Ram } from '../types/parts'
import { BOTTLENECK_GAP, estimatePerformance, ramScore, tierFor, type PerformanceTier } from './performance'

const cpu = (overrides: Partial<Cpu> = {}): Cpu => ({
  id: 'cpu', category: 'cpu', brand: 'AMD', name: 'Test CPU', price: 200,
  socket: 'AM5', cores: 6, tdpW: 65, gamingScore: 70, workScore: 70, ...overrides,
})
const gpu = (overrides: Partial<Gpu> = {}): Gpu => ({
  id: 'gpu', category: 'gpu', brand: 'NVIDIA', name: 'Test GPU', price: 500,
  lengthMm: 300, tdpW: 200, vramGB: 12, gamingScore: 80, workScore: 60, ...overrides,
})
const ram = (overrides: Partial<Ram> = {}): Ram => ({
  id: 'ram', category: 'ram', brand: 'Corsair', name: 'Test RAM', price: 90,
  type: 'DDR5', capacityGB: 32, ...overrides,
})

describe('tierFor', () => {
  const cases: [number, PerformanceTier][] = [
    [0, 'Entry'],
    [40, 'Entry'],
    [41, 'Mainstream'],
    [65, 'Mainstream'],
    [66, 'High-end'],
    [85, 'High-end'],
    [86, 'Enthusiast'],
    [100, 'Enthusiast'],
  ]

  it.each(cases)('maps a score of %i to %s', (score, tier) => {
    expect(tierFor(score)).toBe(tier)
  })
})

describe('ramScore', () => {
  const cases: [number, number][] = [
    [4, 20],
    [8, 40],
    [16, 70],
    [32, 90],
    [64, 100],
    [128, 100],
  ]

  it.each(cases)('scores %iGB as %i', (capacityGB, expected) => {
    expect(ramScore(capacityGB)).toBe(expected)
  })
})

describe('estimatePerformance', () => {
  it('has no gaming score without both a CPU and a GPU', () => {
    expect(estimatePerformance({ cpu: cpu() }).gaming).toBeNull()
    expect(estimatePerformance({ gpu: gpu() }).gaming).toBeNull()
  })

  it('weights the GPU 70% and the CPU 30% for gaming', () => {
    // 0.7 * 80 + 0.3 * 70 = 77
    const { gaming } = estimatePerformance({ cpu: cpu({ gamingScore: 70 }), gpu: gpu({ gamingScore: 80 }) })
    expect(gaming).toEqual({ score: 77, tier: 'High-end' })
  })

  it('has no work score without a CPU, a GPU and RAM', () => {
    expect(estimatePerformance({ cpu: cpu(), gpu: gpu() }).work).toBeNull()
  })

  it('combines CPU, GPU and RAM for the work score', () => {
    // 0.6 * 70 + 0.2 * 60 + 0.2 * 90 = 72
    const { work } = estimatePerformance({
      cpu: cpu({ workScore: 70 }),
      gpu: gpu({ workScore: 60 }),
      ram: ram({ capacityGB: 32 }),
    })
    expect(work).toEqual({ score: 72, tier: 'High-end' })
  })

  it('reports a CPU bottleneck when the GPU is much stronger', () => {
    const { bottleneck } = estimatePerformance({ cpu: cpu({ gamingScore: 40 }), gpu: gpu({ gamingScore: 80 }) })
    expect(bottleneck).toMatch(/^The CPU is much weaker/)
  })

  it('reports a GPU bottleneck when the CPU is much stronger', () => {
    const { bottleneck } = estimatePerformance({ cpu: cpu({ gamingScore: 90 }), gpu: gpu({ gamingScore: 50 }) })
    expect(bottleneck).toMatch(/^The graphics card is much weaker/)
  })

  it('reports no bottleneck when the gap is exactly the limit', () => {
    const { bottleneck } = estimatePerformance({
      cpu: cpu({ gamingScore: 50 }),
      gpu: gpu({ gamingScore: 50 + BOTTLENECK_GAP }),
    })
    expect(bottleneck).toBeNull()
  })

  it('reports no bottleneck for balanced parts', () => {
    const { bottleneck } = estimatePerformance({ cpu: cpu({ gamingScore: 70 }), gpu: gpu({ gamingScore: 70 }) })
    expect(bottleneck).toBeNull()
  })
})