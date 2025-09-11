import {Component} from '@angular/core';
import {AccessRoleService} from "../../_services/auth/access-role.service";
import {AccessPageEnum} from "../../_services/auth/access-page-enum";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.scss',
    standalone: false
})
export class SettingsComponent {
  protected isAuthorized: boolean = false;

  constructor(
    private accessService: AccessRoleService
  ) {
    this.accessService.isAuthorizedToSeePage(AccessPageEnum.SETTINGS)
      .then((isAuthorized: boolean): void => {
        if (isAuthorized) {
          this.isAuthorized = true;
        }
      });
  }

}
