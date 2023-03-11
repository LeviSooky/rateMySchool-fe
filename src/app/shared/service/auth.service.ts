import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, EMPTY, Observable, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {User} from "../model/user.model";
import jwtDecode from "jwt-decode";
import {Router} from "@angular/router";
import {ToastService} from "./toast.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authUser = new BehaviorSubject<User>(null);
  jwt: string = '';
  decodedToken = {};
  constructor(private http: HttpClient,
              private router: Router,
              private toastService: ToastService) {}

  login(credentials: {}): Observable<Object> {
    return this.http
      .post('api/login', credentials, { observe: 'response'})
      .pipe(tap(response => {
        let bearer = response.headers.get('Authorization');
        if (bearer !== null) {
          let user = new User(jwtDecode(bearer), bearer);
          this.authUser.next(user);
        }
      }), catchError(() => EMPTY))
  }

  logout() {
    this.authUser.next(null);
    this.router.navigate(['/login']);
    this.toastService.showInfoToast("A bejelentkezés lejárt, kérjük jelentkezzen be újra!");
  }
}
