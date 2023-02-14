import {Moment} from "moment/moment";

export class TeacherReview {
  constructor(
    public stars: number,
    public content: string,
    public date?: Moment
  ) {

  }
}

export interface ITeacherReview {
  stars: number,
  content: string,
  date: Moment
}
