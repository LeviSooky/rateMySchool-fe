import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {SchoolService} from "../../../shared/service/school.service";
import {School} from "../../../shared/model/school.model";
import {PageRequest} from "../../../shared/model/page-request";
import {take} from "rxjs";
import {Router} from "@angular/router";
import {DOCUMENT} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

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
  schools: School[] = [];
  private pageRequest: PageRequest = PageRequest.DEFAULT;
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
        console.log(this.getPageable())
    })
  }

  getPageable(): PageRequest {
    return this.pageRequest;
  }

  search(): void {
    this.keyword === '' ?
      this.schoolService.findAll(this.getPageable())
        .pipe(take(1))
        .subscribe(result => this.schools = result)
      : this.schoolService.findAllBy(this.keyword, this.getPageable())
        .pipe(take(1))
        .subscribe(result => this.schools = result)  }

  openSchool(index: number) {
    let id = this.schools[index].id;
    // @ts-ignore
    this.router.navigate(['/schools/', id]);
  }

  toPage(pageNumber: number) {
    this.getPageable().page = pageNumber;
    this.search();
  }

  hasNextPage(): boolean {
    // @ts-ignore
    return this.getPageable()?.totalPages && this.getPageable().totalPages > this.getPageable()?.page + 1;
  }

  hasNextNextPage(): boolean { //TODO rename
    // @ts-ignore
    return this.getPageable()?.totalPages && this.getPageable().totalPages > this.getPageable()?.page + 2;
  }

  openCreationModal() {
    this.modalService.open(this.creationModal, {backdrop: false, keyboard: false, size: 'xl', animation: true})
  }
}
