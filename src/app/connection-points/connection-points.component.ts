import { ConnectionPointService } from "./service/connection-point.service";
import { Page } from "./../utils/page";
import { Column } from "./../utils/column";
import { Component, OnInit } from "@angular/core";
import { ConfirmationService, MenuItem, MenuItemCommandEvent, MessageService } from "primeng/api";
import { TableLazyLoadEvent } from "primeng/table";
import { ConnectionPointSearchResult } from "./model/connection-point-search-result";
import { BusinessPartnerService } from "../business-partners/service/business-partner.service";
import { BusinessPartnerNameId } from "../business-partners/model/business-partner-name-id";
import { AuthGuard } from "../guards/auth.guard";
import { KeycloakService } from "keycloak-angular";
import { AutoCompleteCompleteEvent } from "primeng/autocomplete";
import { ConnectionPoint } from "./model/connection-point";
import { formatDate } from "@angular/common";

@Component({
  selector: "app-connection-points",
  templateUrl: "./connection-points.component.html",
  styleUrl: "./connection-points.component.scss",
})
export class ConnectionPointsComponent implements OnInit {
  userIsAdmin: boolean = false;
  businessPartnerNameIds: BusinessPartnerNameId[] = [];
  connectionPointPage: Page<ConnectionPointSearchResult> =
    new Page<ConnectionPointSearchResult>();


  connectionPointsPage : Page<ConnectionPoint> = new Page<ConnectionPoint>();  

  cols!: Column[];
  selectedColumns!: Column[];
  pageSize = 10; // Number of items per page
  currentPage = 0; // Current page number
  visiblePages = [1, 2, 3]; // Initial visible page numbers
  sortField = "name";
  sortOrder = "DESC";
  selectedBusinessPartner: any;
  selectedTenant = "";
  tenants = [""];
  searchParams: any = {
    tenantName: this.selectedTenant,
  };
  skeleton = [1, 2, 3, 4];
  selectedCps!: ConnectionPointSearchResult[];
  loading: boolean = true;
  tenantSuggestions: string[] = [];
  businessPartnerSuggestions: BusinessPartnerNameId[] = [];
  constructor(
    private connectionPointService: ConnectionPointService,
    private businesspartnerService: BusinessPartnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authGuard: AuthGuard,
    private kc: KeycloakService
  ) {}



  items: MenuItem[] = [];

  ngOnInit(): void {
    this.userIsAdmin = this.kc.isUserInRole("SubAdmin");
    this.businesspartnerService.getBusinessPartnersNamesIds().subscribe({
      next: (res: BusinessPartnerNameId[]) => {
        this.businessPartnerNameIds = res;
      },
      error: () => {
        console.log("error fetching business partnerNames");
      },
    });
    this.businesspartnerService.getTenants().subscribe({
      next: (res: string[]) => {
        this.tenants = res;
      },
      error: () => {
        console.log("error fetching business partnerNames");
      },
    });

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
        {},
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
            detail: "Error getting connection points",
          });
        },
      });


      this.connectionPointService
      .searchConnectionPoints(
        {},
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
          this.loading = false;
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Error getting connection points",
          });
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
    var id: String | undefined;
    this.loading = true;

    // If the business partner name selected has no corresponding id then return an empty page
    // this is because when you type a name that does not exist in the suggestions instance selectedBusinessPartner will be a string with the value of that name without id
    if (
      this.selectedBusinessPartner &&
      this.selectedBusinessPartner.id == undefined
    ) {
      id = this.getIdFromName(
        this.selectedBusinessPartner,
        this.businessPartnerNameIds
      );
      if (id == undefined) {
        this.connectionPointPage = new Page<ConnectionPointSearchResult>();
        this.connectionPointsPage = new Page<ConnectionPoint>();
        this.loading = false;
      } else {
        this.searchParams = {
          tenantName: this.selectedTenant,
          businessPartnerId: id,
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
                detail: "Error getting connection points",
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
              this.connectionPointsPage = res;
              this.loading = false;
            },
            error: (error) => {
              this.loading = false;
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Error getting connection points",
              });
            },
          });

      }
    } else {
      if (
        this.selectedBusinessPartner &&
        this.selectedBusinessPartner.id &&
        this.selectedBusinessPartner.id != ""
      ) {
        this.searchParams = {
          tenantName: this.selectedTenant,
          businessPartnerId: this.selectedBusinessPartner.id,
        };
      } else {
        this.searchParams = {
          tenantName: this.selectedTenant,
        };
      }


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
              detail: "Error getting connection points",
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
            this.connectionPointsPage = res;
            this.loading = false;
          },
          error: (error) => {
            this.loading = false;
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Error getting connection points",
            });
          },
        });

    }
  }



  clearFilters(): void {
    this.selectedBusinessPartner = { id: "", name: "" };
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

  filterBusinessPartners(event: AutoCompleteCompleteEvent) {
    if (event && event.query && this.selectedBusinessPartner.length > 2) {
      let filtered: any[] = [];
      let query = event.query;

      for (let i = 0; i < (this.businessPartnerNameIds as any[]).length; i++) {
        let bp = (this.businessPartnerNameIds as any[])[i];
        if (bp.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(bp);
        }
      }
      this.businessPartnerSuggestions = filtered;
    }
  }

  // Define a function to retrieve the ID from a name
  getIdFromName(
    name: string,
    businessPartners: BusinessPartnerNameId[]
  ): string | undefined {
    // Iterate through the array of BusinessPartnerNameId objects
    for (const partner of businessPartners) {
      // Check if the name matches the current object's name
      if (partner.name === name) {
        // If found, return the corresponding ID
        return partner.id;
      }
    }
    // If the name is not found, return undefined
    return undefined;
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
