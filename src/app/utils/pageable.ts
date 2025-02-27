export class  Pageable {
    pageNumber: number=0;
    pageSize: number=0;
    sort: any[]=[]; 
    offset: number=0;
    paged: boolean =false;
    unpaged: boolean =false;
  };