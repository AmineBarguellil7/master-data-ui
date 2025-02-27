import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { ConnectionPoint } from "../model/connection-point";
import { ConnectionPointService } from "../service/connection-point.service";
import { BusinessPartner } from "src/app/business-partners/model/business-partner";
import { BusinessPartnerNameId } from "src/app/business-partners/model/business-partner-name-id";
import { NgForm } from "@angular/forms";
import { SensorService } from "src/app/sensors/service/sensor.service";

@Component({
  selector: "app-get-connection-point",
  templateUrl: "./get-connection-point.component.html",
  styleUrl: "./get-connection-point.component.scss",
})
export class GetConnectionPointComponent implements OnInit {
  updateMode: boolean = false;
  isDetails: boolean = true;
  isServices: boolean = false;
  isConnectivity: boolean = false;
  isSensors: boolean = false;
  id: string | null = "";
  connectionPoint: ConnectionPoint = new ConnectionPoint();
  selectedBusinessPartner: BusinessPartnerNameId = new BusinessPartnerNameId();

  addStage:number=0;
  withSensorApiKey:boolean=false
  constructor(
    private route: ActivatedRoute,
    private connectionPointService: ConnectionPointService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private sensorService:SensorService,


  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
    this.sensorService.getMode().subscribe({
      next:(res)=>{
        this.withSensorApiKey=res
      },
      error:(err)=>{
        console.log("Failed to load connectivity mode . Default is without sensor api key")
      }
    });
    if (this.id && this.id != "add") {
      this.updateMode = true;
      this.spinner.show();

      this.connectionPointService.getConnectionPoint(this.id).subscribe({
        next: (res: ConnectionPoint) => {
          this.spinner.hide();

          this.connectionPoint = res;
        },
        error: (error) => {
          this.spinner.hide();

          this.messageService.add({
            severity: "error",
            summary: "Rejected",
            detail: "Error getting Connection Point",
          });
        },
      });
    }
  }
  toDetails(): void {
    if (!this.isDetails) {
      this.isSensors = false;
      this.isServices = false;
      this.isConnectivity = false;
      this.isDetails = true;
    }
  }
  toServices(): void {
    if (!this.isServices) {
      this.isSensors = false;
      this.isConnectivity = false;
      this.isDetails = false;
      this.isServices = true;
    }
  }
  toConnectivity(): void {
    if (!this.isConnectivity) {
      this.isSensors = false;
      this.isDetails = false;
      this.isServices = false;
      this.isConnectivity = true;
    }
  }
  toSensors(): void {
    if (!this.isSensors) {
      this.isDetails = false;
      this.isServices = false;
      this.isConnectivity = false;
      this.isSensors = true;
    }
  }

}
