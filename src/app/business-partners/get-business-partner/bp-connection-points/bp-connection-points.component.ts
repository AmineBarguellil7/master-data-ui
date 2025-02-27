import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { KeycloakService } from "keycloak-angular";
import { ConfirmationService, MenuItem, MenuItemCommandEvent, MessageService, SortEvent } from "primeng/api";
import { TableLazyLoadEvent } from "primeng/table";
import { BusinessPartnerNameId } from "src/app/business-partners/model/business-partner-name-id";
import { ConnectionPointSearchResult } from "src/app/connection-points/model/connection-point-search-result";
import { ConnectionPointService } from "src/app/connection-points/service/connection-point.service";
import { Column } from "src/app/utils/column";
import { Page } from "src/app/utils/page";
import { BusinessPartnerService } from "../../service/business-partner.service";
import { AutoCompleteCompleteEvent } from "primeng/autocomplete";
import { Sensor } from "src/app/sensors/model/sensor";
import { ConnectionPoint } from "src/app/connection-points/model/connection-point";
import { formatDate } from "@angular/common";
import { ConnectionPointConnectivity } from "src/app/connection-points/model/connection-point-connectivity";

@Component({
  selector: "app-bp-connection-points",
  templateUrl: "./bp-connection-points.component.html",
  styleUrl: "./bp-connection-points.component.scss",
})
export class BpConnectionPointsComponent implements OnInit {
  userIsAdmin: boolean = false;
  selectedTenant: any="";
  tenantSuggestions: string[] = [];
  id: string | null = "";
  connectionPointPage: Page<ConnectionPointSearchResult> =
    new Page<ConnectionPointSearchResult>();


  connectionPointsPage : Page<ConnectionPoint> = new Page<ConnectionPoint>();  


  cols!: Column[];
  selectedColumns!: Column[];
  pageSize = 10; // Number of items per page
  currentPage = 0; // Current page number
  sortField = "name";
  sortOrder = "DESC";
  // tenant = "";
  tenants = [""];
  namesIds: any[] = [];
  searchParams: any = {
    tenantName: this.selectedTenant,
    businessPartnerId: this.id,
  };
  selectedCps!: ConnectionPointSearchResult[];
  loading: boolean = true;


  items: MenuItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private connectionPointService: ConnectionPointService,
    private businesspartnerService: BusinessPartnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private kc: KeycloakService
  ) {}

  ngOnInit(): void {
    this.businesspartnerService.getTenants().subscribe({
      next: (res: string[]) => {
        this.tenants = res;
      },
      error: () => {
        console.log("error fetching business partnerNames");
      },
    });
    this.userIsAdmin = this.kc.isUserInRole("SubAdmin");

    this.id = this.route.snapshot.paramMap.get("id");

    this.cols = [
      { field: "type", header: "Connection Type" },
      { field: "name", header: "Name" },
      { field: "baseUrl", header: "Host:Port /URL" },
      { field: "connectionPointServices", header: "Services" },
      { field: "operatorId", header: "Operator-ID" },
    ];

    this.selectedColumns = this.cols;
    this.updateMenuItems();
  }


  updateMenuItems(): void {
    this.items = [
      {
        label: 'Export',
        icon: 'pi pi-upload',
        command: () => this.clearFilters()
      },
      {
        label: 'Clear',
        icon: 'pi pi-filter-slash',
        command: () => this.clearFilters()
      },
      {
        label: 'Refresh',
        icon: 'pi pi-refresh',
        command: () => this.search()
      },
      {
        label: 'Add',
        icon: 'pi pi-plus',
        routerLink: 'add',
        visible: this.userIsAdmin
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: (event: MenuItemCommandEvent) => this.delete(event),
        visible: this.deleteMenuItemVisible 
      }
    ];
  }





  search(): void {
    this.loading = true;

    this.connectionPointService
      .search(
        {
          businessPartnerId: this.id,
        },
        this.pageSize,
        this.currentPage,
        this.sortField + "," + this.sortOrder
      )
      .subscribe({
        next: (res: Page<ConnectionPointSearchResult>) => {
          this.connectionPointPage = res;
          this.loading = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Error Getting Connection Points",
          });
          this.loading = false;
        },
      });



      
      this.connectionPointService
      .searchConnectionPoints(
        {
          businessPartnerId: this.id,
        },
        this.pageSize,
        this.currentPage,
        this.sortField + "," + this.sortOrder
      )
      .subscribe({
        next: (res: Page<ConnectionPoint>) => {
          this.connectionPointsPage = res;
          this.loading = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Error Getting Connection Points",
          });
          this.loading = false;
        },
      });



  }

  onPageChange(event: TableLazyLoadEvent) {
    this.currentPage = event.first ?? 0;
    this.pageSize = event.rows ?? 10;
    if (Array.isArray(event.sortField)) {
      this.sortField = event.sortField[0] ?? "name"; // Select the first item or provide a default value
    } else {
      this.sortField = event.sortField ?? "name"; // Use the value directly or provide a default value
    }
    if (event.sortOrder == 1) {
      this.sortOrder = "ASC";
    } else {
      this.sortOrder = "DESC";
    }
    this.search();
  }

  searchWithFilters(): void {
    this.loading = true;
    this.searchParams = {
      tenantName: this.selectedTenant,
      businessPartnerId: this.id,
    };


    this.connectionPointService
      .search(
        this.searchParams,
        this.pageSize,
        this.currentPage,
        this.sortField + "," + this.sortOrder
      )
      .subscribe({
        next: (res: Page<ConnectionPointSearchResult>) => {
          this.connectionPointPage = res;
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Error Getting Connection Points",
          });
        },
      });


      

      this.connectionPointService
        .searchConnectionPoints(
          this.searchParams,
          this.pageSize,
          this.currentPage,
          this.sortField + "," + this.sortOrder
        )
        .subscribe({
          next: (res: Page<ConnectionPoint>) => {
            this.loading = false;
            this.connectionPointsPage = res;
          },
          error: (error) => {
            this.loading = false;
          },
        });



  }

  clearFilters(): void {
    this.selectedTenant = "";
    this.search();
  }

  filterTenants(event: AutoCompleteCompleteEvent) {
    if (event && event.query && this.selectedTenant.length > 2) {
      let filtered: any[] = [];
      let query = event.query;

      for (let i = 0; i < (this.tenants as any[]).length; i++) {
        let tenant = (this.tenants as any[])[i];
        if (tenant.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(tenant);
        }
      }
      this.tenantSuggestions = filtered;
    }
  }
  delete(event: MouseEvent | MenuItemCommandEvent) {


    let target: EventTarget | null = null;
  
    if (event instanceof MouseEvent) {
      target = event.target;
    } else if ('originalEvent' in event && event.originalEvent) {
      target = event.originalEvent.target;
    }


    this.confirmationService.confirm({
      target: target as EventTarget,
      message: "Do you want to delete this record?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",

      accept: () => {
        this.loading = true;
        const selectedIds = this.selectedCps.map((cp) => cp.id);
        this.connectionPointService.delete(selectedIds).subscribe({
          next: () => {
            this.selectedCps = [];
            this.messageService.add({
              severity: "info",
              summary: "Confirmed",
              detail: "Records deleted",
            });
            this.search();
          },
          error: (error) => {
            let detailMessage = "Error deleting records"; 
          if (error.error.message) {
              detailMessage = error.error.message;
            }
          this.messageService.add({
            severity: "error",
            summary: "Rejected",
            detail: detailMessage,
          });
          this.loading = false;
        },
        });
      },
    });
  }


  get deleteMenuItemVisible(): boolean {
    // Check if the user is an admin and there are selected sensors
    if (this.userIsAdmin && this.selectedCps) {
      // If no sensors are selected or more than one sensor is selected, hide the delete button
      if (this.selectedCps.length === 0) {
        return false;
      }
      // If only one sensor is selected, show the delete button
      return true;
    }
    // If the user is not an admin or there are no selected sensors, hide the delete button
    return false;
  }
  

  onRowSelect(event: any): void {
    this.updateMenuItems();
  }
  

  onRowUnselect(event: any): void {
    this.updateMenuItems();
  }














  exportToExcel(): void {
    this.loading = true;
    this.handleExport();
  }
  
  handleExport(): void {
    const connectionPoints = new Set<ConnectionPoint>(
      this.connectionPointsPage.content.map(cp => ({
        id: cp.id,
        revision: cp.revision,
        type: cp.type,
        name: cp.name,
        locationId: cp.locationId,
        facilityId: cp.facilityId,
        cellId: cp.cellId,
        operatorId: cp.operatorId,
        carparkType: cp.carparkType,
        lastModified: cp.lastModified,
        orderNumber: cp.orderNumber,
        technicalPlace: cp.technicalPlace,
        activatedAt: cp.activatedAt ? formatDate(cp.activatedAt, 'yyyy-MM-dd', 'en') : formatDate(new Date(), 'yyyy-MM-dd', 'en'),
        other: cp.other,
        withLeaveLoop: cp.withLeaveLoop,
        tenantName: cp.tenantName,
        geometryPath: cp.geometryPath,
        keycloakInboundUser: cp.keycloakInboundUser,
        businessPartnerId: cp.businessPartnerId,
        connectionPointConnectivity: cp.connectionPointConnectivity,
        connectionPointServices: cp.connectionPointServices
      }))
    );
    this.exportConnectionPointsToExcel(connectionPoints);
  }
  


  
  exportConnectionPointsToExcel(connectionPoints: Set<ConnectionPoint>): void {
    this.connectionPointService.exportToExcel(connectionPoints).subscribe(
      blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'connection-points.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Excel exported successfully.',
        });
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error exporting Excel: ' + error.message,
        });
      }
    );
  }





}
