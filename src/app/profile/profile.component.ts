import {Component, OnInit, ViewChild} from '@angular/core';
import {CustomCommonModule} from '../_imports/CustomCommon.module';
import {UserFormComponent} from '../_shared-components/user-form/user-form.component';
import {AuthService} from '../_services/auth/auth.service';
import {StandardUserDbService} from '../_database/auth/standard-user-db.service';
import {CustomUser} from '../_models/user/custom-user';
import {SnackbarService} from '../_services/util/snackbar.service';
import {CustomTranslateService} from '../_services/translate/custom-translate.service';
import {UserDbService} from '../_database/auth/user-db-service.service';
import {MatDialog} from '@angular/material/dialog';
import {ChangePasswordDialogComponent} from './change-password-dialog/change-password-dialog.component';

import {ImageCropperDialogComponent, ImageCropperData} from './image-cropper-dialog/image-cropper-dialog.component';
import {ImagePreviewDialogComponent, ImagePreviewData} from './image-preview-dialog/image-preview-dialog.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CustomCommonModule, UserFormComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild('userFormComponent') userFormComponent!: UserFormComponent;
  user: CustomUser | null = null;
  isLoading = true;

  constructor(
    private authService: AuthService,
    private userDbService: UserDbService,
    private snackbarService: SnackbarService,
    private translateService: CustomTranslateService,
    private dialog: MatDialog
  ) {
  }

  async ngOnInit(): Promise<void> {
    try {
      this.user = await this.authService.loggedUserPromise();
    } catch (error) {
      console.error('Failed to load user', error);
      this.snackbarService.openLongSnackBar(this.translateService.get('profile.error.load'));
    } finally {
      this.isLoading = false;
    }
  }

  openChangePasswordDialog(): void {
    // Open the change password dialog
    this.dialog.open(ChangePasswordDialogComponent, {
      width: '450px'
    });
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0 && this.user) {
      const dialogRef = this.dialog.open(ImageCropperDialogComponent, {
        width: '600px',
        data: {
          imageChangedEvent: event,
          authUserUid: this.user.uid,
          userDocId: this.user.id
        } as ImageCropperData
      });

      dialogRef.afterClosed().subscribe((photoUrl: string | null) => {
        // Clear input to allow re-selection of the same file
        event.target.value = null;
        if (photoUrl && this.user) {
          this.user.photoUrl = photoUrl;
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
    if (!this.user) return;

    try {
      this.isLoading = true;
      await this.userDbService.update(this.user.id, {
        firstName: payload.firstName,
        lastName: payload.lastName,
      });
      // Optionally update local context if needed, but standard auth stream might catch it
      this.user.firstName = payload.firstName;
      this.user.lastName = payload.lastName;

      this.snackbarService.openLongSnackBar(this.translateService.get('profile.success.update'));
    } catch (error) {
      console.error('Failed to update user', error);
      this.snackbarService.openLongSnackBar(this.translateService.get('profile.error.update'));
    } finally {
      this.isLoading = false;
    }
  }
}
