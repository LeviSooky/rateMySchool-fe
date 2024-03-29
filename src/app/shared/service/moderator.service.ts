import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {PageRequest} from "../model/page-request";
import {convertArray, convertSchool, getPaginationParams} from "./school.service";
import {convertTeacherReviewArray} from "./teacher-review.service";
import {School} from "../model/school.model";
import {Teacher} from "../model/teacher.model";
import {TeacherReview} from "../model/teacher-review";
import {convertTeacher, convertTeacherArray} from "./teacher.service";
import {convertSchoolReviewArray} from "./school-review.service";
import {SchoolReview} from "../model/school-review.model";

@Injectable({
  providedIn: 'root'
})
export class ModeratorService {

  private baseUrl = 'moderator'
  constructor(private http: HttpClient) {}

  getPendingReviews() {
    return this.http.get(`${this.baseUrl}/reviews/pending`)
  }

  moderateTeacherReview(reviewId: string, shouldActivate: boolean) {
    let params = new HttpParams().append('shouldActivate', shouldActivate);
    return this.http
      .patch(`${this.baseUrl}/teachers/reviews/moderate/${reviewId}`, null, { params: params})
  }

  moderateSchoolReview(reviewId: string, shouldActivate: boolean) {
    let params = new HttpParams().append('shouldActivate', shouldActivate);
    return this.http
      .patch(`${this.baseUrl}/schools/reviews/moderate/${reviewId}`, null, { params: params})
  }

  moderateSchool(id: string, shouldActivate: boolean) {
    let params = new HttpParams().append("shouldActivate", shouldActivate);
    return this.http
      .patch(`${this.baseUrl}/schools/moderate/${id}`, null, {params: params})
  }

  moderateTeacher(id: string, shouldActivate: boolean) {
    let params = new HttpParams().append("shouldActivate", shouldActivate);
    return this.http
      .patch(`${this.baseUrl}/teachers/moderate/${id}`, null, {params: params})
  }

  findSchools(pagReq: PageRequest): Observable<School[]> {
    let httpParams = getPaginationParams(pagReq);
    return this.http
      .get<any[]>(`${this.baseUrl}/schools/search`, { observe: "response", params: httpParams})
      .pipe(map((res:HttpResponse<any[]>) => {
        pagReq.totalPages = Number.parseInt(res.headers.get(PageRequest.TOTAL_PAGES_HEADER));
        pagReq.totalElements = Number.parseInt(res.headers.get(PageRequest.TOTAL_ELEMENTS_HEADER));
        return convertArray(res.body);
      }));
  }

  findSchoolsBy(keyword: string, pagReq: PageRequest): Observable<School[]> {
    let httpParams = getPaginationParams(pagReq);
    return this.http
      .get<any[]>(`${this.baseUrl}/schools/search/${keyword}`, { observe: "response", params: httpParams})
      .pipe(map((res:HttpResponse<any[]>) => {
        pagReq.totalPages = Number.parseInt(res.headers.get(PageRequest.TOTAL_PAGES_HEADER));
        pagReq.totalElements = Number.parseInt(res.headers.get(PageRequest.TOTAL_ELEMENTS_HEADER));
        return convertArray(res.body);
      }));
  }

  findTeachers(pageReq: PageRequest): Observable<Teacher[]> {
    let params = getPaginationParams(pageReq);
    return this.http
      .get(`${this.baseUrl}/teachers/search`, { observe: 'response', params: params})
      .pipe(map((response: HttpResponse<any[]>) => {
        pageReq.totalPages = Number.parseInt(response.headers.get(PageRequest.TOTAL_PAGES_HEADER));
        pageReq.totalElements = Number.parseInt(response.headers.get(PageRequest.TOTAL_ELEMENTS_HEADER));
        return convertTeacherArray(response.body);
      }))
  }

  findTeachersBy(keyword: string, pageReq: PageRequest): Observable<Teacher[]> {
    let params = getPaginationParams(pageReq);
    return this.http
      .get(`${this.baseUrl}/teachers/search/${keyword}`, { observe: 'response', params: params})
      .pipe(map((response: HttpResponse<any[]>) => {
        pageReq.totalPages = Number.parseInt(response.headers.get(PageRequest.TOTAL_PAGES_HEADER));
        pageReq.totalElements = Number.parseInt(response.headers.get(PageRequest.TOTAL_ELEMENTS_HEADER));
        return convertTeacherArray(response.body);
      }))
  }

  findTeacherReviewsBy(teacherId: string, pageReq: PageRequest): Observable<TeacherReview[]> {
    let params = getPaginationParams(pageReq);
    return this.http
      .get(`${this.baseUrl}/teachers/reviews/${teacherId}`, { observe: 'response', params: params})
      .pipe(map((response: HttpResponse<any[]>) => {
        pageReq.totalPages = Number.parseInt(response.headers.get(PageRequest.TOTAL_PAGES_HEADER));
        pageReq.totalElements = Number.parseInt(response.headers.get(PageRequest.TOTAL_ELEMENTS_HEADER));
        return convertTeacherReviewArray(response.body);
      }))
  }

  findSchoolReviewsBy(schoolId: string, pageReq: PageRequest): Observable<SchoolReview[]> {
    let params = getPaginationParams(pageReq);
    return this.http
      .get(`${this.baseUrl}/schools/reviews/${schoolId}`, { observe: 'response', params: params})
      .pipe(map((response: HttpResponse<any[]>) => {
        pageReq.totalPages = Number.parseInt(response.headers.get(PageRequest.TOTAL_PAGES_HEADER));
        pageReq.totalElements = Number.parseInt(response.headers.get(PageRequest.TOTAL_ELEMENTS_HEADER));
        return convertSchoolReviewArray(response.body);
      }))
  }

  editTeacher(teacher: Teacher, schoolId: string): Observable<Teacher> {
    return this.http
      .put(`${this.baseUrl}/teachers/edit/${schoolId}`, teacher, { observe: 'body'} )
      .pipe(map((res: any) => convertTeacher(res)));
  }

  update(schoolToUpdate: School): Observable<School> {
    return this.http
      .put(`${this.baseUrl}/schools`, schoolToUpdate, { observe: 'body'})
      .pipe(map((res: any) => convertSchool(res)))
  }
}
