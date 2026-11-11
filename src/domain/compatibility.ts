import type { Category, PartsByCategory } from '../types/parts'

export type IssueId = 'socket-mismatch' | 'memory-mismatch' | 'psu-underpowered' | 'gpu-too-long'

export interface CompatibilityIssue {
  id: IssueId
  message: string
  categories: Category[]
}

// Rough power draw of everything besides the CPU and GPU (board, RAM, drives, fans).
export const BASE_SYSTEM_LOAD_W = 100

export function estimateLoadW({ cpu, gpu }: PartsByCategory): number {
  return (cpu?.tdpW ?? 0) + (gpu?.tdpW ?? 0) + BASE_SYSTEM_LOAD_W
}

// A rule only runs when both parts it compares are selected, so a half-finished build has no issues.
export function checkCompatibility(parts: PartsByCategory): CompatibilityIssue[] {
  const { cpu, motherboard, ram, gpu, psu, case: pcCase } = parts
  const issues: CompatibilityIssue[] = []

  if (cpu && motherboard && cpu.socket !== motherboard.socket) {
    issues.push({
      id: 'socket-mismatch',
      message: `CPU socket ${cpu.socket} does not fit the motherboard socket ${motherboard.socket}.`,
      categories: ['cpu', 'motherboard'],
    })
  }

  if (ram && motherboard && ram.type !== motherboard.memoryType) {
    issues.push({
      id: 'memory-mismatch',
      message: `${ram.type} memory is not supported by this motherboard (${motherboard.memoryType}).`,
      categories: ['ram', 'motherboard'],
    })
  }

  if (psu && (cpu || gpu)) {
    const load = estimateLoadW(parts)
    if (psu.wattage < load) {
      issues.push({
        id: 'psu-underpowered',
        message: `The ${psu.wattage}W power supply is below the estimated load of ${load}W.`,
        categories: ['psu'],
      })
    }
  }

  if (gpu && pcCase && gpu.lengthMm > pcCase.maxGpuLengthMm) {
    issues.push({
      id: 'gpu-too-long',
      message: `The graphics card is ${gpu.lengthMm}mm long, but the case fits up to ${pcCase.maxGpuLengthMm}mm.`,
      categories: ['gpu', 'case'],
    })
  }

  return issues
}