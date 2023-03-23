
export class User {
  constructor(
    public id?: string,
    public email?: string,
    public isAdmin?: boolean,
    public lastName?: string,
    public firstName?: string,
    public password?: string,
  ) {
  }
}
