import {Sort} from "./sort.model";

export class PageRequest {

  static readonly TOTAL_ELEMENTS_HEADER = 'total-elements';
  static readonly TOTAL_PAGES_HEADER = 'total-pages';

  public page: number = 0;
  public size: number = 0;
  public sort: Sort[] = [];
  public totalElements: number = 0;
  public totalPages: number = 0;
  constructor
  () {}

  setSort(sort: Sort): void {
    this.sort ? this.sort.push(sort) : this.sort = [sort];
  }

  toDefault() {
    this.page = 0;
    this.totalPages = 0;
    this.totalElements = 0;
    this.sort = [];
  }

  nextPage(): PageRequest {
    this.page ++;
    return this;
  }

  previousPage(): PageRequest {
    if (this.page > 0) {
      this.page--;
    }
    return this;
  }

  clearSort(): void {
    this.sort = [];
  }
}
