import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { KeycloakService } from "keycloak-angular";
import { ConfirmationService, MenuItem, MenuItemCommandEvent, MessageService } from "primeng/api";
import { AutoCompleteCompleteEvent } from "primeng/autocomplete";
import { TableLazyLoadEvent } from "primeng/table";
import { BusinessPartnerNameId } from "src/app/business-partners/model/business-partner-name-id";
import { BusinessPartnerService } from "src/app/business-partners/service/business-partner.service";
import { ConnectionPointSearchResult } from "src/app/connection-points/model/connection-point-search-result";
import { SensorSearchResult } from "src/app/sensors/model/sensor-search-result";
import { SensorService } from "src/app/sensors/service/sensor.service";
import { Column } from "src/app/utils/column";
import { Page } from "src/app/utils/page";

@Component({
  selector: "app-cp-sensors",
  templateUrl: "./cp-sensors.component.html",
  styleUrl: "./cp-sensors.component.scss",
})
export class CpSensorsComponent implements OnInit {
  userIsAdmin: boolean = false;
  tenants: string[] = [];
  id: string | null = "";
  sensorPage: Page<SensorSearchResult> = new Page<SensorSearchResult>();
  connectionPointList!: ConnectionPointSearchResult[];
  cols!: Column[];
  loading: boolean = true;
  selectedColumns!: Column[];
  pageSize = 10; // Number of items per page
  currentPage = 0; // Current page number
  sortField = "serialNumber";
  connectionPointsortField = "name";
  sortOrder = "DESC";
  tenantSuggestions: string[] = [];
  selectedTenant!: string;
  businessPartnerSuggestions: BusinessPartnerNameId[] = [];
  businessPartner: any;
  selectedBusinessPartner: any;
  selectedBusinessPartnerId!: string;
  selectedSensors!: SensorSearchResult[];


  items: MenuItem[] = [];

  constructor(
    private sensorService: SensorService,
    private route: ActivatedRoute,
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

    this.search();

    this.cols = [
      { field: "serialNumber", header: "Serial Number" },
      { field: "locationId", header: "LocationId" },
      { field: "laneNumber", header: "Lane Number" },
      { field: "direction", header: "Direction" },
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
    this.sensorService
      .search(
        { connectionPointId: this.id },
        this.pageSize,
        this.currentPage,
        this.sortField + "," + this.sortOrder
      )
      .subscribe({
        next: (res: Page<SensorSearchResult>) => {
          this.sensorPage = res;
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Error getting sensors",
          });
        },
      });
  }

  onPageChange(event: TableLazyLoadEvent) {
    this.currentPage = event.first ?? 0;
    this.pageSize = event.rows ?? 10;
    if (Array.isArray(event.sortField)) {
      this.sortField = event.sortField[0] ?? "serialNumber"; // Select the first item or provide a default value
    } else {
      this.sortField = event.sortField ?? "serialNumber"; // Use the value directly or provide a default value
    }
    if (event.sortOrder == 1) {
      this.sortOrder = "ASC";
    } else {
      this.sortOrder = "DESC";
    }
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

  clearFilters(): void {
    this.selectedTenant = "";
    this.search();
  }

  searchWithFilters(): void {
    this.loading = true;
    this.sensorService
      .search(
        {
          tenantName: this.selectedTenant,
          connectionPointId: this.id,
        },
        this.pageSize,
        this.currentPage,
        this.sortField + "," + this.sortOrder
      )
      .subscribe({
        next: (res: Page<SensorSearchResult>) => {
          this.sensorPage = res;
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Error getting sensors",
          });
        },
      });
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
        const selectedSensorIds = this.selectedSensors.map(
          (sensor) => sensor.id
        );
        this.sensorService.delete(selectedSensorIds).subscribe({
          next: () => {
            this.selectedSensors = [];
            this.messageService.add({
              severity: "info",
              summary: "Confirmed",
              detail: "Records deleted",
            });
            this.search();
          },
          error: (error) => {
            this.loading = false;
            this.messageService.add({
              severity: "error",
              summary: "Rejected",
              detail: "Error deleting records",
            });
          },
        });
      },
    });
  }



  get deleteMenuItemVisible(): boolean {
    // Check if the user is an admin and there are selected sensors
    if (this.userIsAdmin && this.selectedSensors) {
      // If no sensors are selected or more than one sensor is selected, hide the delete button
      if (this.selectedSensors.length === 0) {
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

}
