import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {RedirectionEnum} from '../utils/redirection.enum';
import {StatusComponent} from "./status/status.component";
import {RegistrationAdultComponent} from "./registration/registration-adult/registration-adult.component";
import {RegistrationYoungComponent} from "./registration/registration-young/registration-young.component";
import {YoungStatueComponent} from "./home/statue/young-statue/young-statue.component";
import {AdultStatueComponent} from "./home/statue/adult-statue/adult-statue.component";
import {registrationEnabledGuard} from "./_services/guard/registration-enabled.guard";
import {LoginComponent} from "./login/login.component";
import {AdminComponent} from "./admin/admin.component";
import {adminGuard} from "./_services/guard/admin.guard";
import {RegistrationStaffComponent} from "./registration/registration-staff/registration-staff.component";

const appRoutes: Routes = [
  {
    path: RedirectionEnum.HOME,
    component: HomeComponent
  },
  {
    path: RedirectionEnum.STATUS,
    component: StatusComponent
  },
  {
    path: RedirectionEnum.REGISTRATION_YOUNG,
    component: RegistrationYoungComponent,
    canActivate: [registrationEnabledGuard]
  },
  {
    path: RedirectionEnum.REGISTRATION_ADULT,
    component: RegistrationAdultComponent,
    canActivate: [registrationEnabledGuard]
  },
  {
    path: RedirectionEnum.REGISTRATION_STAFF,
    component: RegistrationStaffComponent,
    canActivate: [registrationEnabledGuard]
  },
  {
    path: RedirectionEnum.STATUE_YOUNG,
    component: YoungStatueComponent
  },
  {
    path: RedirectionEnum.STATUE_ADULT,
    component: AdultStatueComponent
  },
  {
    path: RedirectionEnum.LOGIN,
    component: LoginComponent
  },
  {
    path: RedirectionEnum.ADMIN,
    component: AdminComponent,
    canActivate: [adminGuard]
  },
  // otherwise redirect to home
  {path: '**', redirectTo: ''}
];

export const routing = RouterModule.forRoot(appRoutes);
