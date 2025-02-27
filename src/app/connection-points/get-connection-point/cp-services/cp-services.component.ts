import { ConnectionPoint } from "../../model/connection-point";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { KeycloakService } from "keycloak-angular";
import { ConnectionPointService } from "../../service/connection-point.service";
import { BusinessPartnerNameId } from "src/app/business-partners/model/business-partner-name-id";
import { Router } from "@angular/router";
import { SensorService } from "src/app/sensors/service/sensor.service";

@Component({
  selector: "app-cp-services",
  templateUrl: "./cp-services.component.html",
  styleUrl: "./cp-services.component.scss",
})
export class CpServicesComponent implements OnInit {
  userIsAdmin: boolean = false;
  id: string | null = "";
  slectedServices: any[] = [];
  @Input() connectionPoint!: ConnectionPoint;
  @Output() connectionPointChange = new EventEmitter<ConnectionPoint>();
  @Input() updateMode: boolean = false;
  @Input()addStage!:number;
@Output()addStageChange=    new EventEmitter<number>();
withSensorApiKey:boolean=false;
  capacity = "NONE";
  carpark = "NONE";
  customer = "NONE";
  visitor = "NONE";
  onlineAuth = "NONE";
  pam = "NONE";
  sales = "NONE";
  tariff = "NONE";
  constructor(
    private connectionPointService: ConnectionPointService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private kc: KeycloakService,
    private router:Router,
    private sensorService:SensorService
  ) {}

  ngOnInit(): void {
    this.userIsAdmin = this.kc.isUserInRole("SubAdmin");
    this.sensorService.getMode().subscribe({
      next:(res)=>{
        this.withSensorApiKey=res
        console.log(this.withSensorApiKey)
      },
      error:(err)=>{
        console.log("Failed to load connectivity mode . Default is without sensor api key")
      }
    });
    this.spinner.show();

    if (this.connectionPoint.type == "FACILITY") {
      this.onlineAuth = "CONSUMER";
    } else  {
      this.onlineAuth = "NONE";
    }
    this.setConnectionPointServices();
    this.spinner.hide();
  }

  update(): void {
    if(this.connectionPoint.carparkType==''){
      delete this.connectionPoint.carparkType;
    }
    this.buildServices();
if(!this.updateMode && ((this.connectionPoint.type=='FACILITY' &&!this.withSensorApiKey)||this.connectionPoint.type=='ECONN_SERVER')){
  this.connectionPointChange.emit(this.connectionPoint);
  this.addStage=2;
  this.addStageChange.emit(this.addStage);
}
else if(this.updateMode){
  this.spinner.show();
 delete this.connectionPoint.connectionPointConnectivity;

    this.connectionPointService.update(this.connectionPoint).subscribe({
      next: (result: ConnectionPoint) => {
        this.connectionPoint = result;
        this.connectionPointService
          .getConnectionPoint(this.connectionPoint.id)
          .subscribe({
            next: (res: ConnectionPoint) => {
              this.connectionPoint = res;
              this.spinner.hide();
              this.connectionPointChange.emit(this.connectionPoint  );

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

        this.messageService.add({
          severity: "info",
          summary: "Updated",
          detail: "Connection Point updated",
        });
      },
      error: (error) => {
        this.spinner.hide();
        this.messageService.add({
          severity: "error",
          summary: "Rejected",
          detail: "Error Updating Connection Point",
        });
      },
    });}
    else{
      delete this.connectionPoint.connectionPointConnectivity;
      this.connectionPointService.add(this.connectionPoint).subscribe({
        next: (result: ConnectionPoint) => {
          this.messageService.add({
            severity: "info",
            summary: "Added",
            detail: "Connection Point added",
          });
          setTimeout(() => {
            this.spinner.hide();
            this.router.navigate(['/connectionpoints/'+result.id]);

          }, 1500);        },
        error: (error) => {
          this.spinner.hide();

          this.messageService.add({
            severity: "error",
            summary: "Rejected",
            detail: "Error adding Connection Point",
          });
        },
      });
    }
  }

  setConnectionPointServices(): void {
    if (this.connectionPoint) {
      for (const cpService of this.connectionPoint.connectionPointServices) {
        //Capacity
        if (cpService.serviceId == "34ce19aa-78c0-4151-8181-396968476154") {
          this.capacity = cpService.endpointRole;
        }
        //Carpark
        if (cpService.serviceId == "64ce19aa-78c0-4151-8181-396968476152") {
          this.carpark = cpService.endpointRole;
        }
        //Customer / contracts
        if (cpService.serviceId == "54ce19aa-78c0-4151-8181-396968476153") {
          this.customer = cpService.endpointRole;
        }
        //Evopark
        if (cpService.serviceId == "6da0c851-57bc-455f-8c0e-6a2497b5d9b9") {
          this.visitor = cpService.endpointRole;
        }

        //online auth
        if (cpService.serviceId == "f0ddd6b9-4789-4393-96e8-a35eb9678c0a") {
          this.onlineAuth = cpService.endpointRole;
        }
        //Pam
        if (cpService.serviceId == "79ce19aa-78c0-4151-8181-396968478152") {
          this.pam = cpService.endpointRole;
        }
        //Tariff
        if (cpService.serviceId == "36ce19aa-68c0-4151-8281-396968476152") {
          this.tariff = cpService.endpointRole;
        }
      }
    }
  }
  buildServices(): void {
    this.slectedServices = [];
    if (this.capacity != "NONE") {
      var service = {
        serviceName: "Capacity Management",
        endpointRole: this.capacity,
        serviceId: "34ce19aa-78c0-4151-8181-396968476154",
      };
      this.slectedServices.push(service);
    }
    if (this.carpark != "NONE") {
      var service = {
        serviceName: "Car Park Information",
        endpointRole: this.carpark,
        serviceId: "64ce19aa-78c0-4151-8181-396968476152",
      };
      this.slectedServices.push(service);
    }
    if (this.customer != "NONE") {
      var service = {
        serviceName: "Customer/Contracts",
        endpointRole: this.customer,
        serviceId: "54ce19aa-78c0-4151-8181-396968476153",
      };
      this.slectedServices.push(service);
    }
    if (this.visitor != "NONE") {
      var service = {
        serviceName: "Evopark visitor Management",
        endpointRole: this.visitor,
        serviceId: "6da0c851-57bc-455f-8c0e-6a2497b5d9b9",
      };
      this.slectedServices.push(service);
    }

    if (this.onlineAuth != "NONE") {
      var service = {
        serviceName: "Online Authorization",
        endpointRole: this.onlineAuth,
        serviceId: "f0ddd6b9-4789-4393-96e8-a35eb9678c0a",
      };
      this.slectedServices.push(service);
    }

    if (this.pam != "NONE") {
      var service = {
        serviceName: "Product Administration Management",
        endpointRole: this.pam,
        serviceId: "79ce19aa-78c0-4151-8181-396968478152",
      };
      this.slectedServices.push(service);
    }
    if (this.tariff != "NONE") {
      var service = {
        serviceName: "Tariff Engine",
        endpointRole: this.tariff,
        serviceId: "36ce19aa-68c0-4151-8281-396968476152",
      };
      this.slectedServices.push(service);
    }
    this.connectionPoint.connectionPointServices = this.slectedServices;
  }
  onConnectionPointChange(newConnectionPoint: ConnectionPoint) {
    this.connectionPointChange.emit(newConnectionPoint);
  }
  previous(){
    this.addStage=0;
    this.addStageChange.emit(this.addStage);
  }

}
