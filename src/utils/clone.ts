import { toRaw } from 'vue'

export function cloneDeep<T>(value: T): T {
  return structuredClone(toRaw(value))
}
