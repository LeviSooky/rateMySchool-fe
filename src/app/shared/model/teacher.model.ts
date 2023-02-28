import {School} from "./school.model";

export class Teacher {
  constructor(
    public id?: string,
    public name?: string,
    public isMale?: boolean,
    public school?: School,
  ) {}
}
