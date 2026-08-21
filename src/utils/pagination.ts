export type PageItem = number | 'ellipsis'

export function buildPageItems(currentPage: number, totalPages: number): PageItem[] {
  const total = Math.max(1, totalPages)
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)

  const pages = new Set<number>([1, total, currentPage])
  for (let offset = -1; offset <= 1; offset++) {
    const page = currentPage + offset
    if (page >= 1 && page <= total) pages.add(page)
  }

  const sorted = [...pages].sort((a, b) => a - b)
  const items: PageItem[] = []
  sorted.forEach((page, index) => {
    if (index > 0 && page - (sorted[index - 1] ?? 0) > 1) items.push('ellipsis')
    items.push(page)
  })
  return items
}
