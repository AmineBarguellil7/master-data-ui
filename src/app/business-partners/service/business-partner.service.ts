import { BusinessPartner } from '../model/business-partner'
import { Page } from '../../utils/page';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment'
import {BusinessPartnerSearchResult}from'../model/business-partner-search-result'
import { Observable } from 'rxjs';

import {BusinessPartnerNameId}from '../model/business-partner-name-id';



@Injectable({
  providedIn: 'root'
})
export class BusinessPartnerService {

  constructor(private http: HttpClient) {}
  api_url = environment.apiBaseUrl +"/businesspartners"
  

  search(searchParams:any,size: number, page: number, sort: string) :Observable<Page<BusinessPartnerSearchResult>> {
    // Construct the query parameters
    let params = new HttpParams();
    params = params.append('size', size.toString());
    params = params.append('page', page.toString());
    params = params.append('sort', sort);
    return this.http.put<Page<BusinessPartnerSearchResult>>(`${this.api_url}/search`,searchParams,{params});
    
  }
  getBusinessPartnersNamesIdsByType(type:string) :Observable<BusinessPartnerNameId[]> {
  
  
    return this.http.put<BusinessPartnerNameId[]>(`${this.api_url}/names/type`,type);
    
  }

  getTenants() : Observable<string[]> {
    return this.http.get<string[]>(this.api_url + "/tenants");
  }

  
  getBusinessPartnersNamesIds() : Observable<BusinessPartnerNameId[]> {
    return this.http.get<BusinessPartnerNameId[]>(this.api_url + "/names");
  }
  getBusinessPartner(id:string) : Observable<BusinessPartner> {
    return this.http.get<BusinessPartner>(this.api_url + '/'+ id);
  }

  delete(ids:string[]) :Observable<void>{
    return this.http.put<void>(`${this.api_url}/delete`,ids);
    
  }
  add(businessPartner:BusinessPartner): Observable<BusinessPartner>{
    return this.http.post<BusinessPartner>(`${this.api_url}`,businessPartner);
  }
  getProviderIdUnderHundred():Observable<number>{
    return this.http.get<number>(this.api_url + '/provider/under');
  }
  getProviderIdAboveHundred():Observable<number>{
    return this.http.get<number>(this.api_url + '/provider/above');
  }


  exportToExcel(businessPartners: Set<BusinessPartner>): Observable<Blob> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.api_url + '/download', Array.from(businessPartners), { headers, responseType: 'blob' });
  }


  searchBusinessPartners(searchParams:any,size: number, page: number, sort: string) :Observable<Page<BusinessPartner>> {
    // Construct the query parameters
    let params = new HttpParams();
    params = params.append('size', size.toString());
    params = params.append('page', page.toString());
    params = params.append('sort', sort);
    return this.http.put<Page<BusinessPartner>>(`${this.api_url}/searchBusinessPartners`,searchParams,{params});
    
  }


}
