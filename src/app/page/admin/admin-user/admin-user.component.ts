import {Component, OnInit, ViewChild} from '@angular/core';
import {User} from "../../../shared/model/user.model";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AdminService} from "../../../shared/service/admin.service";
import {take, tap} from "rxjs";
import {ToastService} from "../../../shared/service/toast.service";
import {AbstractControl, Form, FormControl, FormGroup, Validators} from "@angular/forms";
import {logMessages} from "@angular-devkit/build-angular/src/builders/browser-esbuild/esbuild";

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.scss']
})
export class AdminUserComponent implements OnInit {

  @ViewChild('creationModal') private creationModal;
  users: User[] = [];
  keyword: string = '';
  isEdit: boolean = false;
  editedUserId: string;

  validatePasswordMatch = (control: AbstractControl): {[key: string]: any} | null => {
    const password = this.formGroup?.get('password')?.value as string;
    const passwordConfirm = control.value as string;

    if (password !== passwordConfirm) {
      return {passwordMatch: true};
    }

    return null;
  };

  formGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    firstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl(null, [Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$')]),
    rePassword: new FormControl(null, [this.validatePasswordMatch]),
    isAdmin: new FormControl(false)
  })

  constructor(
    private modalService: NgbModal,
    private adminService: AdminService,
    private toastService: ToastService,
  ) {
  }

  ngOnInit(): void {
    this.search();
  }

  get firstName(): FormControl {
    return this.formGroup.get('firstName') as FormControl;
  }

  get lastName() {
    return this.formGroup.get('lastName');
  }

  get password(): FormControl {
    return this.formGroup.get('password') as FormControl;
  }

  get rePassword(): FormControl {
    return this.formGroup.get('rePassword') as FormControl;
  }

  get email(): FormControl {
    return this.formGroup.get('email') as FormControl;
  }

  get isAdmin(): FormControl {
    return this.formGroup.get('isAdmin') as FormControl;
  }

  delete(id: string) {
    this.adminService.delete(id)
      .pipe(take(1))
      .subscribe({
        complete: () => this.toastService.showSuccessToast('Sikeres törlés!'),
        error: () => this.toastService.showError('Valami hiba történt')
      })
  }

  search() {
    if (this.keyword.trim() !== '') {
      this.adminService.findUsers(this.keyword)
        .pipe(take(1))
        .subscribe(res => this.users = res);
    } else {
      this.adminService.findUsers()
        .pipe(take(1))
        .subscribe(res => this.users = res);
    }
  }

  openCreationModal() {
    this.modalService.open(this.creationModal,
      {backdrop: "static", keyboard: false, size: 'xl', animation: true, centered:true})
  }

  openEditModal(i) {
    this.isEdit = true;
    let user = this.users[i];
    this.editedUserId = user.id;
    this.email.setValue(user.email);
    this.firstName.setValue(user.firstName);
    this.lastName.setValue(user.lastName);
    this.email.setValue(user.email);
    this.isAdmin.setValue(user.isAdmin);
    this.modalService.open(this.creationModal,
      {backdrop: "static", keyboard: false, size: 'xl', animation: true, centered:true})
  }

  edit(modal: any) {
    let user = new User();
    user.id = this.editedUserId;
    user.email = this.email.value;
    user.isAdmin = this.isAdmin.value;
    user.lastName = this.lastName.value;
    user.firstName = this.firstName.value;
    user.password = this.password.value;
    this.adminService.update(user)
      .pipe(take(1))
      .subscribe({
        complete: () => {
          this.toastService.showSuccessToast("Sikeres Módosítás!");
          this.formGroup.reset();
          modal.close();
          this.search();
        },
        error: () => this.toastService.showError('Valami hiba történt!')
      })

  }

  save(modal: any) {
    let user = new User();
    user.email = this.email.value;
    user.lastName = this.lastName.value;
    user.firstName = this.firstName.value;
    user.password = this.password.value;
    user.isAdmin = this.isAdmin.value;
    this.adminService.create(user)
      .pipe(take(1))
      .subscribe({
        complete: () => {
          this.toastService.showSuccessToast("Sikeres létrehozás!");
          this.formGroup.reset();
          this.password.clearValidators();
          modal.close();
          this.search();
        },
        error: () => this.toastService.showError('Valami hiba történt!')
      })
  }
}

