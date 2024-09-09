import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {CustomUser} from "../../../_models/user/custom-user";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SnackbarService} from "../../../_services/util/snackbar.service";
import {CustomTranslateService} from "../../../_services/translate/custom-translate.service";
import {DateService} from "../../../_services/util/date.service";
import {AuthService} from "../../../_services/auth/auth.service";
import {DateTime} from 'luxon';
import {RegistrationStaffDaoService} from "../../../_services/database/registration-staff-dao.service";
import {Select} from "../../../_models/registration/select/select";
import {select_genders} from "../../../_models/registration/select/select-gender";
import {select_area_of_serve} from "../../../_models/registration/select/select-area-of-serve";
import {select_known_languages} from "../../../_models/registration/select/select-known-languages";
import {RegistrationStaffData} from "../../../_models/registration/registration-staff-data";

@Component({
  selector: 'app-registration-details-popup-staff',
  templateUrl: './registration-details-popup-staff.component.html',
  styleUrl: './registration-details-popup-staff.component.scss'
})
export class RegistrationDetailsPopupStaffComponent implements OnInit {
  protected readonly DateTime = DateTime;
  protected loading: boolean = false;
  protected detailsForm: FormGroup;
  private user: CustomUser | null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: RegistrationStaffData,
    public dialogRef: MatDialogRef<RegistrationDetailsPopupStaffComponent>,
    private formBuilder: FormBuilder,
    private registrationService: RegistrationStaffDaoService,
    private snackbarService: SnackbarService,
    private translateService: CustomTranslateService,
    protected dateService: DateService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.detailsForm = this.formBuilder.group({
      fullAmountPayed: [this.data.fullAmountPayed],
      additionalComments: [this.data.additionalComments],
    });
    this.authService.loggedUser().subscribe({
      next: (user) => this.user = user
    })
  }

  protected onSubmit(): void {
    this.loading = true;

    this.data.fullAmountPayed = this.detailsForm.value.fullAmountPayed;
    this.data.additionalComments = this.detailsForm.value.additionalComments;
    this.data.lastModificationTimestamp = DateTime.now().toString();
    if (this.user !== null) {
      this.data.lastModificationUser = (this.user.firstName + ' ' + this.user.lastName);
    }

    this.registrationService.update(this.data.id, this.data)
      .then(() =>
        this.dialogRef.close()
      )
      .catch((err) => {
        this.snackbarService.openLongSnackBar(this.translateService.get('bk.login.error.internal'));
        console.error(err);
      })
      .finally(() => this.loading = false);
  }

  protected findMatchingKey(selectValues: Select[], key: string): string {
    let foundViewKey = selectValues.find(item => item.value === key)?.viewKey;
    return foundViewKey ? foundViewKey : '';
  }

  protected readonly select_genders = select_genders;
  protected readonly select_area_of_serve = select_area_of_serve;
  protected readonly select_known_languages = select_known_languages;
}
