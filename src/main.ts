import {enableProdMode} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {HttpClient, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {provideFirebaseApp, initializeApp} from '@angular/fire/app';
import {provideAuth} from '@angular/fire/auth';
import {getAuth} from 'firebase/auth';
import {provideFirestore, getFirestore} from '@angular/fire/firestore';
import {provideAnalytics, getAnalytics} from '@angular/fire/analytics';
import {importProvidersFrom} from '@angular/core';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {AppComponent} from './app/app.component';
import {routing} from './app/app-routing.module';
import {environment} from './environments/environment';
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {AssetsService} from "./app/_services/util/assets.service";
import {CustomCommonModule} from "./app/_imports/CustomCommon.module";

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideAnalytics(() => getAnalytics()),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(CustomCommonModule),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }),
      routing
    )
  ]
}).catch(error => {
  console.error("Init failed: " + error)
});

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, AssetsService.BASE_PATH + "i18n/", `.json?v=${environment.buildVersion}`);
}
