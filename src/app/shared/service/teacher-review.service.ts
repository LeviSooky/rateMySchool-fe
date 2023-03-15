import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {PageRequest} from "../model/page-request";
import {getPaginationParams} from "./school.service";
import * as moment from "moment";
import {TeacherReview} from "../model/teacher-review";
import {convertReviewResponse} from "./school-review.service";

@Injectable({
  providedIn: 'root'
})
export class TeacherReviewService {
  readonly baseUrl = 'api/review/teacher';

  constructor(private http: HttpClient) { }

  findAllActiveBy(teacherId: string, pageReq: PageRequest): Observable<TeacherReview[]> {
    let params = getPaginationParams(pageReq);
    return this.http
      .get(`${this.baseUrl}/${teacherId}`, { observe: 'response', params: params})
      .pipe(map((res: HttpResponse<any[]>) => {
        pageReq.totalPages = Number.parseInt(res.headers.get(PageRequest.TOTAL_PAGES_HEADER));
        pageReq.totalElements = Number.parseInt(res.headers.get(PageRequest.TOTAL_ELEMENTS_HEADER));
        return convertTeacherReviewArray(res.body);
      }));
  }

  save(teacherId: string, review: string) {
    let params = new HttpParams().set('teacherId', teacherId).set('review', review);
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

export function convertTeacherReview(data: any): TeacherReview {
  return new TeacherReview(data.id, data.stars, data.content, moment(data.creationDate), data.status);
}

export function convertTeacherReviewArray(data: any[]): TeacherReview[] {
  return data?.map(entry => convertTeacherReview(entry));
}
