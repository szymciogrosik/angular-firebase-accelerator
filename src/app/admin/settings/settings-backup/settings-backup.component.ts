import {Component, OnDestroy} from '@angular/core';
import {RegistrationYoungData} from "../../../_models/registration/registration-young-data";
import {RegistrationAdultData} from "../../../_models/registration/registration-adult-data";
import {CustomUser} from "../../../_models/user/custom-user";
import {Subscription} from "rxjs";
import {Registration1318DaoService} from "../../../_services/database/registration-13-18-dao.service";
import {Registration1926DaoService} from "../../../_services/database/registration-19-26-dao.service";
import {DateService} from "../../../_services/util/date.service";
import {AngularFireAnalytics} from "@angular/fire/compat/analytics";
import {AuthService} from "../../../_services/auth/auth.service";
import {AccessRoleService} from "../../../_services/auth/access-role.service";
import {AccessPage} from "../../../_services/auth/access-page";
import {DialogService} from "../../../_services/util/dialog.service";
import {RegistrationStaffData} from "../../../_models/registration/registration-staff-data";
import {RegistrationStaffDaoService} from "../../../_services/database/registration-staff-dao.service";
import {ExportService} from "../../../_services/business/export.service";

@Component({
  selector: 'app-settings-backup',
  templateUrl: './settings-backup.component.html',
  styleUrl: './settings-backup.component.scss'
})
export class SettingsBackupComponent implements OnDestroy {
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
    private exportService: ExportService
  ) {
    this.accessService.isAuthorizedToSeePage(AccessPage.SETTINGS)
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
    this.registrationYoungSubscription = this.registrationYoungService.getAll().subscribe({
      next: (regData) => this.youngRegistrationData = regData
    });
    this.registrationAdultSubscription = this.registrationAdultService.getAll().subscribe({
      next: (regData) => this.adultRegistrationData = regData
    });
    this.registrationStaffSubscription = this.registrationStaffService.getAll().subscribe({
      next: (regData) => this.staffRegistrationData = regData
    });
    this.loggedUserSubscription = this.authService.loggedUser().subscribe({
      next: (loggedUser) => this.loggedUser = loggedUser
    });
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
      'app_admin_backup_downloaded',
      [
        {"component": "AdminComponent"},
        {"modifiedByUser": loggedUserName}
      ]
    );

    this.exportService.exportToExcel(
      'Registration backup ' + this.dateService.presentCurrentDateTimeForFileName(),
      this.youngRegistrationData,
      this.adultRegistrationData,
      this.staffRegistrationData
    );
  }

}
