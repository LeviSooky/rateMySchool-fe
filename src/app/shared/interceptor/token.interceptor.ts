import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {exhaustMap, Observable, take} from 'rxjs';
import {AuthService} from "../service/auth.service";
import * as moment from "moment";
import {ToastService} from "../service/toast.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private toastService: ToastService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!request.url.includes('moderator') && !request.url.includes('admin')) {
     return next.handle(request);
    }
    return this.authService.authUser
      .pipe(
        take(1),
        exhaustMap(user => {
          if (!user) {
            return next.handle(request);
          }
          if (moment().isAfter(user.exp)) {
            console.log(user)
            this.authService.logout();
            this.toastService.showInfoToast("A bejelentkezés lejárt, kérjük jelentkezzen be újra!");
            return next.handle(request);
          }
          const modifiedReq = request.clone({
            headers: request.headers.set('Authorization', `Bearer ${user.token}`)
          });
          return next.handle(modifiedReq);
        }))
  }
}
