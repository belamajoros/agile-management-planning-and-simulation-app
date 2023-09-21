export default interface Task {
    _id?: any | null,
    story_id?: string | null,
    points?: number,
    title: string,
    description?: string,
    done?: boolean,
    created_at?: Date,
    updated_at?: Date,
    position_in_story?: number,
    assigned_user: string
  }