import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {PageRequest} from "../model/page-request";
import {School} from "../model/school.model";


@Injectable({
  providedIn: 'root'
})
export class SchoolService {

  readonly resourceUrl = 'api/school'

  constructor(private http: HttpClient) { }

  findAllBy(keyword: string, page: PageRequest): Observable<School[]> { //TODO refactor
    let httpParams = GetPaginationParams(page);
    return this.http
      .get<any[]>(`${this.resourceUrl}/search/${keyword}`, { observe: "body", params: httpParams})
      .pipe(map((res:any[]) => this.convertArray(res)));
  }

  findAll(page: PageRequest): Observable<School[]> {
    let httpParams = GetPaginationParams(page);
    return this.http
      .get<any[]>(`${this.resourceUrl}/search`, { observe: "response", params: httpParams})
      .pipe(map((res:HttpResponse<any[]>) => {
        // @ts-ignore
        page.totalPages = res.headers.get(PageRequest.TOTAL_PAGES_HEADER);
        // @ts-ignore
        page.totalElements = res.headers.get(PageRequest.TOTAL_ELEMENTS_HEADER);
        // @ts-ignore
        return this.convertArray(res.body);
      }));
  }

  create(school: School): Observable<School> {
    return this.http
      .post(this.resourceUrl, school, { observe: 'body'})
      .pipe(map((res: any) => this.convert(res)));
  }

  findBy(id: string): Observable<School> {
    return this.http
      .get(`${this.resourceUrl}/${id}`, { observe: 'body'})
      .pipe(map((res: any) => this.convert(res)));
  }

  update(school: School): Observable<School> {
    return this.http
      .put(this.resourceUrl, school, { observe: 'body'})
      .pipe(map((res: any) => this.convert(res)));
  }

  convert(data: any): School {
    return new School(data.id, data.name, data.websiteUrl);
  }
  convertArray(data: any[]): School[] {
    return data?.map(entry => this.convert(entry));
  }
}

export function GetPaginationParams(pageRequest: PageRequest): HttpParams {
  let httpParams = new HttpParams();
  httpParams = httpParams.append('page', pageRequest.page);
  httpParams = httpParams.append('size', pageRequest.size);
  pageRequest.sort.forEach(sort => {
    httpParams = httpParams.append('sort', `${sort.field},${sort.direction}`);
  });
  return httpParams;
}
