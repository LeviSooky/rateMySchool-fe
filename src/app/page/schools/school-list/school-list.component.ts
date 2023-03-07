import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {SchoolService} from "../../../shared/service/school.service";
import {School} from "../../../shared/model/school.model";
import {PageRequest} from "../../../shared/model/page-request";
import {take} from "rxjs";
import {Router} from "@angular/router";
import {DOCUMENT} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Sort, SortDirection} from "../../../shared/model/sort.model";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {ToastService} from "../../../shared/service/toast.service";
import {ImageService} from "../../../shared/service/image.service";
import jwtDecode from "jwt-decode";

@Component({
  selector: 'app-school-list',
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.scss']
})
export class SchoolListComponent implements OnInit {

  @ViewChild('creationModal', { static: false})
  // @ts-ignore
  creationModal;

  keyword: string = '';
  lastSearch: string = '';
  schools: School[] = [];
  formGroup: FormGroup;
  currentSort?: Sort;
  SortDirection = SortDirection;

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
  ) {
  }
  ngOnInit(): void {

    let decoded = jwtDecode('eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI0M2EzNmFhMy1lMDRjLTQ2MGItOTYzMS00OTkzNjc5NzhhODQiLCJpc3MiOiJjb20ucmF0ZW15c2Nob29sLm1haW4iLCJpYXQiOjE2NzgxODY2MTUsInJvbGUiOlt7ImF1dGhvcml0eSI6IkFETUlOIn0seyJhdXRob3JpdHkiOiJNT0RFUkFUT1IifV0sImV4cCI6MTY3ODE5NTMxNX0.OKZm91t6j64F3tf5JLtK0jy0Hqbj8-FMtlEOH4E9Uf_jjEdMX4SLGl6u-66REmlNlp_9Ske0trvV-FV3Ihfl5Q');
    this.schoolService.findAll(this.pageRequest)
      .pipe(take(1))
      .subscribe(result => {
        this.schools = result;
        this.pageRequest = Object.assign(new PageRequest(), this.pageRequest);
    })
    this.formGroup = new FormGroup({

      name: new FormControl('', [Validators.required, Validators.minLength(10)]),
      websiteUrl: new FormControl('', [Validators.required, Validators.pattern(this.urlRegex)]),
      image: new FormControl(null)
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

  getPageable(): PageRequest {
    return this.pageRequest;
  }

  search(): void {
    if (this.keyword !== '') {
      if (this.keyword !== this.lastSearch) {
        this.pageRequest.toDefault();
        this.clearCurrentSort();
      }
      this.lastSearch = this.keyword;
      this.schoolService.findAllBy(this.keyword, this.getPageable())
        .pipe(take(1))
        .subscribe(result => {
          this.schools = result;
          this.pageRequest = Object.assign(new PageRequest(), this.pageRequest);
        })
    } else {
        if (this.lastSearch !== '') {
          this.lastSearch = '';
          this.clearCurrentSort()
        }
        this.schoolService.findAll(this.getPageable())
          .pipe(take(1))
          .subscribe(result => {
            this.schools = result;
            this.pageRequest = Object.assign(new PageRequest(), this.pageRequest);
          })
    }
    window.scrollTo(0, 0);
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
    this.modalService.open(this.creationModal,
      {backdrop: "static", keyboard: false, size: 'xl', animation: true});
  }

  save(modal) {
    if (this.formGroup.valid) {
      modal.close();
      let schoolToSave = new School();
      schoolToSave.name = this.name.getRawValue();
      schoolToSave.websiteUrl = this.websiteUrl.getRawValue();

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
            }) //TODO correct handling
        }, () => this.toastService.showError("Valami hiba történt, kérlek próbálkozz később!"))
      this.formGroup.reset();
    }
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

  setImage(event: any) {
    this.imageUpload = event.target.files[0];
  }

  goToLink(url: string){
    window.open(url, "_blank");
  }
}
