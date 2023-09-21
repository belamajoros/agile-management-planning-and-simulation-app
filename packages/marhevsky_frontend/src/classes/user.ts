import IUser from "../interfaces/user";

export default class User implements IUser{
    email?: string;
    username?: string;
    password?: string;
    projects?: Array<string>;
    token?: string;

    constructor(email?: string, username?: string, password?: string, projects?: Array<string>) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.projects = projects;
    }

}
