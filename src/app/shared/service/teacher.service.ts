import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {PageRequest} from "../model/page-request";
import {convertSchool, getPaginationParams} from "./school.service";
import {map, Observable} from "rxjs";
import {Teacher} from "../model/teacher.model";

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  readonly resourceUrl = 'api/teachers';

  constructor(private http: HttpClient) { }

  findAllBy(keyword: string, pageReq: PageRequest): Observable<Teacher[]> {
    let params = getPaginationParams(pageReq);
    return this.http
      .get(`${this.resourceUrl}/search/${keyword}`, { observe: 'response', params: params})
      .pipe(map((response: HttpResponse<any[]>) => {
        pageReq.totalPages = Number.parseInt(response.headers.get(PageRequest.TOTAL_PAGES_HEADER));
        pageReq.totalElements = Number.parseInt(response.headers.get(PageRequest.TOTAL_ELEMENTS_HEADER));
        return convertArray(response.body);
      }));
  }

  findAll(pageReq: PageRequest): Observable<Teacher[]> {
    let params = getPaginationParams(pageReq);
    return this.http
      .get(`${this.resourceUrl}/search/`, { observe: 'response', params: params})
      .pipe(map((response: HttpResponse<any[]>) => {
        pageReq.totalPages = Number.parseInt(response.headers.get(PageRequest.TOTAL_PAGES_HEADER));
        pageReq.totalElements = Number.parseInt(response.headers.get(PageRequest.TOTAL_ELEMENTS_HEADER));
        return convertArray(response.body);
      }))
  }

  findBy(id: string): Observable<Teacher> {
    return this.http
      .get(`${this.resourceUrl}/${id}`, { observe: 'body'})
      .pipe(map((res: any) => convert(res)));
  }
}

export function convert(data: any): Teacher {
  return new Teacher(data.id, data.name, data.isMale, convertSchool(data.school));
}

export function convertArray(data: any[]): Teacher[] {
  return data?.map(entry => convert(entry));
}
