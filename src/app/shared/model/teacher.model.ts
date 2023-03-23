import {School} from "./school.model";
import {EntityStatus} from "../enums/entity.status";

export class Teacher {
  constructor(
    public id?: string,
    public name?: string,
    public isMale?: boolean,
    public school?: School,
    public avgRating?: number,
    public status?: EntityStatus
  ) {}
}
