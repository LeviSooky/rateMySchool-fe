import {EntityStatus} from "../enums/entity.status";


export class AddReviewResponse {

  constructor(
    public id: string,
    public stars: number,
    public status: EntityStatus,
  ) {
  }
}
