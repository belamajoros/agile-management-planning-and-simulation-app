export default interface Story {
    _id?: any | null,
    user_id?: any | null,
    sprint_title?: any | null,
    sprint_id?: any | null,
    project_id?: any | null,
    title: string,
    description: string,
    progress: number,
    created_at?: Date,
    updated_at?: Date| null,
    changed?: Date| null
  }
