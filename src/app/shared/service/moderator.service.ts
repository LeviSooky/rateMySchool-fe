import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ModeratorService {

  private baseUrl = '/moderator'
  constructor(private http: HttpClient) {}

  getPendingReviews() {
    return this.http.get(`${this.baseUrl}/reviews/pending`)
  }
}
