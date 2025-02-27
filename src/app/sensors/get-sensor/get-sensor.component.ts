import { routes } from "./../../app-routing.module";
import { BusinessPartnerNameId } from "./../../business-partners/model/business-partner-name-id";
import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Sensor } from "src/app/sensors/model/sensor";
import { ConnectionPoint } from "src/app/connection-points/model/connection-point";
import { BusinessPartner } from "src/app/business-partners/model/business-partner";
import { ConfirmationService, MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { KeycloakService } from "keycloak-angular";
import { SensorService } from "../service/sensor.service";
import { BusinessPartnerService } from "src/app/business-partners/service/business-partner.service";
import { ConnectionPointService } from "src/app/connection-points/service/connection-point.service";
import { AutoCompleteCompleteEvent } from "primeng/autocomplete";
import { ConnectionPointSearchResult } from "src/app/connection-points/model/connection-point-search-result";

@Component({
  selector: "app-get-sensor",
  templateUrl: "./get-sensor.component.html",
  styleUrl: "./get-sensor.component.scss",
})
export class GetSensorComponent {
  updateMode: boolean = false;
  id: string | null = "";
  sensor = new Sensor();
  selectedConnectionPoint: any='';
  selectedBusinessPartner: any ='';
  SerialNumberError: any;
  LaneNumberError: any;
  userIsAdmin: boolean = false;
  businessPartners: BusinessPartnerNameId[] = [];
  businessPartnerSuggestions: BusinessPartnerNameId[] = [];
  connectionPoints: ConnectionPointSearchResult[] = [];
  connectionPointsSuggestions: ConnectionPointSearchResult[] = [];
  withSensorApiKey: boolean = false;
  cpId: string | null = null;
  cpIdIsSelected: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private sensorService: SensorService,
    private connectionPointService: ConnectionPointService,
    private businessPartnerService: BusinessPartnerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private kc: KeycloakService
  ) {}

  ngOnInit(): void {
    this.userIsAdmin = this.kc.isUserInRole("SubAdmin");
    this.sensorService.getMode().subscribe({
      next: (res) => {
        this.withSensorApiKey = res;
        console.log(this.withSensorApiKey);
      },
      error: (err) => {
        console.log(
          "Failed to load connectivity mode . Default is without sensor api key"
        );
      },
    });
    this.id = this.route.snapshot.paramMap.get("id");
    this.cpId = this.route.snapshot.paramMap.get("cpId");

    if (this.id && this.id != "add") {
      this.spinner.show();
      this.updateMode = true;
      this.sensorService.getSensor(this.id).subscribe({
        next: (res: Sensor) => {
          this.sensor = res;
          this.connectionPointService
            .getConnectionPoint(this.sensor?.connectionPointId)
            .subscribe({
              next: (res: ConnectionPoint) => {
                this.selectedConnectionPoint = res;
                this.businessPartnerService
                  .getBusinessPartner(
                    this.selectedConnectionPoint.businessPartnerId
                  )
                  .subscribe({
                    next: (res: BusinessPartner) => {
                      this.selectedBusinessPartner = res;
                      this.spinner.hide();
                    },
                    error: (error) => {
                      this.spinner.hide();
                      this.messageService.add({
                        severity: "error",
                        summary: "Error",
                        detail: "Error getting business partner",
                      });
                    },
                  });
              },
              error: (error) => {
                this.spinner.hide();
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: "Error getting connection point",
                });
              },
            });
        },
        error: (error) => {
          this.spinner.hide();
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Error getting sensor",
          });
        },
      });
    } else if (this.cpId) {
      this.cpIdIsSelected = true;
      this.connectionPointService.getConnectionPoint(this.cpId).subscribe({
        next: (res: ConnectionPoint) => {
          this.selectedConnectionPoint = res;
          this.sensor.connectionPointId = res.id;
          this.sensor.locationId = res.locationId;
          this.businessPartnerService
            .getBusinessPartner(this.selectedConnectionPoint.businessPartnerId)
            .subscribe({
              next: (res: BusinessPartner) => {
                this.selectedBusinessPartner = res;
                this.spinner.hide();
              },
              error: (error) => {
                this.spinner.hide();
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: "Error getting business partner",
                });
              },
            });
        },
        error: (error) => {
          this.spinner.hide();
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Error getting connection point",
          });
        },
      });
    } else {
      this.businessPartnerService.getBusinessPartnersNamesIds().subscribe({
        next: (res: BusinessPartnerNameId[]) => {
          this.businessPartners = res;
        },
        error: () => {
          console.log("error fetching business partnerNames");
        },
      });
    }
  }
  generateApiKey() {
    this.sensorService.generateApiKey().subscribe({
      next: (res: string) => {
        console.log(res);
        this.sensor.apiKey = res;
      },
      error: (error) => {
        console.log("error generating api key");
        console.log(error);
      },
    });
  }
  UpdateSensor(updateForm: NgForm) {
    console.log("inside update");
    if (updateForm.valid) {
      this.spinner.show();
      this.sensorService
        .checkUniqueSensor(
          this.sensor.id,
          this.sensor.serialNumber,
          this.sensor.laneNumber
        )
        .subscribe({
          next: (response: any) => {
            const message = response["message"];
            if (message === "Sensor is unique.") {
              this.sensorService.Update(this.sensor).subscribe({
                next: (res) => {
                  if (!this.updateMode) {
                    console.log(res);
                    this.messageService.add({
                      severity: "success",
                      summary: "Success",
                      detail: "sensor added successfully",
                    });
                    setTimeout(() => {
                      this.spinner.hide();
                      this.router.navigate(["/sensors/" + res.id]);
                    }, 1500);
                  } else {
                    this.sensor = res;
                    this.spinner.hide();
                    this.messageService.add({
                      severity: "success",
                      summary: "Success",
                      detail: "sensor updated successfully",
                    });
                  }
                },
                error: (err) => {
                  this.spinner.hide();

                  if (this.updateMode) {
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail: "Error updating Sensor",
                    });
                    console.log(err);
                  } else {
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail: "Error adding Sensor",
                    });
                    console.log(err);
                  }
                },
              });
            }
          },
          error: (error) => {
            this.spinner.hide();
            if (error.error.message.includes("serial number")) {
              this.SerialNumberError = error.error.message;
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: this.SerialNumberError,
              });
            }
          },
        });
    } else {
      this.spinner.hide();
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Validation error occurred",
      });
    }
  }

  onSerialNumberChange() {
    this.sensorService
      .checkUniqueSensor(
        this.sensor.id,
        this.sensor.serialNumber,
        this.sensor.laneNumber
      )
      .subscribe({
        next: (response: any) => {
          const message = response["message"];
          if (message === "Sensor is unique.") {
            this.SerialNumberError = "";
          }
        },
        error: (error) => {
          if (error.error.message.includes("serial number")) {
            this.SerialNumberError = error.error.message;
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: this.SerialNumberError,
            });
          }
        },
      });
  }

  filterBusinessPartners(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.businessPartners as any[]).length; i++) {
      let bp = (this.businessPartners as any[])[i];
      if (bp.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(bp);
      }
    }
    this.businessPartnerSuggestions = filtered;
  }

  onSelectBusinessPartner() {
    this.businessPartnerService
      .getBusinessPartner(this.selectedBusinessPartner.id)
      .subscribe({
        next: (res) => {
          this.sensor.tenantName = res.tenantId;
          this.connectionPointService
            .getConnectionPointsByBPId(
              this.selectedBusinessPartner.id,
              "FACILITY"
            )
            .subscribe({
              next: (res) => {
                this.connectionPoints = res;
                console.log(this.connectionPoints);
                console.log(this.selectedBusinessPartner);
              },
              error: (err) => {
                console.log("error fetching connection points");
              },
            });
        },
        error: (err) => {
          console.log("error fetching business partner");
        },
      });
  }

  onSelectConnectionPoint() {
    console.log(this.selectedConnectionPoint);
    this.sensor.connectionPointId = this.selectedConnectionPoint.id;
    this.connectionPointService
      .getConnectionPoint(this.sensor.connectionPointId)
      .subscribe({
        next: (res: ConnectionPoint) => {
          this.sensor.locationId = res.locationId;
        },
        error: () => {
          console.log("error getting connection point");
        },
      });
  }

  filterConnectionPoints(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.connectionPoints as any[]).length; i++) {
      let cp = (this.connectionPoints as any[])[i];
      if (cp.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(cp);
      }
    }
    this.connectionPointsSuggestions = filtered;
  }
 

  deleteSensor(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Do you want to delete this Sensor ?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",
      accept: () => {
        this.spinner.show();
        this.sensorService.delete([this.sensor.id]).subscribe({
          next: (res) => {
            this.spinner.hide();
            this.router.navigate(["/sensors"]);
          },
          error: (error) => {
            this.spinner.hide();
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Error deleting sensor",
            });
          },
        });
      },
    });
  }
}
