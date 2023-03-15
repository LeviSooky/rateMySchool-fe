import {Component, OnInit, ViewChild} from '@angular/core';
import {Teacher} from "../../../shared/model/teacher.model";
import {TeacherService} from "../../../shared/service/teacher.service";
import {PageRequest} from "../../../shared/model/page-request";
import {
  catchError,
  debounceTime,
  distinctUntilChanged, map,
  Observable,
  of,
  OperatorFunction,
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

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.scss']
})
export class TeacherListComponent implements OnInit {

  @ViewChild('creationModal') private creationModal;
  teachers: Teacher[] = [];
  pageReq: PageRequest = new PageRequest();
  formGroup: FormGroup;
  keyword: string = '';
  currentSort?: Sort;
  SortDirection = SortDirection;
  private lastSearch: string;
  protected searchingInline: boolean = false;
  model: any;
  private schoolPageReq: PageRequest;


  constructor(
    private teacherService: TeacherService,
    private router: Router,
    private schoolService: SchoolService,
    private modalService: NgbModal,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.schoolPageReq = new PageRequest();
    this.schoolPageReq.size = 15;
    this.schoolPageReq.setSort(new Sort('name', SortDirection.ASC));
    this.formGroup = new FormGroup({

      name: new FormControl('', [Validators.required, Validators.minLength(10)]),
      isMale: new FormControl(false, [Validators.required]),
      schoolId: new FormControl('', [Validators.required]),
    })
    this.teacherService.findAll(this.pageReq)
      .pipe(take(1))
      .subscribe(result => this.teachers = result);
  }

  get name(): AbstractControl {
    return this.formGroup.get('name') as AbstractControl;
  }

  get isMale(): AbstractControl {
    return this.formGroup.get('isMale') as AbstractControl;
  }

  get schoolId(): AbstractControl {
    return this.formGroup.get('schoolId') as AbstractControl;
  }

  search() {
    if (this.keyword !== '') {
      if (this.keyword !== this.lastSearch) {
        this.pageReq.toDefault();
        this.clearCurrentSort();
      }
      this.lastSearch = this.keyword;
      this.teacherService.findAllBy(this.keyword, this.pageReq)
        .pipe(take(1))
        .subscribe(result => {
          this.teachers = result;
          this.pageReq = Object.assign(new PageRequest(), this.pageReq);
        })
    } else {
      if (this.lastSearch !== '') {
        this.lastSearch = '';
        this.clearCurrentSort()
      }
      this.teacherService.findAll(this.pageReq)
        .pipe(take(1))
        .subscribe(result => {
          this.teachers = result;
          this.pageReq = Object.assign(new PageRequest(), this.pageReq);
        })
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
    this.modalService.open(this.creationModal,
      {backdrop: "static", keyboard: false, size: 'xl', animation: true});
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
      teacher.isMale = this.isMale.getRawValue();
      this.teacherService.create(teacher, this.schoolId.getRawValue())
        .pipe(take(1))
        .subscribe(() => {
          this.toastService.showSuccessToast('Sikeres létrehozás, moderátoraink jóváhagyása után láthatóvá válik az általad hozzáadott tanár!');
          modal.close
          this.formGroup.reset();
        }, () => this.toastService.showError("Valami hiba történt, kérlek próbálkozz később!"))
    }
  }

  setSchoolId(selected) {
    this.schoolId.setValue(selected.item.id);
    console.log(this.formGroup)
  }
}
