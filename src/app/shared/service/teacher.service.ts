import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
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
        return convertTeacherArray(response.body);
      }));
  }

  findAll(pageReq: PageRequest): Observable<Teacher[]> {
    let params = getPaginationParams(pageReq);
    return this.http
      .get(`${this.resourceUrl}/search/`, { observe: 'response', params: params})
      .pipe(map((response: HttpResponse<any[]>) => {
        pageReq.totalPages = Number.parseInt(response.headers.get(PageRequest.TOTAL_PAGES_HEADER));
        pageReq.totalElements = Number.parseInt(response.headers.get(PageRequest.TOTAL_ELEMENTS_HEADER));
        return convertTeacherArray(response.body);
      }))
  }

  findBy(id: string): Observable<Teacher> {
    return this.http
      .get(`${this.resourceUrl}/${id}`, { observe: 'body'})
      .pipe(map((res: any) => convertTeacher(res)));
  }

  create(teacher: Teacher, schoolId: string): Observable<Teacher> {
    return this.http
      .post(`${this.resourceUrl}/add/${schoolId}`, teacher, { observe:"response" })
      .pipe(map((res: HttpResponse<any>) => convertTeacher(res.body)));
  }

  update(teacher: Teacher, schoolId: string): Observable<Teacher> {
    return this.http
      .put(this.resourceUrl, teacher, { params: new HttpParams().set('schoolId', schoolId)})
      .pipe(map((res: any) => convertTeacher(res)))
  }
}

export function convertTeacher(data: any): Teacher {
  return new Teacher(data.id, data.name, data.isMale, convertSchool(data.school), data.avgRating, data.status);
}

export function convertTeacherArray(data: any[]): Teacher[] {
  return data?.map(entry => convertTeacher(entry));
}
