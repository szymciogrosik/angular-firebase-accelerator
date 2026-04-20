import {Component, computed, inject} from '@angular/core';
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
  protected settingsVisible = inject(AccessRoleService).isAuthorizedSignal(AccessRole.ADMIN_PAGE_ACCESS);
  protected loggedUserName = computed(() => this.authService.currentUser()?.firstName ?? '');

  constructor(
    private accessService: AccessRoleService,
    private authService: AuthService
  ) {}
}
