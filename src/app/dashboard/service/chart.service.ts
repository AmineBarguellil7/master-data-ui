import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ConnectionPoint } from 'src/app/connection-points/model/connection-point';
import { Page } from 'src/app/utils/page';

import { map } from 'rxjs/operators';



interface TenantConnectionCount {
  tenantName: string;
  connectionCount: number;
}


@Injectable({ providedIn: 'root' })
export class ChartService {
  constructor(private http: HttpClient) { }

  businesspartners_url = environment.apiBaseUrl + "/businesspartners";
  connectionpoints_url = environment.apiBaseUrl + "/connectionpoints";

  getTenants(): Observable<string[]> {
    return this.http.get<string[]>(this.businesspartners_url + "/tenants");
  }

  searchConnectionPoints(searchParams: any, size: number, page: number, sort: string): Observable<Page<ConnectionPoint>> {
    let params = new HttpParams();
    params = params.append('size', size.toString());
    params = params.append('page', page.toString());
    params = params.append('sort', sort);
    return this.http.put<Page<ConnectionPoint>>(`${this.connectionpoints_url}/searchConnectionPoints`, searchParams, { params });
  }


  getTenantsWithFacilities(): Observable<TenantConnectionCount[]> {
    const searchParams = { type: 'FACILITY' };

    const result = this.searchConnectionPoints(searchParams, 1000, 0, 'tenantName')
      .pipe(
        map((page: Page<ConnectionPoint>) => {
          const tenantCounts: { [key: string]: number } = {};

          // Count connection points per tenant
          page.content.forEach(cp => {
            const tenantName = cp.tenantName;
            if (tenantCounts[tenantName]) {
              tenantCounts[tenantName]++;
            } else {
              tenantCounts[tenantName] = 1;
            }
          });

          // Convert to array of objects
          return Object.keys(tenantCounts).map(tenantName => ({
            tenantName: tenantName,
            connectionCount: tenantCounts[tenantName]
          }));
        })
      );

    // result.subscribe(console.log); // Log the result

    return result;
  }



}
