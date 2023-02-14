export class Sort {
  constructor
  (
    public field: string,
    public direction: SortDirection
  ) {}
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}
