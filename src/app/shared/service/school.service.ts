import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {PageRequest} from "../model/page-request";
import {School} from "../model/school.model";
import {City} from "../model/city.model";


@Injectable({
  providedIn: 'root'
})
export class SchoolService {

  readonly resourceUrl = 'api/school'

  constructor(private http: HttpClient) { }

  findAllBy(keyword: string, page: PageRequest): Observable<School[]> { //TODO refactor
    let httpParams = getPaginationParams(page);
    return this.http
      .get<any[]>(`${this.resourceUrl}/search/${keyword}`, { observe: "response", params: httpParams})
      .pipe(map((res:HttpResponse<any[]>) => {
        // @ts-ignore
        page.totalPages = Number.parseInt(res.headers.get(PageRequest.TOTAL_PAGES_HEADER));
        // @ts-ignore
        page.totalElements = Number.parseInt(res.headers.get(PageRequest.TOTAL_ELEMENTS_HEADER));
        // @ts-ignore
        return convertArray(res.body);
      }));
  }

  findAll(page: PageRequest): Observable<School[]> {
    let httpParams = getPaginationParams(page);
    return this.http
      .get<any[]>(`${this.resourceUrl}/search`, { observe: "response", params: httpParams})
      .pipe(map((res:HttpResponse<any[]>) => {
        page.totalPages = Number.parseInt(res.headers.get(PageRequest.TOTAL_PAGES_HEADER));
        page.totalElements = Number.parseInt(res.headers.get(PageRequest.TOTAL_ELEMENTS_HEADER));
        return convertArray(res.body);
      }));
  }

  create(school: School): Observable<School> {
    return this.http
      .post(this.resourceUrl, school, { observe: 'body'})
      .pipe(map((res: any) => convertSchool(res)));
  }

  findBy(id: string): Observable<School> {
    return this.http
      .get(`${this.resourceUrl}/${id}`, { observe: 'body'})
      .pipe(map((res: any) => convertSchool(res)));
  }

  update(school: School): Observable<School> {
    return this.http
      .put(this.resourceUrl, school, { observe: 'body'})
      .pipe(map((res: any) => convertSchool(res)));
  }
}

export function convertArray(data: any[]): School[] {
  return data?.map(entry => convertSchool(entry));
}

export function getPaginationParams(pageRequest: PageRequest): HttpParams {
  let httpParams = new HttpParams();
  httpParams = httpParams.append('page', pageRequest.page);
  httpParams = httpParams.append('size', pageRequest.size);
  pageRequest.sort.forEach(sort => {
    httpParams = httpParams.append('sort', `${sort.field},${sort.direction}`);
  });
  return httpParams;
}

export function convertSchool(data: any): School {
  return new School(data.id, data.name, data.websiteUrl,
    data.avgRating, data.address, data.status, data.city ? new City(data.city.id, data.city.name) : null);
}
