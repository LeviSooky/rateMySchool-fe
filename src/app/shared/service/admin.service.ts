import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {User} from "../model/user.model";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  readonly baseUrl = 'admin';

  constructor(private http: HttpClient) { }

  create(user: User): Observable<{}> {
    return this.http
      .post(`${this.baseUrl}/user`, user)
  }

  delete(userId: string): Observable<{}> {
    return this.http
      .delete(`${this.baseUrl}/user/${userId}`)
  }

  update(user: User): Observable<{}> {
    return this.http
      .put(this.baseUrl + '/user', user)
  }

  findUsers(keyword?: string): Observable<User[]> {
    let httpParams = new HttpParams();
    if (keyword) {
      httpParams = httpParams.set('keyword', keyword);
    }
    return this.http
      .get(`${this.baseUrl}/user`, { observe: "body", params: httpParams})
      .pipe(map((res: any) => this.convertArray(res)))
  }

  private convertArray(data: any[]): User[] {
    return data.map(user => this.convert(user));
  }

  private convert(data): User {
    return new User(data.id, data.email, data.admin, data.lastName, data.firstName);
  }
}
