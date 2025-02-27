import { Injectable } from '@angular/core';
import { HttpClient ,  HttpHeaders,  HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ContractSearchResult } from '../model/contract-search-Result';
import { Page } from '../../utils/page';
import { Contract } from '../model/contract';
import { Service } from '../../connection-points/model/service';

@Injectable({
    providedIn: 'root'
})


export class ContractService {

    

  private baseUrl: string = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}
  api_url = this.baseUrl +"/contracts"
  

  search(searchParams:any,size: number, page: number, sort: string) :Observable<Page<ContractSearchResult>> {
    // Construct the query parameters
    let params = new HttpParams();
    params = params.append('size', size.toString());
    params = params.append('page', page.toString());
    params = params.append('sort', sort);
    return this.http.put<Page<ContractSearchResult>>(`${this.api_url}/search`,searchParams,{params});
    
  }

  getContract(id:string) : Observable<Contract> {
    return this.http.get<Contract>(this.api_url + '/'+ id);
  }

  getServices():Observable<Service[]>{  
    return this.http.get<Service[]>(this.api_url + '/getServices');
  }

  getAllLicenseTypes():Observable<string[]>{  
    return this.http.get<string[]>(this.api_url + '/getAllLicenseTypes');
  }
  delete(ids:string[]) :Observable<void>{
    return this.http.put<void>(`${this.api_url}/delete`,ids);
  }

  Update(contract:any) : Observable<Contract>{
    return this.http.put<Contract>(this.api_url,contract);
    }


    
    exportToExcel(contracts: Set<Contract>): Observable<Blob> {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.http.post(this.api_url + '/download', Array.from(contracts), { headers, responseType: 'blob' });
    }

searchContracts(searchParams:any,size: number, page: number, sort: string) :Observable<Page<Contract>> {
  let params = new HttpParams();
  params = params.append('size', size.toString());
  params = params.append('page', page.toString());
  params = params.append('sort', sort);
  return this.http.put<Page<Contract>>(`${this.api_url}/searchContracts`,searchParams,{params});
  
}


}
