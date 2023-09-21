export default interface Project {
    _id?: any | null,
    slug?: string | null,
    user_id?: any | null,
    title: string,
    members: string[],
    description: string,
    created_at?: Date,
    updated_at?: Date| null
  }