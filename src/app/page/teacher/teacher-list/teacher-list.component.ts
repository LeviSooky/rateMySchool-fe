import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Teacher} from "../../../shared/model/teacher.model";
import {TeacherService} from "../../../shared/service/teacher.service";
import {PageRequest} from "../../../shared/model/page-request";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  Observable,
  of,
  OperatorFunction, Subscription,
  switchMap,
  take,
  tap
} from "rxjs";
import {Sort, SortDirection} from "../../../shared/model/sort.model";
import {Router} from "@angular/router";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {SchoolService} from "../../../shared/service/school.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {School} from "../../../shared/model/school.model";
import {ToastService} from "../../../shared/service/toast.service";
import {AuthUser} from "../../../shared/model/auth-user.model";
import {AuthService} from "../../../shared/service/auth.service";
import {EntityStatus} from "../../../shared/enums/entity.status";
import {ModeratorService} from "../../../shared/service/moderator.service";

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.scss']
})
export class TeacherListComponent implements OnInit, OnDestroy {

  @ViewChild('creationModal') private creationModal;
  @ViewChild('typeahead', {read: ElementRef}) private typeahead: HTMLInputElement;
  teachers: Teacher[] = [];
  pageReq: PageRequest = new PageRequest();
  formGroup: FormGroup;
  keyword: string = '';
  currentSort?: Sort;
  user: AuthUser;
  SortDirection = SortDirection;
  isEdit: boolean = false;
  editedTeacherId: string;
  private lastSearch: string;
  protected searchingInline: boolean = false;
  model: any;
  authSub: Subscription;
  EntityStatus = EntityStatus;
  private schoolPageReq: PageRequest;


  constructor(
    private teacherService: TeacherService,
    private router: Router,
    private schoolService: SchoolService,
    private modalService: NgbModal,
    private toastService: ToastService,
    private authService: AuthService,
    private moderatorService: ModeratorService,
  ) {}

  ngOnInit(): void {
    this.authSub = this.authService.authUser.subscribe(user => this.user = user);
    this.schoolPageReq = new PageRequest();
    this.schoolPageReq.size = 15;
    this.schoolPageReq.setSort(new Sort('name', SortDirection.ASC));
    this.formGroup = new FormGroup({

      name: new FormControl('', [Validators.required, Validators.minLength(10)]),
      isMale: new FormControl(false, [Validators.required]),
      school: new FormControl<School>(null, [Validators.required, Validators.nullValidator]),
    })
    this.teacherService.findAll(this.pageReq)
      .pipe(take(1))
      .subscribe(result => this.teachers = result);
  }

  get name(): FormControl {
    return this.formGroup.get('name') as FormControl;
  }

  get isMale(): FormControl {
    return this.formGroup.get('isMale') as FormControl;
  }

  get school(): FormControl {
    return this.formGroup.get('school') as FormControl;
  }

  search() {
    if (this.keyword !== '') {
      if (this.keyword !== this.lastSearch) {
        this.pageReq.toDefault();
        this.clearCurrentSort();
      }
      this.lastSearch = this.keyword;
      if (this.user) {
        this.moderatorService.findTeachersBy(this.keyword, this.pageReq)
          .pipe(take(1))
          .pipe(take(1))
          .subscribe(result => {
            this.teachers = result;
            this.pageReq = Object.assign(new PageRequest(), this.pageReq);
          })
      } else {
        this.teacherService.findAllBy(this.keyword, this.pageReq)
          .pipe(take(1))
          .subscribe(result => {
            this.teachers = result;
            this.pageReq = Object.assign(new PageRequest(), this.pageReq);
          })
      }
    } else {
      if (this.lastSearch !== '') {
        this.lastSearch = '';
        this.clearCurrentSort()
      }
      if (this.user) {
        this.moderatorService.findTeachers(this.pageReq)
          .pipe(take(1))
          .subscribe(result => {
            this.teachers = result;
            this.pageReq = Object.assign(new PageRequest(), this.pageReq);
          })
      } else {
        this.teacherService.findAll(this.pageReq)
          .pipe(take(1))
          .subscribe(result => {
            this.teachers = result;
            this.pageReq = Object.assign(new PageRequest(), this.pageReq);
          })
      }
    }
    window.scrollTo(0, 0);
  }

  searchInline: OperatorFunction<string, readonly School[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searchingInline = true)),
      switchMap((term) =>
        this.schoolService.findAllBy(term, this.schoolPageReq).pipe(
          catchError(() => {
            return of([]);
          }),
        ),
      ),
      tap(() => (this.searchingInline = false)),
    );
  schoolFormatter = (school: School) => school.name;

  openCreationModal() {
    this.formGroup.reset();
    this.isEdit = false;
    this.modalService.open(this.creationModal,
      {backdrop: "static", keyboard: false, size: 'xl', animation: true, centered:true});
  }

  openEditModal(index: number) {
    this.formGroup.reset();
    let teacher = this.teachers[index];
    this.isEdit = true;
    this.editedTeacherId = teacher.id;
    this.isMale.setValue(teacher.isMale);
    this.name.setValue(teacher.name);
    this.school.setValue(teacher.school);
    console.log(this.school)
    this.modalService.open(this.creationModal,
      {backdrop: "static", keyboard: false, size: 'xl', animation: true, centered:true});
  }

  private clearCurrentSort() {
    this.currentSort = null;
  }

  sort(field: string) {
    let index = this.pageReq.sort.findIndex(sort => sort.field === field);
    if (index === -1) {
      this.pageReq.sort = [new Sort(field, SortDirection.ASC)];
    } else {
      this.pageReq.sort[index].direction =
        this.pageReq.sort[index].direction === SortDirection.ASC
          ? SortDirection.DESC
          : SortDirection.ASC;
    }
    this.currentSort = this.pageReq.sort[0]; //TODO think
    this.search();
  }

  openTeacher(i: number) {
    let id = this.teachers[i].id;
    this.router.navigate( ['/teachers/', id])
  }

  toSchool(id: string) {
    this.router.navigate(['/schools/', id]);
  }

  save(modal: any) {
    if (this.formGroup.valid) {
      let teacher = new Teacher();
      teacher.name = this.name.getRawValue();
      teacher.id = this.editedTeacherId;
      teacher.isMale = this.isMale.getRawValue();

      this.teacherService.create(teacher, this.school.value.id)
        .pipe(take(1))
        .subscribe(() => {
          this.toastService.showSuccessToast('Sikeres létrehozás, moderátoraink jóváhagyása után láthatóvá válik az általad hozzáadott tanár!');
          modal.close();
          this.formGroup.reset();
        }, () => this.toastService.showError("Valami hiba történt, kérlek próbálkozz később!"))
    }
  }

  moderate(teacherId: string, shouldActivate: boolean) {
    this.moderatorService.moderateTeacher(teacherId, shouldActivate)
      .pipe(take(1))
      .subscribe({
        error: () => this.toastService.showError("Valami hiba történt!"),
        complete: () => {
          this.toastService.showSuccessToast(`Sikeres ${ shouldActivate ? 'aktíválás' : 'törlés'} !`);
          this.search();
        }
      })
  }

  validate(typeahead: HTMLInputElement) {
    if (this.school.invalid) {
      typeahead.value = '';
      typeahead.classList.add('is-invalid');
    }
  }

  update(modal: any) {
    if (!this.formGroup.valid) {
      return;
    }
    let teacherToUpdate = new Teacher();
    teacherToUpdate.id = this.editedTeacherId;
    teacherToUpdate.name = this.name.value;
    teacherToUpdate.isMale = this.isMale.value;
    this.moderatorService.editTeacher(teacherToUpdate, this.school.value.id)
      .pipe(take(1))
      .subscribe({
        complete: () => {
          this.toastService.showSuccessToast("Sikeres módosítás!");
          this.search();
          modal.close();
        },
        error: () => this.toastService.showError("Valami hiba történt")
      })
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }
}
