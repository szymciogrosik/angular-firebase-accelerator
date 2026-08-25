import {ChangeDetectionStrategy, Component, inject, viewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {UserDetailsPopupData} from '../../../../_models/dialog/user-details/user-details-popup-data';
import {UserDetailsType} from '../../../../_models/dialog/user-details/user-details-type';
import {CustomTranslateService} from '../../../../_services/translate/custom-translate.service';
import {UserFormComponent} from '../../../../_shared-components/user-form/user-form.component';
import {AuthService} from '../../../../_services/auth/auth.service';
import {SnackbarService} from '../../../../_services/util/snackbar.service';
import {TranslateModule} from '@ngx-translate/core';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
  standalone: true,
  imports: [UserFormComponent, TranslateModule, MatButtonModule, MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDetailsComponent {
  readonly userFormComponent = viewChild(UserFormComponent);
  protected readonly UserDetailsType = UserDetailsType;

  public dialogRef = inject<MatDialogRef<UserDetailsComponent>>(MatDialogRef);
  public data = inject<UserDetailsPopupData>(MAT_DIALOG_DATA);
  private translateService = inject(CustomTranslateService);
  private authService = inject(AuthService);
  private snackbarService = inject(SnackbarService);


  protected onCancelClick(): void {
    this.dialogRef.close(null);
  }

  protected onApproveClick(): void {
    this.userFormComponent()?.triggerSubmit();
  }

  protected onFormSubmit(payload: any): void {
    this.dialogRef.close(payload);
  }

  protected onSendResetEmail(): void {
    if (this.data.user && this.data.user.email) {
      this.authService.sendPasswordResetLink(this.data.user.email).then(() => {
        this.snackbarService.openSnackBar(this.translateService.get('admin.panel.users.sendResetEmail.success'));
      }).catch(err => {
        console.error(err);
        this.snackbarService.openLongSnackBar(this.translateService.get('login.error.internal'));
      });
    }
  }

}
