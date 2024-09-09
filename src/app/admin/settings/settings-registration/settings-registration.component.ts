import {Component, OnDestroy} from '@angular/core';
import {DateTime} from "luxon";
import {Subscription} from "rxjs";
import {
  PublicRegistrationSettingsService
} from "../../../_services/database/settings/public-registration-settings.service";
import {AccessRoleService} from "../../../_services/auth/access-role.service";
import {AccessPage} from "../../../_services/auth/access-page";
import {CustomTranslateService} from "../../../_services/translate/custom-translate.service";
import {DateService} from "../../../_services/util/date.service";
import {DialogService} from "../../../_services/util/dialog.service";

@Component({
  selector: 'app-settings-registration',
  templateUrl: './settings-registration.component.html',
  styleUrl: './settings-registration.component.scss'
})
export class SettingsRegistrationComponent implements OnDestroy {
  protected registrationEnabled: boolean | null = null;
  private originalRegistrationStartDate: DateTime | null = null;
  protected registrationStartDateInput: string | undefined = undefined;

  private registrationEnabledSubscription: Subscription;
  private registrationStartDateSubscription: Subscription;

  constructor(
    private registrationSettingsService: PublicRegistrationSettingsService,
    private accessService: AccessRoleService,
    private dialogService: DialogService,
    private translateService: CustomTranslateService
  ) {
    this.accessService.isAuthorizedToSeePage(AccessPage.SETTINGS)
      .then((isAuthorized: boolean): void => {
        if (isAuthorized) {
          this.subscribe();
        }
      });
  }

  ngOnDestroy(): void {
    this.registrationEnabledSubscription?.unsubscribe();
    this.registrationStartDateSubscription?.unsubscribe();
  }

  private subscribe(): void {
    this.registrationEnabledSubscription = this.registrationSettingsService.isRegistrationEnabledObservable().subscribe({
      next: (regEnabled) => this.registrationEnabled = regEnabled,
      error: (err) => console.error(err)
    });
    this.registrationStartDateSubscription = this.registrationSettingsService.getRegistrationStartDateTimeObservable().subscribe({
      next: (registrationStartDate) => {
        this.originalRegistrationStartDate = registrationStartDate
        this.registrationStartDateInput = this.originalRegistrationStartDate?.toISO()?.slice(0, 16);
      }
    });
  }

  protected openConfirmEnableRegistrationDialog(event: any) {
    const dialogRef =
      this.dialogService.openConfirmDialog('bk.admin.panel.settings.warning.enableRegistration');
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateRegistrationEnabled(event);
      } else {
        this.registrationEnabled = !event.value;
      }
    });
  }

  private updateRegistrationEnabled(event: any): void {
    this.registrationEnabled = null;
    this.registrationSettingsService.updateRegistrationEnabled(event.checked)
      .catch((err) => console.error(err));
  }

  protected isOriginalRegStartDateDifferentAsInput(): boolean {
    let updatedDateTime = this.getRegistrationStartDateInputValue();
    if (updatedDateTime === null || this.originalRegistrationStartDate === null) {
      return false;
    }
    return !(this.originalRegistrationStartDate.toMillis() === updatedDateTime.toMillis());
  }

  protected getRegistrationStartDateInputValue(): DateTime | null {
    if (!this.registrationStartDateInput) {
      return null;
    }
    return DateTime.fromISO(this.registrationStartDateInput, { zone: DateService.timeZone });
  }

  protected openConfirmRegistrationStartDateDialog() {
    const dialogRef =
      this.dialogService.openConfirmDialog('bk.admin.panel.settings.warning.saveStartRegistrationDate');
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateRegistrationStartDate();
      } else {
        this.registrationStartDateInput = this.originalRegistrationStartDate?.toISO()?.slice(0, 16);
      }
    });
  }

  private updateRegistrationStartDate(): void {
    let updatedDateTime = this.getRegistrationStartDateInputValue();
    if (updatedDateTime === null) {
      return;
    }
    this.registrationSettingsService.updateRegistrationStartDateTime(updatedDateTime)
      .catch((err) => console.error(err));
  }

}
