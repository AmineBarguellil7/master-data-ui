import { Component, Input , Output, EventEmitter } from '@angular/core';


import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { KeycloakService } from 'keycloak-angular';


@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {

  @Input() sidebarId: string = "sidebar";
  @Output() sidebarToggled = new EventEmitter<boolean>();

  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)
  userName: string | undefined;

  constructor(private classToggler: ClassToggleService , private keycloakService: KeycloakService) {
    super();
  }


  updateUserInfo() {
    if (this.keycloakService.isLoggedIn()) {
      this.keycloakService.loadUserProfile().then(() => {
        this.userName = this.keycloakService.getUsername();
      }).catch(error => console.error('Error loading user profile', error));
    }
  }

  ngOnInit() {
    this.updateUserInfo();
  }

  toggleSidebar() {
    this.sidebarToggled.emit();
  }

  
  logout() {
    this.keycloakService.logout();
  }

}