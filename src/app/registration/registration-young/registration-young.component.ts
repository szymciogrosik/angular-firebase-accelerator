import {Component, OnInit} from '@angular/core';
import {RedirectionEnum} from "../../../utils/redirection.enum";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {CustomTranslateService} from "../../_services/translate/custom-translate.service";
import {PromiseTimoutService} from "../../_services/util/promise-timout.service";
import {CustomValidators} from "../../_services/validator/custom-validators";
import {Registration1318DaoService} from "../../_services/database/registration-13-18-dao.service";
import {RegistrationYoungData} from "../../_models/registration/registration-young-data";
import {DialogData} from "../../_models/dialog/dialog-data";
import {DialogType} from "../../_models/dialog/dialog-type";
import {environment} from "../../../environments/environment";
import {AngularFireAnalytics} from "@angular/fire/compat/analytics";
import {DialogService} from "../../_services/util/dialog.service";

@Component({
  selector: 'app-young',
  templateUrl: './registration-young.component.html',
  styleUrls: ['./registration-young.component.scss']
})
export class RegistrationYoungComponent implements OnInit {
  protected readonly environment = environment;
  private successUrl: string = RedirectionEnum.HOME;

  registrationForm: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private translateService: CustomTranslateService,
    private promiseService: PromiseTimoutService,
    private registrationService: Registration1318DaoService,
    private dialogService: DialogService,
    private analytics: AngularFireAnalytics
  ) {
    this.analytics.logEvent('app_registration_13_18_loaded', {"component": "RegistrationYoungComponent"});
  }

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      question1: ['', [Validators.required]],
      question2: ['', [Validators.required]],
      question3: ['', [Validators.required]],
      question4: ['', [Validators.required]],
      question5: ['', [Validators.required, Validators.email]],
      question6: ['', [Validators.required]],
      question7: ['', [Validators.required]],
      question8: ['', [Validators.required]],
      question9: ['', [Validators.required]],
      question10: ['', [Validators.required, Validators.email]],
      question11: ['', [Validators.required]],
      question12: ['', [Validators.required]],
      question13: ['', [Validators.required]],
      question14: ['', [Validators.required]],
      question15: ['', [Validators.required]],
      question16: ['', [Validators.required]],
      question17: ['', [Validators.required]],
      question18: ['', [Validators.required, CustomValidators.exactTextValidator('Tak')]],
      question19: ['', [Validators.required, CustomValidators.exactTextValidator('Tak')]],
      question20: ['', [Validators.required]],
      question21: ['', [Validators.required, CustomValidators.exactTextValidator('Tak')]],
      question22: ['', [Validators.required, CustomValidators.exactTextValidator('Tak')]],
      question23: ['', [Validators.required]],
      question24: ['', [Validators.required]],
      question25: ['', [Validators.required]],
      question26: ['', [Validators.required]],
      question27: ['', [Validators.required, CustomValidators.exactTextValidator('Tak')]],
      question28: ['', [Validators.required, CustomValidators.exactTextValidator('Tak')]],
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

    let registrationData: RegistrationYoungData = new RegistrationYoungData(this.registrationForm.value);

    this.promiseService.promiseTimeout(30000, this.registrationService.create(registrationData))
      .then(() => {
        this.submitted = false;
        this.loading = false;
        this.analytics.logEvent('registered_13_18', {"component": "RegistrationYoungComponent"});
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
    const dialogRef =
      this.dialogService.openConfirmDialogWithData(
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
