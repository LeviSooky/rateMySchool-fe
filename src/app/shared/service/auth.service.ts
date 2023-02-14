import {Injectable} from '@angular/core';
import {catchError, EMPTY, Observable, Subject, tap} from "rxjs";
// import jwt_decode from "jwt-decode";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authUser = new Subject<string>();
  jwt: string = '';
  decodedToken = {};
  constructor(private http: HttpClient) {}

  login(credentials: {}): Observable<Object> {
    return this.http
      .post('api/login', credentials, { observe: 'response'})
      .pipe(tap(response => {
        let bearer = response.headers.get('Bearer ');
        if (bearer !== null) {
          this.jwt = bearer;
          // this.decodedToken = jwt_decode(this.jwt);
        }
      }), catchError(() => EMPTY))
  }

  getJWT(): string {
    return this.jwt;
  }

  getDecodedToken(): {} {
    return this.decodedToken;
  }
}
