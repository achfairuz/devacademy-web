import { ref } from 'vue'

export interface DragState {
  type: 'section' | 'lesson'
  sectionId?: string
  fromIndex: number
}

export const dragState = ref<DragState | null>(null)

export function isTempId(id?: string): boolean {
  return Boolean(id && id.startsWith('temp-'))
}
