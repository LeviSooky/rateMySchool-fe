import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {City} from "../model/city.model";

@Injectable({
  providedIn: 'root'
})
export class CityService {

  readonly baseUrl = 'api/city';
  constructor(private http: HttpClient) { }

  findAllBy(keyword: string): Observable<City[]> {
    return this.http
      .get(`${this.baseUrl}/${keyword}`, { observe: 'body'})
      .pipe(map((res: any[]) => this.convertArray(res)))
  }

  private convertArray(res: any[]): City[] {
    return res.map(city => new City(city.id, city.name));
  }
}
