import {Moment} from "moment/moment";

export class TeacherReview {
  constructor(
    public id: string,
    public stars: number,
    public content: string,
    public creationDate?: Moment,
    public status?: string,
  ) {

  }
}

export interface ITeacherReview {
  stars: number,
  content: string,
  date: Moment
}
