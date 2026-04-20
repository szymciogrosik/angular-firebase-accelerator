import {Component, OnInit, ViewChild, signal} from '@angular/core';
import {UserFormComponent} from '../_shared-components/user-form/user-form.component';
import {AuthService} from '../_services/auth/auth.service';
import {CustomUser} from '../_models/user/custom-user';
import {SnackbarService} from '../_services/util/snackbar.service';
import {CustomTranslateService} from '../_services/translate/custom-translate.service';
import {UserDbService} from '../_database/auth/user-db-service.service';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {ChangePasswordDialogComponent} from './change-password-dialog/change-password-dialog.component';

import {ImageCropperData, ImageCropperDialogComponent} from './image-cropper-dialog/image-cropper-dialog.component';
import {ImagePreviewData, ImagePreviewDialogComponent} from './image-preview-dialog/image-preview-dialog.component';
import {PublicSettingsFacade} from '../_database/settings/public-settings.facade';
import {TranslateModule} from '@ngx-translate/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';

import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    UserFormComponent,
    TranslateModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild('userFormComponent') userFormComponent!: UserFormComponent;
  readonly user = signal<CustomUser | null>(null);
  readonly isLoading = signal(true);
  readonly allowForProfilePictureChange = this.facade.allowForProfilePictureChange;

  constructor(
    private authService: AuthService,
    private userDbService: UserDbService,
    private snackbarService: SnackbarService,
    private translateService: CustomTranslateService,
    private dialog: MatDialog,
    private facade: PublicSettingsFacade
  ) {
  }

  async ngOnInit(): Promise<void> {
    try {
      this.user.set(await this.authService.loggedUserPromise());
    } catch (error) {
      console.error('Failed to load user', error);
      this.snackbarService.openLongSnackBar(this.translateService.get('profile.error.load'));
    } finally {
      this.isLoading.set(false);
    }
  }

  openChangePasswordDialog(): void {
    // Open the change password dialog
    this.dialog.open(ChangePasswordDialogComponent, {
      width: '450px'
    });
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0 && this.user()) {
      const dialogRef = this.dialog.open(ImageCropperDialogComponent, {
        width: '600px',
        data: {
          imageChangedEvent: event,
          authUserUid: this.user()!.uid,
          userDocId: this.user()!.id
        } as ImageCropperData
      });

      dialogRef.afterClosed().subscribe((photoUrl: string | null) => {
        // Clear input to allow re-selection of the same file
        event.target.value = null;
        if (photoUrl && this.user()) {
          this.user.set({ ...this.user()!, photoUrl: photoUrl });
        }
      });
    }
  }

  openPreviewDialog(imageUrl: string): void {
    this.dialog.open(ImagePreviewDialogComponent, {
      panelClass: 'image-preview-dialog-panel',
      data: {
        imageUrl: imageUrl
      } as ImagePreviewData
    });
  }

  async onFormSubmit(payload: any): Promise<void> {
    const currentUser = this.user();
    if (!currentUser) return;

    try {
      this.isLoading.set(true);
      await this.userDbService.update(currentUser.id, {
        firstName: payload.firstName,
        lastName: payload.lastName
      });
      // Optionally update local context if needed, but standard auth stream might catch it
      this.user.set({ ...currentUser, firstName: payload.firstName, lastName: payload.lastName });

      this.snackbarService.openSnackBar(this.translateService.get('profile.success.update'));
    } catch (error) {
      console.error('Failed to update user', error);
      this.snackbarService.openLongSnackBar(this.translateService.get('profile.error.update'));
    } finally {
      this.isLoading.set(false);
    }
  }

}
