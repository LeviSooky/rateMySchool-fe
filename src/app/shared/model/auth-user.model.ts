import {Moment} from "moment";
import * as moment from "moment/moment";

export class AuthUser {

  roles: Role[];
  exp: Moment;
  token;
  constructor(decodedjwt, jwt) {
    this.exp = moment(decodedjwt.exp * 1000);
    this.roles = decodedjwt.role.map(x => x.authority);
    this.token = jwt;
  }
}

export enum Role {
  ADMIN = 'ADMIN',
  MODERATOR = 'ADMIN',
}

export function getUser(): AuthUser | null {
  let user = JSON.parse(localStorage.getItem('user')) as AuthUser;
  if (user === null) {
    return null;
  }
  if (moment().isAfter(user.exp)) {
    localStorage.removeItem('user');
    return null;
  }
  return user;
}
