import {Component, OnInit} from '@angular/core';
import {RedirectionEnum} from '../../utils/redirection.enum';
import {CustomTranslateService} from '../_services/translate/custom-translate.service';
import {LanguageEnum} from '../_services/translate/language-enum';
import {AuthService} from '../_services/auth/auth.service';
import {AccessRoleService} from '../_services/auth/access-role.service';
import {AccessRole} from '../_models/user/access-role';
import {CustomUser} from '../_models/user/custom-user';
import {Router, RouterModule} from '@angular/router';
import {ThemeService} from '../_services/util/theme.service';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterModule,
    MatToolbarModule
  ]
})
export class NavbarComponent implements OnInit {
  protected readonly LanguageEnum = LanguageEnum;
  protected readonly rp = RedirectionEnum;

  constructor(
    protected translateService: CustomTranslateService,
    protected authService: AuthService,
    private accessService: AccessRoleService,
    private router: Router,
    public themeService: ThemeService
  ) {
  }

  protected isAdmin = toSignal(this.accessService.isAuthorized$(AccessRole.ADMIN_PAGE_ACCESS));
  protected currentUser = this.authService.currentUser;
  protected isDarkTheme = toSignal(this.themeService.isDarkTheme$);
  protected allowDarkMode = toSignal(this.themeService.allowDarkMode$);
  protected isAuthenticated = this.authService.isLoggedIn;

  ngOnInit(): void {
  }

  logout(): void {
    this.authService.logout(true);
  }

  navigateToAdminPanel(): void {
    this.router.navigate(['/' + RedirectionEnum.ADMIN]);
  }

  navigateToProfile(): void {
    this.router.navigate(['/' + RedirectionEnum.PROFILE]);
  }

  navigateToLogin(): void {
    this.router.navigate(['/' + RedirectionEnum.LOGIN]);
  }

  protected readonly AccessRoleService = AccessRoleService;
  protected readonly AccessRole = AccessRole;
}
