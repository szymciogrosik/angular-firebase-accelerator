import {Component, OnInit} from '@angular/core';
import {RedirectionEnum} from '../../utils/redirection.enum';
import {CustomTranslateService} from '../_services/translate/custom-translate.service';
import {LanguageEnum} from "../_services/translate/language-enum";
import {AuthService} from "../_services/auth/auth.service";
import {CustomCommonModule} from "../_imports/CustomCommon.module";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [CustomCommonModule],
})
export class NavbarComponent implements OnInit {
  protected readonly LanguageEnum = LanguageEnum;
  protected readonly rp = RedirectionEnum;

  constructor(
    public translateService: CustomTranslateService,
    public authService: AuthService
  ) {
  }

  ngOnInit(): void { }

  logout(): void {
    this.authService.logout(true);
  }

}
