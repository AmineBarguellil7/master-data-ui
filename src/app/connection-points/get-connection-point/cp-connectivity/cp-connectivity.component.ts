import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { NgForm } from "@angular/forms";
import { MessageService } from "primeng/api";
import { ConnectionPoint } from "src/app/connection-points/model/connection-point";
import { ConnectionPointConnectivity } from "src/app/connection-points/model/connection-point-connectivity";
import { NgxSpinnerService } from "ngx-spinner";
import { KeycloakService } from "keycloak-angular";
import { ConnectionPointService } from "../../service/connection-point.service";
import { BusinessPartnerNameId } from "src/app/business-partners/model/business-partner-name-id";
import { Router } from "@angular/router";
import { InboundConnectivityCredentials } from "../../model/inbound-connectivity-credentials";
import { OutboundConnectivityCredentials } from "../../model/outbound-connectivity-credentials";
import { ToasterHostDirective } from "@coreui/angular";

@Component({
  selector: "app-cp-connectivity",
  templateUrl: "./cp-connectivity.component.html",
  styleUrl: "./cp-connectivity.component.scss",
})
export class CpConnectivityComponent implements OnInit {
  userIsAdmin: boolean = false;
  @Input() updateMode: boolean = false;
  id: string | null = "";
  @Input() connectionPoint!: ConnectionPoint;
  @Output() connectionPointChange = new EventEmitter<ConnectionPoint>();
  connectivityType = "manual";
  connectionPointConnectivity: ConnectionPointConnectivity | undefined =
    new ConnectionPointConnectivity();
    @Input()addStage!:number;
@Output()addStageChange=    new EventEmitter<number>();
  constructor(
    private connectionPointService: ConnectionPointService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private kc: KeycloakService,
    private router: Router,

  ) {}

  ngOnInit(): void {
    this.userIsAdmin = this.kc.isUserInRole("SubAdmin");
    console.log(this.connectionPointConnectivity);

    if(this.connectionPoint.connectionPointConnectivity!= undefined){
      this.connectionPointConnectivity=this.connectionPoint.connectionPointConnectivity;
      this.setConnectivity()
      console.log(this.connectionPointConnectivity);

    }
    
  }

  update(updateCPForm: NgForm): void {
    if (updateCPForm.valid) {
      if(this.connectionPoint.carparkType==''){
        delete this.connectionPoint.carparkType;
      }
      this.spinner.show();

      this.connectionPoint.connectionPointConnectivity =
        this.connectionPointConnectivity;
      this.checkConnectivity();
      if (this.updateMode) {
        this.connectionPointService.update(this.connectionPoint).subscribe({
          next: (result: ConnectionPoint) => {
            this.spinner.hide();
            this.connectionPointService.getConnectionPoint(result.id).subscribe(
              {
                next :(res:ConnectionPoint)=>{
                  this.connectionPoint = res;
                  console.log(this.connectionPoint);
                  if (this.connectionPoint.connectionPointConnectivity != null) {
      
                    this.connectionPointConnectivity =
                      this.connectionPoint.connectionPointConnectivity;
                      console.log(this.connectionPoint);
                  }
                  this.connectionPointChange.emit(this.connectionPoint  );

                  this.messageService.add({
                    severity: "info",
                    summary: "Updated",
                    detail: "Connection Point updated",
                  });
                },error:(err)=>{
                  console.log("error getting connection point")
                }
              }
            )
            
          },
          error: (error) => {
            this.spinner.hide();
  
            this.messageService.add({
              severity: "error",
              summary: "Rejected",
              detail: "Error Updating Connection Point",
            });
          },
        });
      }
      else{
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
            }, 1500);
          },
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
      
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Invalid",
        detail: "Invalid Form",
      });
    }
  }
  onConnectionPointChange(newConnectionPoint: ConnectionPoint) {
    this.connectionPointChange.emit(newConnectionPoint);
  }
  
  checkConnectivity() {
    if (this.connectionPoint.connectionPointConnectivity) {
        if (this.connectionPoint.type == "FACILITY") {
        delete  this.connectionPoint.connectionPointConnectivity.outboundCredentials ;
        } else if (this.connectionPoint.type == "ECONN_SERVER") {
         delete  this.connectionPoint.connectionPointConnectivity.inboundCredentials ;
        }
      }
    }
  setConnectivity(){
    if(!this.connectionPoint.connectionPointConnectivity){
      this.connectionPointConnectivity=new ConnectionPointConnectivity();
      console.log("connectivity null");
      console.log(this.connectionPoint.connectionPointConnectivity);
    }
    else if (this.connectionPointConnectivity &&!this.connectionPoint.connectionPointConnectivity.inboundCredentials){
      this.connectionPointConnectivity.inboundCredentials=new InboundConnectivityCredentials();
      console.log("inbound null");
      console.log(this.connectionPoint.connectionPointConnectivity);
    }
    else if (this.connectionPointConnectivity &&!this.connectionPoint.connectionPointConnectivity.outboundCredentials){
      this.connectionPointConnectivity.outboundCredentials=new OutboundConnectivityCredentials();
      console.log("outbound null");
      console.log(this.connectionPoint.connectionPointConnectivity);
    }
  }
  previous(){
    this.addStage=1;
    this.addStageChange.emit(this.addStage);
  }
}
