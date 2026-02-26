import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {CustomCommonModule} from '../../_imports/CustomCommon.module';
import {CustomTranslateService} from '../../_services/translate/custom-translate.service';
import {CustomValidators} from '../../_services/validator/custom-validators';
import {AuthService} from '../../_services/auth/auth.service';
import {SnackbarService} from '../../_services/util/snackbar.service';

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [CustomCommonModule],
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss']
})
export class ChangePasswordDialogComponent implements OnInit {
  passwordForm!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;

  constructor(
    private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private translateService: CustomTranslateService,
    private snackbarService: SnackbarService
  ) {
  }

  ngOnInit(): void {
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6), CustomValidators.passwordValidator]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const {password, confirmPassword} = this.passwordForm.value;
    if (password !== confirmPassword) {
      this.passwordForm.get('confirmPassword')?.setErrors({mismatched: true});
      return;
    }

    this.isLoading = true;
    try {
      await this.authService.updateAuthPassword(password);
      this.snackbarService.openSnackBar(this.translateService.get('profile.password.success'));
      this.dialogRef.close(true);
    } catch (error) {
      console.error(error);
      this.snackbarService.openLongSnackBar(this.translateService.get('profile.password.error'));
    } finally {
      this.isLoading = false;
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  getErrorMessage(field: string): string {
    const control = this.passwordForm.get(field);
    if (!control) return '';

    if (control.hasError('required')) return this.translateService.get('registration.validation.mandatoryField');
    if (control.hasError('minlength')) return this.translateService.get('registration.validation.minLength') + control.errors?.['minlength'].requiredLength;
    if (control.hasError('invalidPasswordSecurity')) return this.translateService.get('registration.validation.invalidPasswordSecurity');
    if (control.hasError('mismatched')) return this.translateService.get('profile.password.mismatch');
    return '';
  }
}
