import type { Course } from '@/models/course'

const STORAGE_KEY = 'devacademy.course_drafts'
const PENDING_ID = 'pending'

interface StoredDraft {
  id: string
  updatedAt: string
  course: Course
}

function readAll(): StoredDraft[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as StoredDraft[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(drafts: StoredDraft[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts))
}

function draftIdOf(course: Course): string {
  return course.id || PENDING_ID
}

export const courseDraftService = {
  save(course: Course) {
    const id = draftIdOf(course)
    const drafts = readAll().filter((draft) => draft.id !== id)
    drafts.unshift({ id, updatedAt: new Date().toISOString(), course })
    writeAll(drafts)
  },

  load(id: string): Course | null {
    return readAll().find((draft) => draft.id === id)?.course ?? null
  },

  loadPending(): Course | null {
    return this.load(PENDING_ID)
  },

  remove(id: string) {
    writeAll(readAll().filter((draft) => draft.id !== id))
  },

  list(): StoredDraft[] {
    return readAll()
  },
}
