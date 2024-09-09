import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {CustomUser} from "../../../_models/user/custom-user";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {RegistrationAdultData} from "../../../_models/registration/registration-adult-data";
import {SnackbarService} from "../../../_services/util/snackbar.service";
import {CustomTranslateService} from "../../../_services/translate/custom-translate.service";
import {DateService} from "../../../_services/util/date.service";
import {AuthService} from "../../../_services/auth/auth.service";
import {DateTime} from 'luxon';
import {Registration1926DaoService} from "../../../_services/database/registration-19-26-dao.service";

@Component({
  selector: 'app-registration-details-popup-adult',
  templateUrl: './registration-details-popup-adult.component.html',
  styleUrl: './registration-details-popup-adult.component.scss'
})
export class RegistrationDetailsPopupAdultComponent implements OnInit {
  protected readonly DateTime = DateTime;
  protected loading: boolean = false;
  protected detailsForm: FormGroup;
  private user: CustomUser | null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: RegistrationAdultData,
    public dialogRef: MatDialogRef<RegistrationDetailsPopupAdultComponent>,
    private formBuilder: FormBuilder,
    private registrationService: Registration1926DaoService,
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
