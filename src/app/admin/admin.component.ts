import {Component, inject, signal} from '@angular/core';
import {AccessRoleService} from "../_services/auth/access-role.service";
import {AuthService} from "../_services/auth/auth.service";
import {APP_CONFIG} from '../app.config.token';
import {SettingsComponent} from "./settings/settings.component";
import {AccessRole} from "../_models/user/access-role";
import {TranslateModule} from '@ngx-translate/core';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  standalone: true,
  imports: [SettingsComponent, TranslateModule, MatCardModule, MatTabsModule, MatIconModule],
})
export class AdminComponent {
  protected readonly environment = inject(APP_CONFIG);
  protected loggedUserName = signal<string>('');
  protected settingsVisible = signal<boolean>(false);

  constructor(
    private accessService: AccessRoleService,
    private authService: AuthService
  ) {
    this.authService.loggedUser().subscribe({
      next: user => {
        if (user !== null) {
          this.loggedUserName.set(user.firstName);
        } else {
          this.loggedUserName.set('');
        }
      },
      error: (err) => {
        this.loggedUserName.set('');
        console.error(err);
      }
    });

    this.accessService.isAuthorized(AccessRole.ADMIN_PAGE_ACCESS)
      .then((isAuthorized: boolean): void => {
        if (isAuthorized) {
          this.settingsVisible.set(true);
        }
      });
  }
}
