import {Component, OnInit} from '@angular/core';
import {RedirectionEnum} from '../../utils/redirection.enum';
import {CustomTranslateService} from '../_services/translate/custom-translate.service';
import {LanguageEnum} from "../_services/translate/language-enum";
import {ActiveTabService} from "../_services/util/active-tab.service";
import {ScrollService} from "../_services/util/scroll.service";
import {AuthService} from "../_services/auth/auth.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  protected readonly LanguageEnum = LanguageEnum;
  protected readonly rp = RedirectionEnum;

  constructor(
    public activeTabService: ActiveTabService,
    public translateService: CustomTranslateService,
    private scrollService: ScrollService,
    public authService: AuthService
  ) {
  }

  ngOnInit(): void { }

  scrollToWhatBKIs(): void {
    this.scrollService.requestScrollTo("whatBKIsId");
  }

  scrollToBKProgress(): void {
    this.scrollService.requestScrollTo("bkProgressId");
  }

  scrollToRegistrationBoth(): void {
    this.scrollService.requestScrollTo("registrationHeader");
  }

  scrollToSupportUs(): void {
    this.scrollService.requestScrollTo("supportUsContainer");
  }

  logout(): void {
    this.authService.logout(true);
  }

}
