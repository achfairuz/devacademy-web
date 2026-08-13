import { onMounted, ref } from 'vue'

import { levelApi } from '@/api/modules/levels'
import type { Level } from '@/models/levels'

const levels = ref<Level[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
let loaded = false

export function useLevel() {
  async function load() {
    if (loaded) return
    loaded = true
    loading.value = true
    error.value = null
    try {
      levels.value = await levelApi.getLevels()
    } catch (err) {
      console.error('[levels] Gagal memuat level.', err)
      error.value = 'Gagal memuat level.'
    } finally {
      loading.value = false
    }
  }

  onMounted(load)

  return { levels, loading, error, reload: load }
}
