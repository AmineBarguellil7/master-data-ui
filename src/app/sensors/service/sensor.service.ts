import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'src/app/utils/page';
import { environment } from 'src/environments/environment';
import { Sensor } from '../model/sensor';
import { SensorSearchResult } from '../model/sensor-search-result';



@Injectable({
  providedIn: 'root'
})
export class SensorService {
  constructor(private http: HttpClient) {}
  api_url = environment.apiBaseUrl +"/sensors"
  

  search(searchParams:any,size: number, page: number, sort: string) :Observable<Page<SensorSearchResult>>{
    // Construct the query parameters
    let params = new HttpParams();
    params = params.append('size', size.toString());
    params = params.append('page', page.toString());
    params = params.append('sort', sort);
    return this.http.put<Page<SensorSearchResult>>(`${this.api_url}/search`,searchParams,{params});
    
  }


  getSensor(id:string) : Observable<Sensor> {
    return this.http.get<Sensor>(this.api_url + '/'+ id);
  }

 delete(ids:string[]) :Observable<void>{
    return this.http.put<void>(`${this.api_url}/delete`,ids);
  }


  Update(sensor:any) : Observable<Sensor>{
    return this.http.put<Sensor>(this.api_url,sensor);
    }


    checkUniqueSensor(sensorId: string, serialNumber: string, laneNumber: string): Observable<Map<string, string>> {
      const params = {
        sensorId: sensorId || '',
        serialNumber: serialNumber,
        laneNumber: laneNumber ,
      };
    
      return this.http.get<Map<string, string>>(`${this.api_url}/checkUniqueSensor`, { params });
    }    

    getMode() : Observable<boolean> {
      return this.http.get<boolean>(this.api_url + '/mode');
    }
    generateApiKey():Observable<string>{
      return this.http.get(this.api_url + '/apiKey',{ responseType: 'text' });
    }



    exportToExcel(sensors: Set<Sensor>): Observable<Blob> {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.http.post(this.api_url + '/download', Array.from(sensors), { headers, responseType: 'blob' });
    }


  searchSensors(searchParams:any,size: number, page: number, sort: string) :Observable<Page<Sensor>> {
      let params = new HttpParams();
      params = params.append('size', size.toString());
      params = params.append('page', page.toString());
      params = params.append('sort', sort);
      return this.http.put<Page<Sensor>>(`${this.api_url}/searchSensors`,searchParams,{params});
      
    }


}
