
export default interface IUser{
    _id?: string
    username?: string;
    email?: string;
    password?: string;
    projects?: Array<string>;
    token?: string;
}