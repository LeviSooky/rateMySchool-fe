import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, RouterOutlet} from "@angular/router";
import {Subscription} from "rxjs";
import {AuthService} from "../../service/auth.service";
import {Role, User} from "../../model/user.model";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit, OnDestroy {

  private authSub: Subscription;
  private user: User;

  constructor(private router: Router, private authService: AuthService) {
  }

  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }

  ngOnInit(): void {
    this.authSub = this.authService.authUser.subscribe(user => {
      this.user = user;
    })
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }

  isAdmin(): boolean {
    return this.user && this.user.roles.findIndex(role => role === Role.ADMIN) > -1;
  }

  isModerator(): boolean {
    return this.user && this.user.roles.findIndex(role => role === Role.MODERATOR) > -1;
  }

  isLoggedIn(): boolean {
    return !!this.user;
  }
}
