import {Component, signal} from '@angular/core';
import {AccessRoleService} from "../../_services/auth/access-role.service";
import {UsersComponent} from "./users/users.component";
import {AccessRole} from "../../_models/user/access-role";
import {PublicSettingsComponent} from "./public-settings/public-settings.component";
import {TranslateModule} from '@ngx-translate/core';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  standalone: true,
  imports: [UsersComponent, PublicSettingsComponent, TranslateModule, MatTabsModule],
})
export class SettingsComponent {
  protected isAuthorized = signal<boolean>(false);

  constructor(
    private accessService: AccessRoleService
  ) {
    this.accessService.isAuthorized(AccessRole.ADMIN_PAGE_ACCESS)
      .then((isAuthorized: boolean): void => {
        if (isAuthorized) {
          this.isAuthorized.set(true);
        }
      });
  }

}
