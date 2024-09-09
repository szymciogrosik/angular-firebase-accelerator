import {Component} from '@angular/core';
import {CustomTranslateService} from './_services/translate/custom-translate.service';
import {AngularFireAnalytics} from "@angular/fire/compat/analytics";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular';

  constructor(
    private translateService: CustomTranslateService,
    private analytics: AngularFireAnalytics
  ) {
    this.translateService.setLoadedOrDefaultLanguage();
    this.analytics.logEvent('app_loaded', {"component": "AppComponent"});
  }

}
