export type Category =
  | 'cpu'
  | 'motherboard'
  | 'ram'
  | 'gpu'
  | 'storage'
  | 'psu'
  | 'case'

export type MemoryType = 'DDR4' | 'DDR5'

export interface BasePart {
  id: string
  category: Category
  brand: string
  name: string
  price: number // USD
}

export interface Cpu extends BasePart {
  category: 'cpu'
  socket: string // 'AM5', 'LGA1700'
  cores: number
  tdpW: number
  gamingScore: number // 0-100
  workScore: number // 0-100
}

export interface Motherboard extends BasePart {
  category: 'motherboard'
  socket: string
  memoryType: MemoryType
}

export interface Ram extends BasePart {
  category: 'ram'
  type: MemoryType
  capacityGB: number // total kit
}

export interface Gpu extends BasePart {
  category: 'gpu'
  lengthMm: number
  tdpW: number
  vramGB: number
  gamingScore: number
  workScore: number
}

export interface StorageDrive extends BasePart {
  category: 'storage'
  kind: 'NVMe' | 'SATA SSD' | 'HDD'
  capacityGB: number
}

export interface Psu extends BasePart {
  category: 'psu'
  wattage: number
}

export interface PcCase extends BasePart {
  category: 'case'
  maxGpuLengthMm: number
}

export type Part = Cpu | Motherboard | Ram | Gpu | StorageDrive | Psu | PcCase