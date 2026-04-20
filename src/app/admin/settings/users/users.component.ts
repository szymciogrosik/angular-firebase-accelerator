import {Component, inject} from '@angular/core';
import {UserFacade} from "../../../_database/auth/user.facade";
import {CustomUser} from "../../../_models/user/custom-user";
import {AccessRoleService} from "../../../_services/auth/access-role.service";
import {CustomTranslateService} from "../../../_services/translate/custom-translate.service";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
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
import {TranslateModule} from '@ngx-translate/core';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTabsModule} from '@angular/material/tabs';
import {SmartTableComponent} from "../../../_shared-components/smart-table/smart-table.component";
import {SmartTableColumn} from "../../../_shared-components/smart-table/smart-table.model";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  standalone: true,
  imports: [TranslateModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatTabsModule, SmartTableComponent],
})
export class UsersComponent {
  private accessService = inject(AccessRoleService);
  private userFacade = inject(UserFacade);
  private translateService = inject(CustomTranslateService);
  private dialog = inject(MatDialog);
  private snackbarService = inject(SnackbarService);
  private authService = inject(AuthService);
  private dialogService = inject(DialogService);

  protected allUsers = this.userFacade.activeUsers;
  protected deletedUsers = this.userFacade.deletedUsers;

  protected addUserAction = {
    icon: 'person_add',
    tooltipKey: 'admin.panel.settings.users.addNewUser',
    color: 'primary' as const,
    onClick: () => this.openAddUser()
  };

  protected activeUsersColumns: SmartTableColumn<CustomUser>[] = [
    {key: 'position', headerLabelKey: 'admin.panel.table.header.no', type: 'index'},
    {
      key: 'name',
      headerLabelKey: 'admin.panel.table.header.name',
      type: 'text',
      valueFn: (row) => row.firstName + ' ' + row.lastName
    },
    {key: 'email', headerLabelKey: 'admin.panel.table.header.email', type: 'text'},
    {key: 'roles', headerLabelKey: 'admin.panel.table.header.role', type: 'text'},
    {
      key: 'actions', headerLabelKey: '', type: 'action', actions: [
        {
          tooltipKey: 'admin.panel.table.header.modify',
          icon: 'edit',
          color: 'primary',
          onClick: (row) => this.openUpdateUser(row.id!)
        },
        {
          tooltipKey: 'admin.panel.table.header.delete',
          icon: 'delete',
          color: 'warn',
          onClick: (row) => this.openConfirmRemoveUserDialog(row.id!)
        }
      ]
    }
  ];

  protected deletedUsersColumns: SmartTableColumn<CustomUser>[] = [
    {key: 'position', headerLabelKey: 'admin.panel.table.header.no', type: 'index'},
    {
      key: 'name',
      headerLabelKey: 'admin.panel.table.header.name',
      type: 'text',
      valueFn: (row) => row.firstName + ' ' + row.lastName
    },
    {key: 'email', headerLabelKey: 'admin.panel.table.header.email', type: 'text'},
    {key: 'uid', headerLabelKey: 'admin.panel.table.header.guid', type: 'text'},
    {
      key: 'actions', headerLabelKey: '', type: 'action', actions: [
        {
          tooltipKey: 'admin.panel.table.header.restore',
          icon: 'settings_backup_restore',
          color: 'primary',
          onClick: (row) => this.restoreUser(row.id!)
        }
      ]
    }
  ];

  protected openAddUser(): any {
    const createRef = this.dialog.open(
      UserDetailsComponent,
      {
        maxWidth: '900px',
        disableClose: true,
        data: new UserDetailsPopupData({
          id: '', uid: '', email: '', firstName: '', lastName: '', roles: []
        }, UserDetailsType.CREATE)
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

        this.userFacade.getUserByEmailAsync(user.email).then(existingUsers => {
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
              this.userFacade.createUser(user)
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
        {
          title: this.translateService.get('admin.panel.settings.warning.popupWarning'),
          popupType: DialogType.CONFIRMATION,
          message: this.translateService.get('admin.panel.settings.users.addedSuccessfully'),
          cancelButtonText: null,
          confirmButtonText: this.translateService.get('registeredUsers.details.confirm')
        });
    confirmPopup.afterClosed().subscribe(result => {
      if (result) {
        window.location.reload();
      }
    });
  }

  protected openUpdateUser(id: string): any {
    const currentUsers = this.allUsers();
    let user: CustomUser | undefined = currentUsers ? currentUsers.find(elem => elem.id === id) : undefined;
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
        this.userFacade.updateUser(user.id, user)
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
    this.userFacade.updateUser(id, {isDeleted: true})
      .then((): void => {
        this.snackbarService.openSnackBar(this.translateService.get('admin.panel.settings.users.deletedSuccessfully'));
      })
      .catch((err): void => {
        console.error(err);
        this.snackbarService.openLongSnackBar(this.translateService.get('login.error.internal'));
      });
  }

  protected restoreUser(id: string): any {
    this.userFacade.updateUser(id, {isDeleted: false})
      .then((): void => {
        this.snackbarService.openSnackBar(this.translateService.get('admin.panel.settings.users.restoredSuccessfully'));
      })
      .catch((err): void => {
        console.error(err);
        this.snackbarService.openLongSnackBar(this.translateService.get('login.error.internal'));
      });
  }

}
