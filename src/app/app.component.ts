import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CustomTranslateService} from './_services/translate/custom-translate.service';
import {FooterComponent} from './footer/footer.component';
import {NavbarComponent} from './navbar/navbar.component';
import {Title} from '@angular/platform-browser';
import {TranslateModule} from '@ngx-translate/core';
import {RouterModule} from '@angular/router';
import {APP_CONFIG} from './app.config.token';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [FooterComponent, NavbarComponent, TranslateModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private readonly translateService = inject(CustomTranslateService);
  private readonly titleService = inject(Title);
  private readonly appConfig = inject(APP_CONFIG);

  constructor() {
    const savedLang = localStorage.getItem(this.appConfig.selected_language_key) || this.appConfig.default_language;
    this.translateService.setLanguage(savedLang);

    this.translateService.getPromise('page.title')
      .then(value => this.titleService.setTitle(value))
      .catch(err => console.error(err));
  }

}
