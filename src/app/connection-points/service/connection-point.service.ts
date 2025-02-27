import { ConnectionPoint } from '../model/connection-point';
import { Page } from '../../utils/page';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment'
import {ConnectionPointSearchResult}from'../model/connection-point-search-result'
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ConnectionPointService {

  constructor(private http: HttpClient) {}
  api_url = environment.apiBaseUrl +"/connectionpoints"
  

  search(searchParams:any,size: number, page: number, sort: string) :Observable<Page<ConnectionPointSearchResult>> {
    // Construct the query parameters
    let params = new HttpParams();
    params = params.append('size', size.toString());
    params = params.append('page', page.toString());
    params = params.append('sort', sort);
    return this.http.put<Page<ConnectionPointSearchResult>>(`${this.api_url}/search`,searchParams,{params});
    
  }


  getConnectionPointsByBPId(BPid: string | undefined ,type:string) {
    return this.http.get<ConnectionPointSearchResult[]>(`${this.api_url}/getConnectionPointsByBPId/${BPid}/${type}`);
}

getConnectionPoint(id:string) : Observable<ConnectionPoint> {
  return this.http.get<ConnectionPoint>(this.api_url + '/'+ id);
}

delete(ids:string[]) :Observable<void>{
  return this.http.put<void>(`${this.api_url}/delete`,ids);
  
}
update(connectionPoint:ConnectionPoint):Observable<ConnectionPoint>{
  console.log(connectionPoint);
  return this.http.put<ConnectionPoint>(`${this.api_url}/update`,connectionPoint);
}
add(connectionPoint:ConnectionPoint):Observable<ConnectionPoint>{
  return this.http.post<ConnectionPoint>(`${this.api_url}/add`,connectionPoint);
}



exportToExcel(connectionPoints: Set<ConnectionPoint>): Observable<Blob> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.post(this.api_url + '/download', Array.from(connectionPoints), { headers, responseType: 'blob' });
}


checkUniqueLocationId(id: string, locationId: string): Observable<boolean> {
  const formData: FormData = new FormData();
  formData.append('id', id);
  formData.append('locationId', locationId);
  return this.http.post<boolean>(`${this.api_url}/checkLocation`,formData);
}




searchConnectionPoints(searchParams:any,size: number, page: number, sort: string) :Observable<Page<ConnectionPoint>> {
  let params = new HttpParams();
  params = params.append('size', size.toString());
  params = params.append('page', page.toString());
  params = params.append('sort', sort);
  return this.http.put<Page<ConnectionPoint>>(`${this.api_url}/searchConnectionPoints`,searchParams,{params});
  
}


}
