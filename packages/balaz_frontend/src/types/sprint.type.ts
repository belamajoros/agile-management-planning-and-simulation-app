export default interface Sprint {
    _id?: any | null,
    user_id?: string | null,
    project_id?: any | null,
    title?: string,
    status?: string | null,
    startDate?: any | null,
    endDate?: any | null,
    created_at?: any | null,
    updated_at?: any| null,
    changed?: Date| null
  }
