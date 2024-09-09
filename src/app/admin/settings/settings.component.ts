import {Component} from '@angular/core';
import {AccessRoleService} from "../../_services/auth/access-role.service";
import {AccessPage} from "../../_services/auth/access-page";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  protected isAuthorized: boolean = false;

  constructor(
    private accessService: AccessRoleService
  ) {
    this.accessService.isAuthorizedToSeePage(AccessPage.SETTINGS)
      .then((isAuthorized: boolean): void => {
        if (isAuthorized) {
          this.isAuthorized = true;
        }
      });
  }

}
