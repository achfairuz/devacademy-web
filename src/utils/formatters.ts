export function formatInitials(name?: string | null): string {
  return (name ?? '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function formatDate(date?: Date | string | null, locale = 'id-ID'): string {
  if (!date) return ''
  const value = new Date(date)
  if (Number.isNaN(value.getTime())) return ''
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(value)
}

export function formatRupiah(value?: number | null): string {
  if (value == null || Number.isNaN(value)) return ''
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
    value,
  )
}

export function formatMinutes(totalMinutes?: number | null): string {
  const minutes = Math.max(0, Math.round(totalMinutes ?? 0))
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours > 0 && rest > 0) return `${hours} jam ${rest} menit`
  if (hours > 0) return `${hours} jam`
  return `${minutes} menit`
}

export function formatFileSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return ''
  const units = ['B', 'KB', 'MB', 'GB']
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** index
  return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`
}
