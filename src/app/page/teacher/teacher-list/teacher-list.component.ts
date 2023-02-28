import {Component, OnInit} from '@angular/core';
import {Teacher} from "../../../shared/model/teacher.model";
import {TeacherService} from "../../../shared/service/teacher.service";
import {PageRequest} from "../../../shared/model/page-request";
import {take} from "rxjs";
import {Sort, SortDirection} from "../../../shared/model/sort.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.css']
})
export class TeacherListComponent implements OnInit {
  teachers: Teacher[] = [];
  pageReq: PageRequest = new PageRequest();
  keyword: string = '';
  currentSort?: Sort;
  SortDirection = SortDirection;
  private lastSearch: string;

  constructor(
    private teacherService: TeacherService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.teacherService.findAll(this.pageReq)
      .pipe(take(1))
      .subscribe(result => this.teachers = result);
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

  openCreationModal() {

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
}
