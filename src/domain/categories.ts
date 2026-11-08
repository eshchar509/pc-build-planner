import type { Category } from '../types/parts'

export const CATEGORY_ORDER: Category[] = ['cpu', 'motherboard', 'ram', 'gpu', 'storage', 'psu', 'case']

export const CATEGORY_LABELS: Record<Category, string> = {
  cpu: 'CPU',
  motherboard: 'Motherboard',
  ram: 'Memory (RAM)',
  gpu: 'Graphics card',
  storage: 'Storage',
  psu: 'Power supply',
  case: 'Case',
}