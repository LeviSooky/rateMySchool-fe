import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {SchoolService} from "../../../shared/service/school.service";
import {School} from "../../../shared/model/school.model";
import {PageRequest} from "../../../shared/model/page-request";
import {take} from "rxjs";
import {Router} from "@angular/router";
import {DOCUMENT} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Sort, SortDirection} from "../../../shared/model/sort.model";

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
  currentSort?: Sort;
  SortDirection = SortDirection;
  pageRequest: PageRequest = new PageRequest();
  constructor(
    private schoolService: SchoolService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private modalService: NgbModal
  ) {
  }
  ngOnInit(): void {
    this.schoolService.findAll(this.pageRequest)
      .pipe(take(1))
      .subscribe(result => {
        this.schools = result;
        this.pageRequest = Object.assign(new PageRequest(), this.pageRequest);
    })
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
          console.log(this.pageRequest)
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
            console.log(this.pageRequest)
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
      {backdrop: "static", keyboard: false, size: 'xl', animation: true})
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
}
