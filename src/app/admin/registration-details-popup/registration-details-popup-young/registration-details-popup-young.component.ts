import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {RegistrationYoungData} from "../../../_models/registration/registration-young-data";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Registration1318DaoService} from "../../../_services/database/registration-13-18-dao.service";
import {SnackbarService} from "../../../_services/util/snackbar.service";
import {CustomTranslateService} from "../../../_services/translate/custom-translate.service";
import {DateTime} from "luxon";
import {DateService} from "../../../_services/util/date.service";
import {AuthService} from "../../../_services/auth/auth.service";
import {CustomUser} from "../../../_models/user/custom-user";

@Component({
  selector: 'app-registration-details-popup-young',
  templateUrl: './registration-details-popup-young.component.html',
  styleUrl: './registration-details-popup-young.component.scss'
})
export class RegistrationDetailsPopupYoungComponent implements OnInit {
  protected readonly DateTime = DateTime;
  protected loading: boolean = false;
  protected detailsForm: FormGroup;
  private user: CustomUser | null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: RegistrationYoungData,
    public dialogRef: MatDialogRef<RegistrationDetailsPopupYoungComponent>,
    private formBuilder: FormBuilder,
    private registrationService: Registration1318DaoService,
    private snackbarService: SnackbarService,
    private translateService: CustomTranslateService,
    protected dateService: DateService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.detailsForm = this.formBuilder.group({
      advancePayed: [this.data.advancePayed],
      fullAmountPayed: [this.data.fullAmountPayed],
      additionalComments: [this.data.additionalComments],
    });
    this.authService.loggedUser().subscribe({
      next: (user) => this.user = user
    })
  }

  protected onSubmit(): void {
    this.loading = true;

    this.data.advancePayed = this.detailsForm.value.advancePayed;
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
}
