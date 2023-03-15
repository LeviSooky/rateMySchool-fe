import {Moment} from "moment";
import * as moment from "moment/moment";

export class User {

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
  ADMIN,
  MODERATOR,
}
