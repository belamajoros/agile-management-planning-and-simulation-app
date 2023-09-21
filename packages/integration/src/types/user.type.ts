export default interface IUser {
    _id?: any | null,
    name?: string | null,
    email?: string,
    password?: string,
    roles?: Array<string>,
    position?: string,
    avatar: string,
  }