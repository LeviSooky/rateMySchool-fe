import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, EMPTY, Observable, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AuthUser, getUser} from "../model/auth-user.model";
import jwtDecode from "jwt-decode";
import {Router} from "@angular/router";
import {ToastService} from "./toast.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authUser = new BehaviorSubject<AuthUser>(getUser());
  jwt: string = '';
  decodedToken = {};
  constructor(private http: HttpClient,
              private toastService: ToastService,
              private router: Router) {}

  login(credentials: {}): Observable<Object> {
    return this.http
      .post('api/login', credentials, { observe: 'response'})
      .pipe(tap(response => {
        let bearer = response.headers.get('Authorization');
        if (bearer !== null) {
          let user = new AuthUser(jwtDecode(bearer), bearer);
          this.authUser.next(user);
          localStorage.setItem('user', JSON.stringify(user));
        }
      }), catchError(() => {
        this.toastService.showError('Sikertelen bejelentkezés, próbálkozz újra!')
        return EMPTY;
      }))
  }

  logout() {
    this.authUser.next(null);
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
