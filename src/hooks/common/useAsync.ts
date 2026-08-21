import { ref } from 'vue'

export function useAsync<TArgs extends unknown[]>(fn: (...args: TArgs) => Promise<void>) {
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function run(...args: TArgs) {
    loading.value = true
    error.value = null
    try {
      await fn(...args)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Terjadi kesalahan.'
      throw err
    } finally {
      loading.value = false
    }
  }

  return { loading, error, run }
}
