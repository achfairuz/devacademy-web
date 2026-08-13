import type { Level } from '@/models/levels'
import type { rawLevel } from '../contracts/levels'

export function toLevel(raw: rawLevel): Level {
  return {
    id: raw.ID,
    name: raw.Name,
    slug: raw.Slug,
    createdAt: raw.CreatedAt,
  }
}
