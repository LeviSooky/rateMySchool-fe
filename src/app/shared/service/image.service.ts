import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  readonly resourceUrl = 'api/image';

  constructor(private http: HttpClient) { }

  save(data: FormData): Observable<HttpResponse<any>> {
    return this.http
      .post(this.resourceUrl, data, { observe: 'response' })
  }

  findBy(schoolId: string): Observable<any> {
    return this.http
      .get(`${this.resourceUrl}/${schoolId}`, { observe: 'body'})
  }
}
