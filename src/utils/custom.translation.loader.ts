import {TranslateLoader} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AssetsService} from "../app/_services/util/assets.service";
import {environment} from "../environments/environment";

export class CustomTranslationLoader implements TranslateLoader {
  constructor(private http: HttpClient) {
  }

  getTranslation(lang: string): Observable<any> {
    const path = `${AssetsService.BASE_PATH}i18n/${lang}.json?v=${environment.buildVersion}`;
    return this.http.get(path);
  }
}
