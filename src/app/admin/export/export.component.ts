import {Component, OnDestroy} from '@angular/core';
import {DialogService} from "../../_services/util/dialog.service";
import {ExportService} from "../../_services/business/export.service";
import {AccessPage} from "../../_services/auth/access-page";
import {AccessRoleService} from "../../_services/auth/access-role.service";
import {CustomUser} from "../../_models/user/custom-user";
import {Subscription} from "rxjs";
import {RegistrationYoungData} from "../../_models/registration/registration-young-data";
import {RegistrationAdultData} from "../../_models/registration/registration-adult-data";
import {RegistrationStaffData} from "../../_models/registration/registration-staff-data";
import {Registration1318DaoService} from "../../_services/database/registration-13-18-dao.service";
import {Registration1926DaoService} from "../../_services/database/registration-19-26-dao.service";
import {RegistrationStaffDaoService} from "../../_services/database/registration-staff-dao.service";
import {DateService} from "../../_services/util/date.service";
import {AngularFireAnalytics} from "@angular/fire/compat/analytics";
import {AuthService} from "../../_services/auth/auth.service";
import {CustomTranslateService} from "../../_services/translate/custom-translate.service";
import { DateTime } from 'luxon';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrl: './export.component.scss'
})
export class ExportComponent implements OnDestroy {

  private youngRegistrationData: RegistrationYoungData[];
  private adultRegistrationData: RegistrationAdultData[];
  private staffRegistrationData: RegistrationStaffData[];
  private loggedUser: CustomUser | null = null;

  private registrationYoungSubscription: Subscription;
  private registrationAdultSubscription: Subscription;
  private registrationStaffSubscription: Subscription;
  private loggedUserSubscription: Subscription;

  constructor(
    private registrationYoungService: Registration1318DaoService,
    private registrationAdultService: Registration1926DaoService,
    private registrationStaffService: RegistrationStaffDaoService,
    private dateService: DateService,
    private analytics: AngularFireAnalytics,
    private authService: AuthService,
    private accessService: AccessRoleService,
    private dialogService: DialogService,
    private translateService: CustomTranslateService,
    private exportService: ExportService
  ) {
    this.accessService.isAuthorizedToSeePage(AccessPage.REGISTERED_DATA_UPDATE)
      .then((isAuthorized: boolean): void => {
        if (isAuthorized) {
          this.subscribe();
        }
      });
  }

  ngOnDestroy(): void {
    this.registrationYoungSubscription?.unsubscribe();
    this.registrationAdultSubscription?.unsubscribe();
    this.registrationStaffSubscription?.unsubscribe();
    this.loggedUserSubscription?.unsubscribe();
  }

  private subscribe(): void {
    this.registrationYoungSubscription = this.registrationYoungService.getNotDeletedOnly().subscribe({
      next: (regData) => {
        this.youngRegistrationData = this.sortByCreationTimestamp(regData);
      }
    });
    this.registrationAdultSubscription = this.registrationAdultService.getNotDeletedOnly().subscribe({
      next: (regData) => {
        this.adultRegistrationData = this.sortByCreationTimestamp(regData);
      }
    });
    this.registrationStaffSubscription = this.registrationStaffService.getNotDeletedOnly().subscribe({
      next: (regData) => {
        this.staffRegistrationData = this.sortByCreationTimestamp(regData);
      }
    });
    this.loggedUserSubscription = this.authService.loggedUser().subscribe({
      next: (loggedUser) => this.loggedUser = loggedUser
    });
  }

  private sortByCreationTimestamp<T extends { creationTimestamp: string }>(data: T[]): T[] {
    return data.sort((a, b) =>
      DateTime.fromISO(b.creationTimestamp).toMillis() - DateTime.fromISO(a.creationTimestamp).toMillis()
    );
  }

  protected openConfirmSaveExcelFileDialog() {
    const dialogRef =
      this.dialogService.openConfirmDialog('bk.admin.panel.settings.warning.exportBackup');
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveExcelFile();
      }
    });
  }

  private saveExcelFile(): void {
    let loggedUserName = this.loggedUser ? this.loggedUser.uid : "User without UID";
    this.analytics.logEvent(
      'app_admin_reg_data_downloaded',
      [
        {"component": "AdminComponent"},
        {"modifiedByUser": loggedUserName}
      ]
    );

    this.exportService.exportToExcel(
      'Registration data ' + this.dateService.presentCurrentDateTimeForFileName(),
      this.youngRegistrationData,
      this.adultRegistrationData,
      this.staffRegistrationData
    );
  }

}
