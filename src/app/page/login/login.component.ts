import { Component } from '@angular/core';
import {AuthService} from "../../shared/service/auth.service";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {take} from "rxjs";
import {ToastService} from "../../shared/service/toast.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)])
  })

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
  ) {
  }

  get email(): AbstractControl {
    return this.form.get('email');
  }
  get password(): AbstractControl {
    return this.form.get('password');
  }

  onLogin() {
    if (this.form.valid) {
      this.authService.login({
        email: this.email.getRawValue(),
        password: this.password.getRawValue()
      }).pipe(take(1))
        .subscribe(res => {
          this.router.navigate(['/schools']);
        })
    }
  }

}
