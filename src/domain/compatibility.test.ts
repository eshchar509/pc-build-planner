import { describe, expect, it } from 'vitest'
import type { Cpu, Gpu, Motherboard, PcCase, Psu, Ram } from '../types/parts'
import { checkCompatibility, estimateLoadW } from './compatibility'

const cpu = (overrides: Partial<Cpu> = {}): Cpu => ({
  id: 'cpu', category: 'cpu', brand: 'AMD', name: 'Test CPU', price: 200,
  socket: 'AM5', cores: 6, tdpW: 65, gamingScore: 70, workScore: 70, ...overrides,
})
const motherboard = (overrides: Partial<Motherboard> = {}): Motherboard => ({
  id: 'mb', category: 'motherboard', brand: 'ASUS', name: 'Test board', price: 150,
  socket: 'AM5', memoryType: 'DDR5', ...overrides,
})
const ram = (overrides: Partial<Ram> = {}): Ram => ({
  id: 'ram', category: 'ram', brand: 'Corsair', name: 'Test RAM', price: 90,
  type: 'DDR5', capacityGB: 32, ...overrides,
})
const gpu = (overrides: Partial<Gpu> = {}): Gpu => ({
  id: 'gpu', category: 'gpu', brand: 'NVIDIA', name: 'Test GPU', price: 500,
  lengthMm: 300, tdpW: 200, vramGB: 12, gamingScore: 80, workScore: 60, ...overrides,
})
const psu = (overrides: Partial<Psu> = {}): Psu => ({
  id: 'psu', category: 'psu', brand: 'Corsair', name: 'Test PSU', price: 100,
  wattage: 750, ...overrides,
})
const pcCase = (overrides: Partial<PcCase> = {}): PcCase => ({
  id: 'case', category: 'case', brand: 'NZXT', name: 'Test case', price: 100,
  maxGpuLengthMm: 350, ...overrides,
})

describe('checkCompatibility', () => {
  it('reports nothing for an empty build', () => {
    expect(checkCompatibility({})).toEqual([])
  })

  it('does not run a rule when one of its parts is missing', () => {
    expect(checkCompatibility({ cpu: cpu() })).toEqual([])
    expect(checkCompatibility({ gpu: gpu({ lengthMm: 999 }) })).toEqual([])
  })

  it('flags a CPU / motherboard socket mismatch', () => {
    const issues = checkCompatibility({ cpu: cpu({ socket: 'AM4' }), motherboard: motherboard() })
    expect(issues.map((issue) => issue.id)).toEqual(['socket-mismatch'])
  })

  it('accepts matching sockets', () => {
    expect(checkCompatibility({ cpu: cpu(), motherboard: motherboard() })).toEqual([])
  })

  it('flags a RAM / motherboard memory type mismatch', () => {
    const issues = checkCompatibility({ ram: ram({ type: 'DDR4' }), motherboard: motherboard() })
    expect(issues.map((issue) => issue.id)).toEqual(['memory-mismatch'])
  })

  it('flags a power supply below the estimated load', () => {
    // 65 + 200 + 100 = 365W
    const issues = checkCompatibility({ cpu: cpu(), gpu: gpu(), psu: psu({ wattage: 350 }) })
    expect(issues.map((issue) => issue.id)).toEqual(['psu-underpowered'])
  })

  it('accepts a power supply exactly at the estimated load', () => {
    expect(checkCompatibility({ cpu: cpu(), gpu: gpu(), psu: psu({ wattage: 365 }) })).toEqual([])
  })

  it('flags a GPU that is longer than the case allows', () => {
    const issues = checkCompatibility({ gpu: gpu({ lengthMm: 360 }), case: pcCase() })
    expect(issues.map((issue) => issue.id)).toEqual(['gpu-too-long'])
  })

  it('accepts a GPU exactly as long as the case allows', () => {
    expect(checkCompatibility({ gpu: gpu({ lengthMm: 350 }), case: pcCase() })).toEqual([])
  })

  it('reports several issues at once', () => {
    const issues = checkCompatibility({
      cpu: cpu({ socket: 'AM4' }),
      motherboard: motherboard(),
      gpu: gpu({ lengthMm: 400 }),
      case: pcCase(),
    })
    expect(issues.map((issue) => issue.id)).toEqual(['socket-mismatch', 'gpu-too-long'])
  })
})

describe('estimateLoadW', () => {
  it('adds CPU and GPU power to the base system load', () => {
    expect(estimateLoadW({ cpu: cpu(), gpu: gpu() })).toBe(365)
  })

  it('falls back to the base load for an empty build', () => {
    expect(estimateLoadW({})).toBe(100)
  })
})