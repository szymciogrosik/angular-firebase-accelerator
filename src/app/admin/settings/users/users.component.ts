import {Component, OnDestroy} from '@angular/core';
import {UserDbService} from "../../../_database/auth/user-db-service.service";
import {CustomUser} from "../../../_models/user/custom-user";
import {Subscription, first} from "rxjs";
import {AccessRoleService} from "../../../_services/auth/access-role.service";
import {CustomTranslateService} from "../../../_services/translate/custom-translate.service";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {SnackbarService} from "../../../_services/util/snackbar.service";
import {AuthService} from "../../../_services/auth/auth.service";
import {UserDetailsComponent} from "./user-details/user-details.component";
import {UserDetailsPopupData} from "../../../_models/dialog/user-details/user-details-popup-data";
import {UserDetailsType} from "../../../_models/dialog/user-details/user-details-type";
import {DialogService} from "../../../_services/util/dialog.service";
import {DialogData} from "../../../_models/dialog/dialog-data";
import {DialogType} from "../../../_models/dialog/dialog-type";
import {FirebaseError} from '@angular/fire/app';
import {AccessRole} from "../../../_models/user/access-role";
import {MatSort} from "@angular/material/sort";
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  standalone: true,
  imports: [MatSort, CommonModule, TranslateModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatTableModule, MatTabsModule],
})
export class UsersComponent implements OnDestroy {
  protected allUsers: CustomUser[];
  protected deletedUsers: CustomUser[];
  protected allUsersSubscription: Subscription;

  protected activeDisplayedColumns: string[] = [
    'position', 'name', 'email', 'roles', 'details', 'remove'
  ];
  protected activeDataSource = new MatTableDataSource<CustomUser>([]);

  protected deletedDisplayedColumns: string[] = [
    'position', 'name', 'email', 'uid', 'restore'
  ];
  protected deletedDataSource = new MatTableDataSource<CustomUser>([]);

  constructor(
    private accessService: AccessRoleService,
    private userDb: UserDbService,
    private translateService: CustomTranslateService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private authService: AuthService,
    private dialogService: DialogService
  ) {
    this.accessService.isAuthorized(AccessRole.ADMIN_PAGE_ACCESS)
      .then((isAuthorized: boolean): void => {
        if (isAuthorized) {
          this.allUsersSubscription = this.userDb.getAll().subscribe(allUsers => {
            this.allUsers = allUsers.filter(u => !u.isDeleted).sort((a, b) => a.firstName.localeCompare(b.firstName));
            this.deletedUsers = allUsers.filter(u => u.isDeleted).sort((a, b) => a.firstName.localeCompare(b.firstName));

            this.activeDataSource.data = this.allUsers;
            this.deletedDataSource.data = this.deletedUsers;
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.allUsersSubscription?.unsubscribe();
  }

  protected applyActiveFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.activeDataSource.filter = filterValue.trim().toLowerCase();
  }

  protected applyDeletedFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.deletedDataSource.filter = filterValue.trim().toLowerCase();
  }

  protected openAddUser(): any {
    const createRef = this.dialog.open(
      UserDetailsComponent,
      {
        maxWidth: '900px',
        disableClose: true,
        data: new UserDetailsPopupData(new CustomUser(), UserDetailsType.CREATE)
      }
    );

    createRef.afterClosed().subscribe(user => {
      if (user) {
        let password = user.password;
        delete user.password;
        user.id = null;

        if (!password) {
          console.error('Password missing from form payload');
          this.snackbarService.openLongSnackBar(this.translateService.get('login.error.internal'));
          return;
        }

        this.userDb.getUserByEmail(user.email).pipe(first()).subscribe(existingUsers => {
          const deletedUser = existingUsers.find(u => u.isDeleted);
          const activeUser = existingUsers.find(u => !u.isDeleted);

          if (activeUser) {
            this.snackbarService.openLongSnackBar(this.translateService.get('login.error.emailAlreadyUsed'));
            return;
          }

          if (deletedUser) {
            this.snackbarService.openLongSnackBar(this.translateService.get('admin.panel.settings.users.error.userDeletedOnlyRestore'));
            return;
          }

          this.authService.registerUser(user.email, password)
            .then((uid: string): void => {
              user.uid = uid;
              this.userDb.create(user)
                .then((): void => {
                  this.openConfirmCreateUserDialog();
                })
                .catch((err): void => {
                  console.error(err);
                  this.snackbarService.openLongSnackBar(this.translateService.get('login.error.internal'));
                });
            })
            .catch((err) => {
              console.error(err);
              if (err instanceof FirebaseError && err.code === 'auth/email-already-in-use') {
                this.snackbarService.openLongSnackBar(this.translateService.get('login.error.emailAlreadyUsed'));
              } else {
                this.snackbarService.openLongSnackBar(this.translateService.get('login.error.internal'));
              }
            });
        });
      }
    });
  }

  private openConfirmCreateUserDialog() {
    const confirmPopup =
      this.dialogService.openConfirmDialogWithData(
        new DialogData(
          this.translateService.get('admin.panel.settings.warning.popupWarning'),
          DialogType.CONFIRMATION,
          this.translateService.get('admin.panel.settings.users.addedSuccessfully'),
          null,
          this.translateService.get('registeredUsers.details.confirm')
        ));
    confirmPopup.afterClosed().subscribe(result => {
      if (result) {
        window.location.reload();
      }
    });
  }

  protected openUpdateUser(id: string): any {
    let user: CustomUser | undefined = this.allUsers.find(elem => elem.id === id);
    if (user === undefined) {
      this.snackbarService.openLongSnackBar(this.translateService.get('login.error.internal'));
      return;
    }
    const updateRef = this.dialog.open(
      UserDetailsComponent,
      {
        maxWidth: '900px',
        disableClose: true,
        data: new UserDetailsPopupData(user, UserDetailsType.UPDATE)
      }
    );

    updateRef.afterClosed().subscribe(user => {
      if (user) {
        this.userDb.update(user.id, user)
          .then((): void => {
            this.snackbarService.openSnackBar(this.translateService.get('admin.panel.settings.users.updatedSuccessfully'));
          })
          .catch((err): void => {
            console.error(err);
            this.snackbarService.openLongSnackBar(this.translateService.get('login.error.internal'));
          });
      }
    });
  }

  protected openConfirmRemoveUserDialog(id: string) {
    const confirmPopup =
      this.dialogService.openConfirmDialog('admin.panel.users.warning.removedUser');
    confirmPopup.afterClosed().subscribe(result => {
      if (result) {
        this.removeUser(id);
      }
    });
  }

  private removeUser(id: string): any {
    this.userDb.update(id, {isDeleted: true})
      .then((): void => {
        this.snackbarService.openSnackBar(this.translateService.get('admin.panel.settings.users.deletedSuccessfully'));
      })
      .catch((err): void => {
        console.error(err);
        this.snackbarService.openLongSnackBar(this.translateService.get('login.error.internal'));
      });
  }

  protected restoreUser(id: string): any {
    this.userDb.update(id, {isDeleted: false})
      .then((): void => {
        this.snackbarService.openSnackBar(this.translateService.get('admin.panel.settings.users.restoredSuccessfully'));
      })
      .catch((err): void => {
        console.error(err);
        this.snackbarService.openLongSnackBar(this.translateService.get('login.error.internal'));
      });
  }

}
