import {EntityStatus} from "../enums/entity.status";
import {City} from "./city.model";

export class School {
  constructor(
    public id?: string,
    public name?: string,
    public websiteUrl?: string,
    public avgRating?: number,
    public address?: string,
    public status?: EntityStatus,
    public city?: City
  ) {
  }
}
