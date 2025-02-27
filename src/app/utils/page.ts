import {Pageable}from './pageable'
export class Page<T> { 
    content: T[]= []; 
    pageable: Pageable = new Pageable()
    last: boolean=false ;
    totalPages: number = 0;
    totalElements: number =0;
    first: boolean=false;
    size: number=0;
    number: number =0;
    sort: any[] = []; 
    numberOfElements: number= 0;
    empty: boolean = false;
  }