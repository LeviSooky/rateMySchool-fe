import {Sort} from "./sort.model";

export class PageRequest {

  static readonly DEFAULT = new PageRequest(0, 20, [], 0, 0);
  static readonly TOTAL_ELEMENTS_HEADER = 'total-elements';
  static readonly TOTAL_PAGES_HEADER = 'total-pages';
  constructor
  (
    public page: number,
    public size: number,
    public sort: Sort[],
    // @ts-ignore

    public totalElements: number,
    // @ts-ignore

    public totalPages: number,
  ) {}

  setSort(sort: Sort): void {
    this.sort ? this.sort.push(sort) : this.sort = [sort];
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
