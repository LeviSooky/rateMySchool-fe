import {Moment} from "moment";

export class SchoolReview {
  constructor(
    public id: string,
    public content: string,
    public stars: number,

    public creationDate: Moment,
    public status: string,
  ) {
  }
}
