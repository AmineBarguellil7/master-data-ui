import { Address } from "./address";

export class Person{
    id:string='';
    firstName:string='';
    surName:string='';
    salutation:string='';
    personalTitle:string='';
    email:string='';
    phone:string='';
    address:Address = new Address();
    revision:number=0;
}