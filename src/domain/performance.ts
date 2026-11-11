import type { PartsByCategory } from '../types/parts'

export type PerformanceTier = 'Entry' | 'Mainstream' | 'High-end' | 'Enthusiast'

export interface ScoreResult {
  score: number
  tier: PerformanceTier
}

export interface PerformanceEstimate {
  gaming: ScoreResult | null
  work: ScoreResult | null
  bottleneck: string | null
}

// A CPU and GPU gaming score further apart than this is reported as a bottleneck.
export const BOTTLENECK_GAP = 25

export function tierFor(score: number): PerformanceTier {
  if (score <= 40) return 'Entry'
  if (score <= 65) return 'Mainstream'
  if (score <= 85) return 'High-end'
  return 'Enthusiast'
}

export function ramScore(capacityGB: number): number {
  if (capacityGB >= 64) return 100
  if (capacityGB >= 32) return 90
  if (capacityGB >= 16) return 70
  if (capacityGB >= 8) return 40
  return 20
}

function toResult(raw: number): ScoreResult {
  const score = Math.round(raw)
  return { score, tier: tierFor(score) }
}

// A score needs every part it is built from, so a half-finished build gets `null` instead of a guess.
export function estimatePerformance({ cpu, gpu, ram }: PartsByCategory): PerformanceEstimate {
  const gaming = cpu && gpu ? toResult(0.7 * gpu.gamingScore + 0.3 * cpu.gamingScore) : null

  const work =
    cpu && gpu && ram
      ? toResult(0.6 * cpu.workScore + 0.2 * gpu.workScore + 0.2 * ramScore(ram.capacityGB))
      : null

  let bottleneck: string | null = null
  if (cpu && gpu) {
    const gap = gpu.gamingScore - cpu.gamingScore
    if (gap > BOTTLENECK_GAP) {
      bottleneck = 'The CPU is much weaker than the graphics card, so it may hold back its performance.'
    } else if (-gap > BOTTLENECK_GAP) {
      bottleneck = 'The graphics card is much weaker than the CPU, so it will limit gaming performance.'
    }
  }

  return { gaming, work, bottleneck }
}