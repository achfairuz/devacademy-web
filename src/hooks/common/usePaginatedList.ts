import { ref, type Ref } from 'vue'

import type { Paginated, PaginationMeta } from '@/models/api'

export interface UsePaginatedListOptions {
  pageSize?: number
  errorMessage?: string
}

export function usePaginatedList<T>(
  fetcher: (page: number, pageSize: number) => Promise<Paginated<T>>,
  options: UsePaginatedListOptions = {},
) {
  const pageSize = options.pageSize ?? 10
  const errorMessage = options.errorMessage ?? 'Gagal memuat data.'

  const items = ref([]) as Ref<T[]>
  const meta = ref<PaginationMeta>({ page: 1, page_size: pageSize, total: 0, total_pages: 1 })
  const currentPage = ref(1)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function load(page = currentPage.value) {
    loading.value = true
    error.value = null
    try {
      const result = await fetcher(page, pageSize)
      items.value = result.items
      meta.value = result.meta
      currentPage.value = result.meta.page
    } catch (err) {
      console.error('[pagination] Gagal memuat data.', err)
      error.value = errorMessage
    } finally {
      loading.value = false
    }
  }

  function goToPage(page: number) {
    if (page < 1 || page > Math.max(1, meta.value.total_pages) || page === currentPage.value) return
    return load(page)
  }

  function nextPage() {
    return goToPage(currentPage.value + 1)
  }

  function prevPage() {
    return goToPage(currentPage.value - 1)
  }

  return { items, meta, currentPage, pageSize, loading, error, load, goToPage, nextPage, prevPage }
}
