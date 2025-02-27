import { Person } from "./person";

export class BusinessPartner{
    id:string ='';
    partnerNumber:string='';
    providerId:number =0;
    tenantId:string='';
    name:string='';
    countryCode:string='';
    city:string='';
    currency:string='';
    switchOffExit:boolean=false;
    type:string='';
    revision:number=0;
    contactPerson:Person = new Person();
}