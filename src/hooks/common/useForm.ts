import { reactive, type UnwrapNestedRefs } from 'vue'

export function useForm<T extends Record<string, unknown>>(initial: T) {
  const form = reactive({ ...initial }) as UnwrapNestedRefs<T>

  function reset() {
    Object.assign(form, initial)
  }

  return { form, reset }
}
