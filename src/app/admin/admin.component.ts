import {Component} from '@angular/core';
import {AngularFireAnalytics} from "@angular/fire/compat/analytics";
import {AccessRoleService} from "../_services/auth/access-role.service";
import {AccessPageEnum} from "../_services/auth/access-page-enum";
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

    this.accessService.isAuthorizedToSeePage(AccessPageEnum.SETTINGS)
      .then((isAuthorized: boolean): void => {
        if (isAuthorized) {
          this.settingsVisible = true;
        }
      });
  }
}
