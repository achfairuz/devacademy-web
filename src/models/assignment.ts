export interface Assignment {
  id?: string
  title: string
  description: string
  due_date: string
}

export interface AssignmentPayload {
  lesson_id?: string
  title: string
  description: string
  due_date: string
}

export interface CourseAssignment {
  id: string
  title: string
  description: string
  due_date: string
}

export function createEmptyAssignment(): Assignment {
  return {
    title: '',
    description: '',
    due_date: '',
  }
}
