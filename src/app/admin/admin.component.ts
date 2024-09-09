import {Component} from '@angular/core';
import {AngularFireAnalytics} from "@angular/fire/compat/analytics";
import {AccessRoleService} from "../_services/auth/access-role.service";
import {AccessPage} from "../_services/auth/access-page";
import {AuthService} from "../_services/auth/auth.service";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  protected readonly environment = environment;
  protected loggedUserName: string = '';
  protected statisticVisible: boolean = false;
  protected registrationDataYoungVisible: boolean = false;
  protected registrationDataAdultVisible: boolean = false;
  protected registrationDataStaffVisible: boolean = false;
  protected exportVisible: boolean = false;
  protected settingsVisible: boolean = false;

  constructor(
    private analytics: AngularFireAnalytics,
    private accessService: AccessRoleService,
    private authService: AuthService
  ) {
    this.analytics.logEvent('app_admin_panel_loaded', {"component": "AdminComponent"});

    this.authService.loggedUser().subscribe({
      next: user => {
        if (user !== null) {
          this.loggedUserName = user.firstName;
        } else {
          this.loggedUserName = '';
        }
      },
      error: (err) => {
        this.loggedUserName = '';
        console.error(err);
      }
    });

    this.accessService.isAuthorizedToSeePage(AccessPage.STATISTICS)
      .then((isAuthorized: boolean): void => {
        if (isAuthorized) {
          this.statisticVisible = true;
        }
      });
    this.accessService.isAuthorizedToSeePage(AccessPage.REGISTERED_DATA)
      .then((isAuthorized: boolean): void => {
        if (isAuthorized) {
          this.registrationDataYoungVisible = true;
          this.registrationDataAdultVisible = true;
          this.registrationDataStaffVisible = true;
        }
      });
    this.accessService.isAuthorizedToSeePage(AccessPage.REGISTERED_DATA_UPDATE)
      .then((isAuthorized: boolean): void => {
        if (isAuthorized) {
          this.exportVisible = true;
        }
      });
    this.accessService.isAuthorizedToSeePage(AccessPage.SETTINGS)
      .then((isAuthorized: boolean): void => {
        if (isAuthorized) {
          this.settingsVisible = true;
        }
      });
  }
}
