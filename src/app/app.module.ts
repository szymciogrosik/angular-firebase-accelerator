import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatSliderModule} from '@angular/material/slider';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {routing} from './app-routing.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatListModule} from '@angular/material/list';
import {LayoutModule} from '@angular/cdk/layout';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {HomeComponent} from './home/home.component';
import {NavbarComponent} from './navbar/navbar.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {StatusComponent} from './status/status.component';
import {AssetsService} from "./_services/util/assets.service";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatLuxonDateModule} from "@angular/material-luxon-adapter";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatTabsModule} from "@angular/material/tabs";
import {PhotoSliderMainComponent} from './home/photo-slider-main/photo-slider-main.component';
import {CarouselModule} from "ngx-owl-carousel-o";
import {MainPageVideoComponent} from './home/main-page-video/main-page-video.component';
import {FormButtonsComponent} from './home/form-buttons/form-buttons.component';
import {FooterComponent} from './footer/footer.component';
import {AngularFireModule} from "@angular/fire/compat";
import {environment} from "../environments/environment";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {MatDialogModule} from "@angular/material/dialog";
import {NgOptimizedImage} from "@angular/common";
import {LoginComponent} from "./login/login.component";
import {AdminComponent} from "./admin/admin.component";
import {DetailsComponent} from "./home/details/details.component";
import {DialogComponent} from "./_shared-components/dialog/dialog.component";
import {MatTableModule} from "@angular/material/table";
import {SettingsComponent} from "./admin/settings/settings.component";
import {MatSortModule} from "@angular/material/sort";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {AutoResizeDirective} from "./_shared-components/auto-resize-directive.directive";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {AngularFireAnalyticsModule} from "@angular/fire/compat/analytics";
import {EmbeddedBrowserPopupComponent} from "./login/embedded-browser-popup/embedded-browser-popup.component";
import {UsersComponent} from "./admin/settings/users/users.component";
import {UserDetailsComponent} from "./admin/settings/users/user-details/user-details.component";
import {MatSelectModule} from "@angular/material/select";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    StatusComponent,
    PhotoSliderMainComponent,
    MainPageVideoComponent,
    FormButtonsComponent,
    FooterComponent,
    DetailsComponent,
    DialogComponent,
    LoginComponent,
    AdminComponent,
    SettingsComponent,
    AutoResizeDirective,
    EmbeddedBrowserPopupComponent,
    UsersComponent,
    UserDetailsComponent,
  ],
    imports: [
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAnalyticsModule,
        AngularFirestoreModule,
        BrowserModule,
        BrowserAnimationsModule,
        MatSliderModule,
        RouterModule,
        ReactiveFormsModule,
        HttpClientModule,
        routing,
        MatFormFieldModule,
        MatSnackBarModule,
        MatMenuModule,
        MatButtonModule,
        MatListModule,
        MatToolbarModule,
        LayoutModule,
        MatSidenavModule,
        MatIconModule,
        MatCardModule,
        MatInputModule,
        FormsModule,
        HttpClientModule,
        MatProgressSpinnerModule,
        MatDatepickerModule,
        MatLuxonDateModule,
        MatGridListModule,
        MatTabsModule,
        CarouselModule,
        MatDialogModule,
        NgOptimizedImage,
        MatTableModule,
        MatSortModule,
        MatButtonToggleModule,
        MatSlideToggleModule,
        MatSelectModule,
    ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, AssetsService.BASE_PATH + "i18n/", ".json");
}
