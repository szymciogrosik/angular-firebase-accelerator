import {Injectable, inject} from '@angular/core';
import {TranslateService, Translation} from '@ngx-translate/core';
import {APP_CONFIG} from '../../app.config.token';
import {DateAdapter} from "@angular/material/core";
import {registerLocaleData} from "@angular/common";
import localePl from '@angular/common/locales/pl';
import localeEn from '@angular/common/locales/en';
import {LanguageEnum} from "./language-enum";
import {BehaviorSubject, firstValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CustomTranslateService {

  private selectedLanguage: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private appConfig = inject(APP_CONFIG);
  private translateService = inject(TranslateService);
  private dateAdapter = inject(DateAdapter<any>);

  constructor() {}

  public setLanguage(language: string): void {
    this.translateService.use(language);
    this.dateAdapter.setLocale(language);
    registerLocaleData(this.findApplicationLocalLanguage(language));
    localStorage.setItem(this.appConfig.selected_language_key, language);

    this.selectedLanguage.next(language);
  }

  private findApplicationLocalLanguage(language: string): any {
    switch (language) {
      case LanguageEnum.POLISH:
        return localePl;
      case LanguageEnum.ENGLISH:
        return localeEn;
      default:
        throw new Error("Language '" + language + "' is not supported");
    }
  }

  public get(key: string): string {
    return this.translateService.instant(key);
  }

  public getPromise(key: string): Promise<Translation> {
    return firstValueFrom(this.translateService.get(key));
  }

}
