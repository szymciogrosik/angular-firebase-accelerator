import {Component, OnDestroy, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Subscription} from "rxjs";
import {SnackbarService} from "../../_services/util/snackbar.service";
import {CustomTranslateService} from "../../_services/translate/custom-translate.service";
import {DateService} from "../../_services/util/date.service";
import {MatDialog} from "@angular/material/dialog";
import {AccessRoleService} from "../../_services/auth/access-role.service";
import {AccessPage} from "../../_services/auth/access-page";
import {DateTime} from 'luxon';
import {RegistrationStaffData} from "../../_models/registration/registration-staff-data";
import {RegistrationStaffDaoService} from "../../_services/database/registration-staff-dao.service";
import {
  RegistrationDetailsPopupStaffComponent
} from "../registration-details-popup/registration-details-popup-staff/registration-details-popup-staff.component";
import {Select} from "../../_models/registration/select/select";
import {select_area_of_serve} from "../../_models/registration/select/select-area-of-serve";
import {CustomUser} from "../../_models/user/custom-user";
import {AuthService} from "../../_services/auth/auth.service";

@Component({
  selector: 'app-staff-table',
  templateUrl: './staff-table.component.html',
  styleUrl: './staff-table.component.scss'
})
export class StaffTableComponent implements OnDestroy {
  protected readonly select_area_of_serve: Select[] = select_area_of_serve;
  protected readonly DateTime = DateTime;

  protected isAuthorisedToEdit: boolean = false;
  protected staffRegistrationData: RegistrationStaffData[];
  protected selectedAdditionsToFilter: string[] = [];
  protected displayedColumns: string[];
  protected dataSource: any;
  protected registrationDataSubscription: Subscription;

  constructor(
    private registrationStaffService: RegistrationStaffDaoService,
    private snackbarService: SnackbarService,
    private translateService: CustomTranslateService,
    protected dateService: DateService,
    private dialog: MatDialog,
    private accessService: AccessRoleService,
    private authService: AuthService
  ) {
    this.accessService.isAuthorizedToSeePage(AccessPage.REGISTERED_DATA)
      .then((isAuthorized: boolean): void => {
        if (isAuthorized) {
          this.subscribeChangesOnRegistrationData();
        }
      });
    this.accessService.isAuthorizedToSeePage(AccessPage.REGISTERED_DATA_UPDATE)
      .then((isAuthorized: boolean): void => {
        this.isAuthorisedToEdit = isAuthorized;
      });
    this.sortingDataAccessor = this.sortingDataAccessor.bind(this);
  }

  ngOnDestroy(): void {
    this.registrationDataSubscription.unsubscribe();
  }

  @ViewChild(MatSort) sort: MatSort;

  private subscribeChangesOnRegistrationData(): void {
    this.registrationDataSubscription = this.registrationStaffService.getAll().subscribe({
      next: (regInfos: RegistrationStaffData[]) => {
        this.displayedColumns = [
          'position', 'name', 'age', 'areaOfServe', 'fullAmountPayed', 'creationTimestamp'
        ];
        if (this.isAuthorisedToEdit) {
          this.displayedColumns.push('id', 'markDeleted');
        }
        this.staffRegistrationData = regInfos.sort((a, b) => {
          return DateTime.fromISO(b.creationTimestamp).toMillis() - DateTime.fromISO(a.creationTimestamp).toMillis();
        });
        this.filterOriginalData();
      },
      error: (err) => {
        this.snackbarService.openLongSnackBar(this.translateService.get('bk.login.error.internal'));
        console.error(err);
      }
    });
  }

  protected applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private sortingDataAccessor(item: any, property: any) {
    switch (property) {
      case 'name':
        return item.question1?.toLowerCase() || '';
      case 'age':
        return item.question6;
      case 'areaOfServe':
        return this.translateService.get(this.findMatchingKey(select_area_of_serve, item.question7));
      case 'lastModificationTimestamp':
      case 'creationTimestamp':
        return DateTime.fromISO(item[property]).toMillis(); // Convert ISO date string to milliseconds
      default:
        return item[property]; // Handle other properties normally
    }
  }

  protected presentBooleanField(booleanValue: boolean): string {
    return booleanValue ? 'bk.admin.panel.table.yes' : 'bk.admin.panel.table.no';
  }

  protected filterOriginalData(): void {
    let filerByNotPayedAll: boolean = false;
    let filterOnlyDeleted: boolean = false;
    this.selectedAdditionsToFilter.forEach((setting) => {
      switch(setting) {
        case 'allPayed':
          filerByNotPayedAll = true;
          break;
        case 'onlyDeleted':
          filterOnlyDeleted = true;
          break;
        default:
          throw new Error("Unsupported element to filter selected");
      }
    });

    let filteredData = this.staffRegistrationData
      .filter(elem => {
        if (!filerByNotPayedAll) {
          return true;
        }
        return !elem.fullAmountPayed;
      })
      .filter(elem => {
        if (!filterOnlyDeleted) {
          return !elem.deleted;
        }
        return elem.deleted;
      });

    this.dataSource = new MatTableDataSource(filteredData);
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
    this.dataSource.sort = this.sort;
  }

  protected openRegistrationDetailsStaff(id: string): any {
    const dialogRef = this.dialog.open(
      RegistrationDetailsPopupStaffComponent,
      {
        maxWidth: '700px',
        disableClose: true,
        data: this.staffRegistrationData.find(elem => elem.id === id)
      }
    );
  }

  protected calculateFullYears(luzonDateStr: string): number {
    const luzonDate = DateTime.fromISO(luzonDateStr);
    const currentDate = DateTime.now();
    let yearsDifference = currentDate.year - luzonDate.year;
    if (currentDate < luzonDate.plus({ years: yearsDifference })) {
      yearsDifference--;
    }
    return yearsDifference;
  }

  protected findMatchingKey(selectValues: Select[], key: string): string {
    let foundViewKey = selectValues.find(item => item.value === key)?.viewKey;
    return foundViewKey ? foundViewKey : '';
  }

  protected restoreDeleted(id: string) {
    this.authService.loggedUserPromise()
      .then((customUser: CustomUser | null) => {
        if (customUser === null) {
          throw new Error('Currently logged user cannot be null!');
        }
        let regData = this.staffRegistrationData.find(elem => elem.id === id);
        if (regData === undefined) {
          throw new Error('Red data cannot be undefined!');
        }
        this.registrationStaffService.markAsUnDeleted(regData, customUser.firstName + ' ' + customUser.lastName)
          .catch((err) => {
            this.snackbarService.openLongSnackBar(this.translateService.get('bk.login.error.internal'));
            console.error(err);
          });
      })
      .catch((err) => {
        this.snackbarService.openLongSnackBar(this.translateService.get('bk.login.error.internal'));
        console.error(err);
      });
  }

  protected markAsDeleted(id: string) {
    this.authService.loggedUserPromise()
      .then((customUser: CustomUser | null) => {
        if (customUser === null) {
          throw new Error('Currently logged user cannot be null!');
        }
        let regData = this.staffRegistrationData.find(elem => elem.id === id);
        if (regData === undefined) {
          throw new Error('Red data cannot be undefined!');
        }
        this.registrationStaffService.markAsDeleted(regData, customUser.firstName + ' ' + customUser.lastName)
          .catch((err) => {
            this.snackbarService.openLongSnackBar(this.translateService.get('bk.login.error.internal'));
            console.error(err);
          });
      })
      .catch((err) => {
        this.snackbarService.openLongSnackBar(this.translateService.get('bk.login.error.internal'));
        console.error(err);
      });
  }

}

