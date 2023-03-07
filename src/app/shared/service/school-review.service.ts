import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {PageRequest} from "../model/page-request";
import {map, Observable} from "rxjs";
import {SchoolReview} from "../model/school-review.model";
import {getPaginationParams} from "./school.service";
import * as moment from "moment/moment";

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
        return this.convertArray(res.body);
      }));
  }

  save(schoolId: string, review: string) {

    let params = new HttpParams().set('schoolId', schoolId).set('review', review);
    return this.http
      .get(this.baseUrl, { observe: 'body', params: params})


  }

  convert(data: any): SchoolReview {
    return new SchoolReview(data.id, data.content, data.stars, moment(data.creationDate), data.status);
  }
  convertArray(data: any[]): SchoolReview[] {
    return data?.map(entry => this.convert(entry));
  }
}
