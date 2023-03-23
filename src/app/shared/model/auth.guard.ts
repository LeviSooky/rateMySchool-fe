import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {map, Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {AuthService} from "../service/auth.service";
import {Role} from "./auth-user.model";

@Injectable({providedIn: "root"})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.authUser
      .pipe(
        map(user => {
          let authorized = user && user.roles.findIndex(role => role === Role.ADMIN) !== -1;
          if (authorized) {
            return true;
          }
          this.router.navigate(['/login']);
          return false;
        }));
  }

}
