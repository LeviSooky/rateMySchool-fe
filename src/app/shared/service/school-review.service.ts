import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {PageRequest} from "../model/page-request";
import {map, Observable} from "rxjs";
import {SchoolReview} from "../model/school-review.model";
import {getPaginationParams} from "./school.service";
import * as moment from "moment/moment";
import {AddReviewResponse} from "../model/add-review-response.model";

@Injectable({
  providedIn: 'root'
})
export class SchoolReviewService {
  readonly baseUrl = 'api/review/school';

  constructor(private http: HttpClient) { }

  findAllActiveBy(schoolId: string, pageReq: PageRequest): Observable<SchoolReview[]> {
    let params = getPaginationParams(pageReq);
    return this.http
      .get(`${this.baseUrl}/${schoolId}`, { observe: "response", params: params})
      .pipe(map((res: any) => {
        pageReq.totalPages = Number.parseInt(res.headers.get(PageRequest.TOTAL_PAGES_HEADER));
        // @ts-ignore
        pageReq.totalElements = Number.parseInt(res.headers.get(PageRequest.TOTAL_ELEMENTS_HEADER));
        return convertSchoolReviewArray(res.body);
      }));
  }

  save(schoolId: string, review: string): Observable<AddReviewResponse> {

    let params = new HttpParams().set('schoolId', schoolId).set('review', review);
    return this.http
      .get(this.baseUrl, { observe: 'body', params: params})
      .pipe(map((res: any) => convertReviewResponse(res)));
  }

  modifyStars(reviewId: string, stars: number) {
    let params = new HttpParams().append('stars', stars);
    return this.http
      .get(`${this.baseUrl}/modify/stars/${reviewId}`, { params: params})
  }

}

export function convertSchoolReview(data: any): SchoolReview {
  return new SchoolReview(data.id, data.content, data.stars, moment(data.creationDate), data.status);
}

export function convertSchoolReviewArray(data: any[]): SchoolReview[] {
  return data?.map(entry => convertSchoolReview(entry));
}

export function convertReviewResponse(res: any): AddReviewResponse {
  return new AddReviewResponse(res.id, res.stars, res.status);
}
