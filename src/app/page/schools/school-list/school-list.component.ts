import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SchoolService} from "../../../shared/service/school.service";
import {School} from "../../../shared/model/school.model";
import {PageRequest} from "../../../shared/model/page-request";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  Observable, of,
  OperatorFunction,
  Subscription,
  switchMap,
  take,
  tap
} from "rxjs";
import {Router} from "@angular/router";
import {DOCUMENT} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Sort, SortDirection} from "../../../shared/model/sort.model";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {ToastService} from "../../../shared/service/toast.service";
import {ImageService} from "../../../shared/service/image.service";
import {EntityStatus} from "../../../shared/enums/entity.status";
import {AuthUser} from "../../../shared/model/auth-user.model";
import {ModeratorService} from "../../../shared/service/moderator.service";
import {AuthService} from "../../../shared/service/auth.service";
import {City} from "../../../shared/model/city.model";
import {CityService} from "../../../shared/service/city.service";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-school-list',
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.scss']
})
export class SchoolListComponent implements OnInit, OnDestroy {

  @ViewChild('creationModal', { static: false})
  // @ts-ignore
  creationModal;

  keyword: string = '';
  lastSearch: string = '';
  schools: School[] = [];
  formGroup: FormGroup;
  currentSort?: Sort;
  SortDirection = SortDirection;
  EntityStatus = EntityStatus;
  protected user: AuthUser;
  searchingInline: boolean = false;
  authSub: Subscription;
  updateSchoolId: string;
  url = 'assets/img-placeholder.webp';
  isEdit: boolean = false;

  imageUpload;
  urlRegex = new RegExp("^(http(s):\\/\\/.)[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)$");
  pageRequest: PageRequest = new PageRequest();
  constructor(
    private schoolService: SchoolService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private modalService: NgbModal,
    private toastService: ToastService,
    private imageService: ImageService,
    private moderatorService: ModeratorService,
    private authService: AuthService,
    private cityService: CityService,
  ) {
  }
  ngOnInit(): void {
    this.authSub = this.authService.authUser.subscribe(user => this.user = user);
    this.schoolService.findAll(this.pageRequest)
      .pipe(take(1))
      .subscribe(result => {
        this.schools = result;
        this.pageRequest = Object.assign(new PageRequest(), this.pageRequest);
    })
    this.formGroup = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(10)]),
      websiteUrl: new FormControl('', [Validators.required, Validators.pattern(this.urlRegex)]),
      image: new FormControl(null),
      city: new FormControl(null, [Validators.required])
      })
  }
  get name(): AbstractControl {
    return this.formGroup.get('name') as AbstractControl;
  }

  get image(): AbstractControl {
    return this.formGroup.get('image') as AbstractControl;
  }

  get websiteUrl() {
    return this.formGroup.get('websiteUrl');
  }

  get city() {
    return this.formGroup.get('city');
  }

  getPageable(): PageRequest {
    return this.pageRequest;
  }

  cityFormatter = (city: City) => city.name;

  searchInline: OperatorFunction<string, readonly School[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searchingInline = true)),
      switchMap((term) =>
        this.cityService.findAllBy(term).pipe(
          catchError(() => {
            return of([]);
          }),
        ),
      ),
      tap(() => (this.searchingInline = false)),
    );

  search(): void {
    if (this.keyword !== '') {
      if (this.keyword !== this.lastSearch) {
        this.pageRequest.toDefault();
        this.clearCurrentSort();
      }
      this.lastSearch = this.keyword;
      if (this.user) {
        this.moderatorService.findSchoolsBy(this.keyword, this.pageRequest).pipe(take(1))
          .subscribe(result => {
            this.schools = result;
            this.pageRequest = Object.assign(new PageRequest(), this.pageRequest);
          });
      } else {
        this.schoolService.findAllBy(this.keyword, this.getPageable())
          .pipe(take(1))
          .subscribe(result => {
            this.schools = result;
            this.pageRequest = Object.assign(new PageRequest(), this.pageRequest);
          })
      }
    } else {
        if (this.lastSearch !== '') {
          this.lastSearch = '';
          this.clearCurrentSort()
        }
        if (this.user) {
          this.moderatorService.findSchools(this.pageRequest)
            .pipe(take(1))
            .subscribe(result => {
              this.schools = result;
              this.pageRequest = Object.assign(new PageRequest(), this.pageRequest);
            })
        } else {
          this.schoolService.findAll(this.getPageable())
            .pipe(take(1))
            .subscribe(result => {
              this.schools = result;
              this.pageRequest = Object.assign(new PageRequest(), this.pageRequest);
            })
        }
    }
    window.scrollTo(0, 0);
  }

  resetImagePreview() {
    this.url = 'assets/img-placeholder.webp';
  }

  clearCurrentSort() {
    //@ts-ignore
    this.currentSort = null;
  }

  openSchool(index: number) {
    let id = this.schools[index].id;
    // @ts-ignore
    this.router.navigate(['/schools/', id]);
  }

  openCreationModal() {
    this.formGroup.reset();
    this.resetImagePreview();
    this.isEdit = false;
    this.updateSchoolId = null;
    this.modalService.open(this.creationModal,
      {backdrop: "static", keyboard: false, size: 'xl', animation: true, centered:true});
  }

  save(modal) {
    if (this.formGroup.valid) {
      modal.close();
      let schoolToSave = new School();
      schoolToSave.name = this.name.getRawValue();
      schoolToSave.websiteUrl = this.websiteUrl.getRawValue();
      schoolToSave.city = this.city.value;

      this.schoolService.create(schoolToSave)
        .pipe(take(1))
        .subscribe(result => {
          let form = new FormData();
          form.append('schoolId', result.id);
          form.append('image', this.imageUpload);
          this.imageService.save(form)
            .pipe(take(1))
            .subscribe(() => {
              this.toastService.showSuccessToast('Sikeres létrehozás, moderátoraink jóváhagyása után láthatóvá válik az általad hozzáadott iskola!');
            }, () => {
              this.toastService.showError("Valami hiba történt, kérlek próbálkozz később!")
            })
        }, () => this.toastService.showError("Valami hiba történt, kérlek próbálkozz később!"))
      this.formGroup.reset();
    }
  }

  edit(modal) {
    if (!this.formGroup.valid) {
      return;
    }
    let schoolToUpdate = new School();
    schoolToUpdate.id = this.updateSchoolId;
    schoolToUpdate.name = this.name.value;
    schoolToUpdate.city = this.city.value;
    schoolToUpdate.websiteUrl = this.websiteUrl.value;
    if (this.imageUpload) {
      let form = new FormData();
      form.append('schoolId', schoolToUpdate.id);
      form.append('image', this.imageUpload);
      this.imageService.save(form)
        .pipe()
        .subscribe({
          error: () => this.toastService.showError('Hiba történt a képfeltöltés során')
        })
    }
    this.moderatorService.update(schoolToUpdate)
      .pipe(take(1))
      .subscribe({
        complete: () => {
          this.toastService.showSuccessToast("Sikeres módosítás!");
          modal.close();
          this.search();
        },
        error: () => this.toastService.showError("Valami hiba történt!")
      })
  }

  sort(field: string) {
    let index = this.pageRequest.sort.findIndex(sort => sort.field === field);
    if (index === -1) {
      this.pageRequest.sort = [new Sort(field, SortDirection.ASC)];
    } else {
      this.pageRequest.sort[index].direction =
        this.pageRequest.sort[index].direction === SortDirection.ASC
          ? SortDirection.DESC
          : SortDirection.ASC;
    }
    this.currentSort = this.pageRequest.sort[0]; //TODO think
    this.search();
  }

  readURL(event:any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event:any) => {
        this.url = event.target.result;
      }

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  setImage(event: any) {
    this.imageUpload = event.target.files[0];
    this.readURL(event);
  }

  goToLink(url: string) {
    window.open(url, "_blank");
  }

  moderate(schoolId: string, shouldActivate: boolean) {
    this.moderatorService.moderateSchool(schoolId, shouldActivate)
      .pipe(take(1))
      .subscribe({
        error: () => this.toastService.showError("Valami hiba történt!"),
        complete: () => {
          this.toastService.showSuccessToast(`Sikeres ${ shouldActivate ? 'aktíválás' : 'törlés'} !`);
          this.search();
        }
      })
  }

  getBaseUrl() {
    return environment.apiUrl;
  }

  openEditModal(index: number) {
    this.formGroup.reset();
    this.resetImagePreview();
    let school = this.schools[index];
    this.isEdit = true;
    this.updateSchoolId = school.id;
    this.url = this.getBaseUrl() + '/api/image/' + school.id;
    this.city.setValue(school.city);
    this.name.setValue(school.name);
    this.websiteUrl.setValue(school.websiteUrl);
    this.modalService.open(this.creationModal, {backdrop: "static", keyboard: false, size: "xl", animation:true, centered:true})
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }
}
