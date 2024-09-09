import {Component, OnInit} from '@angular/core';
import {RedirectionEnum} from "../../../utils/redirection.enum";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CustomTranslateService} from "../../_services/translate/custom-translate.service";
import {PromiseTimoutService} from "../../_services/util/promise-timout.service";
import {DialogService} from "../../_services/util/dialog.service";
import {AngularFireAnalytics} from "@angular/fire/compat/analytics";
import {DialogData} from "../../_models/dialog/dialog-data";
import {DialogType} from "../../_models/dialog/dialog-type";
import {environment} from "../../../environments/environment";
import {RegistrationStaffDaoService} from "../../_services/database/registration-staff-dao.service";
import {RegistrationStaffData} from "../../_models/registration/registration-staff-data";
import {select_genders} from "../../_models/registration/select/select-gender";
import {select_area_of_serve} from "../../_models/registration/select/select-area-of-serve";
import {select_known_languages} from "../../_models/registration/select/select-known-languages";
import {Select} from "../../_models/registration/select/select";

@Component({
  selector: 'app-registration-staff',
  templateUrl: './registration-staff.component.html',
  styleUrl: './registration-staff.component.scss'
})
export class RegistrationStaffComponent implements OnInit {
  protected readonly environment = environment;
  protected readonly select_genders: Select[] = select_genders;
  protected readonly select_area_of_serve: Select[] = select_area_of_serve;
  protected readonly select_known_languages: Select[] = select_known_languages;
  private successUrl: string = RedirectionEnum.HOME;

  registrationForm: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private translateService: CustomTranslateService,
    private promiseService: PromiseTimoutService,
    private registrationService: RegistrationStaffDaoService,
    public dialogService: DialogService,
    private analytics: AngularFireAnalytics
  ) {
    this.analytics.logEvent('app_registration_staff_loaded', {"component": "RegistrationStaffComponent"});
  }

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      question1: ['', [Validators.required]],
      question2: ['', [Validators.required, Validators.email]],
      question3: ['', [Validators.required]],
      question4: ['', [Validators.required]],
      question5: ['', [Validators.required]],
      question6: ['', [Validators.required]],
      question7: ['', [Validators.required]],
      question8: [''],
      question9: ['', [Validators.required]],
      question10: ['', [Validators.required]],
      question11: ['', [Validators.required]],
      question12: ['', [Validators.required]],
      question13: ['', [Validators.required]],
      question14: ['', [Validators.required]],
    });
  }

  getErrorMessage(formControlName: string): string {
    if (this.formControls[formControlName].hasError('required')) {
      return this.translateService.get('registration.validation.mandatoryField');
    }
    if (this.formControls[formControlName].hasError('email')) {
      return this.translateService.get('registration.validation.invalidEmail');
    }
    if (this.formControls[formControlName].hasError('exactText')) {
      return this.translateService.get('registration.validation.exactTextYes');
    }
    return '';
  }

  onSubmit(): void {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registrationForm.invalid) {
      return;
    }
    this.loading = true;

    let registrationData: RegistrationStaffData = new RegistrationStaffData(this.registrationForm.value);

    this.promiseService.promiseTimeout(30000, this.registrationService.create(registrationData))
      .then(() => {
        this.loading = false;
        this.analytics.logEvent('registered_staff', {"component": "RegistrationStaffComponent"});
        this.openConfirmationDialog();
      }).catch((error) => {
      if (error instanceof Error && error.message === this.promiseService.timoutMessage) {
        console.error('Operation timed out');
      } else {
        console.error('Error occurred:', error);
      }
      this.loading = false;
      this.openErrorDialog();
    });
  }

  openConfirmationDialog() {
    const dialogRef = this.dialogService.openConfirmDialogWithData(
      new DialogData(
        this.translateService.get('registration.confirmationDialog.success.title'),
        DialogType.CONFIRMATION,
        this.translateService.get('registration.confirmationDialog.success.contextText'),
        null,
        this.translateService.get('registration.confirmationDialog.success.buttonText')
      )
    );
    dialogRef.afterClosed().subscribe(() => {
      // this.router.navigate([this.successUrl]);
      window.location.href = this.successUrl;
    });
  }

  openErrorDialog() {
    this.dialogService.openConfirmDialogWithData(
      new DialogData(
        this.translateService.get('registration.confirmationDialog.error.title'),
        DialogType.ERROR,
        this.translateService.get('registration.confirmationDialog.error.contextText'),
        null,
        this.translateService.get('registration.confirmationDialog.error.buttonText')
      )
    );
  }

  // convenience getter for easy access to form fields
  get formControls(): { [key: string]: AbstractControl; } {
    return this.registrationForm.controls;
  }

}
