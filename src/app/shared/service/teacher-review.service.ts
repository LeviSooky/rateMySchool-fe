import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {PageRequest} from "../model/page-request";
import {getPaginationParams} from "./school.service";
import * as moment from "moment";
import {TeacherReview} from "../model/teacher-review";

@Injectable({
  providedIn: 'root'
})
export class TeacherReviewService {
  readonly baseUrl = 'api/review/school';

  constructor(private http: HttpClient) { }

  findAllActiveBy(teacherId: string, pageReq: PageRequest): Observable<TeacherReview[]> {
    let params = getPaginationParams(pageReq);
    return this.http
      .get(`${this.baseUrl}/${teacherId}`, { observe: 'response', params: params})
      .pipe(map((res: HttpResponse<any[]>) => {
        pageReq.totalPages = Number.parseInt(res.headers.get(PageRequest.TOTAL_PAGES_HEADER));
        pageReq.totalElements = Number.parseInt(res.headers.get(PageRequest.TOTAL_ELEMENTS_HEADER));
        return this.convertArray(res.body);
      }));
  }

  convert(data: any): TeacherReview {
    return new TeacherReview(data.id, data.stars, data.content, moment(data.creationDate), data.status);
  }
  convertArray(data: any[]): TeacherReview[] {
    return data?.map(entry => this.convert(entry));
  }
}
