import type { Part } from '../types/parts'

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export const formatPrice = (price: number) => priceFormatter.format(price)

// One-line spec summary. The switch is exhaustive: adding a new category to `Part`
// without handling it here becomes a compile error.
export function describePart(part: Part): string {
  switch (part.category) {
    case 'cpu':
      return `${part.socket} · ${part.cores} cores · ${part.tdpW}W`
    case 'motherboard':
      return `${part.socket} · ${part.memoryType}`
    case 'ram':
      return `${part.type} · ${part.capacityGB}GB`
    case 'gpu':
      return `${part.vramGB}GB VRAM · ${part.lengthMm}mm · ${part.tdpW}W`
    case 'storage':
      return `${part.kind} · ${part.capacityGB}GB`
    case 'psu':
      return `${part.wattage}W`
    case 'case':
      return `Max GPU length ${part.maxGpuLengthMm}mm`
  }
}