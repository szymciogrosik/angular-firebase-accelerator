import {Component, OnDestroy, ViewChild} from '@angular/core';
import {SnackbarService} from "../../_services/util/snackbar.service";
import {CustomTranslateService} from "../../_services/translate/custom-translate.service";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {DateService} from "../../_services/util/date.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {DateTime} from 'luxon';
import {RegistrationAdultData} from "../../_models/registration/registration-adult-data";
import {Registration1926DaoService} from "../../_services/database/registration-19-26-dao.service";
import {
  RegistrationDetailsPopupAdultComponent
} from "../registration-details-popup/registration-details-popup-adult/registration-details-popup-adult.component";
import {Subscription} from "rxjs";
import {AccessPage} from "../../_services/auth/access-page";
import {AccessRoleService} from "../../_services/auth/access-role.service";
import {AuthService} from "../../_services/auth/auth.service";
import {CustomUser} from "../../_models/user/custom-user";

@Component({
  selector: 'app-adult-table',
  templateUrl: './adult-table.component.html',
  styleUrl: './adult-table.component.scss'
})
export class AdultTableComponent implements OnDestroy {
  protected readonly DateTime = DateTime;
  protected isAuthorisedToEdit: boolean = false;
  protected youngRegistrationData: RegistrationAdultData[];
  protected selectedAdditionsToFilter: string[] = [];
  protected displayedColumns: string[];
  protected dataSource: any;
  protected registrationDataSubscription: Subscription;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private registrationAdultService: Registration1926DaoService,
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
    this.registrationDataSubscription = this.registrationAdultService.getAll().subscribe({
      next: (regInfos: RegistrationAdultData[]) => {
        this.displayedColumns = [
          'position', 'name', 'age', 'advancePayed', 'fullAmountPayed', 'creationTimestamp'
        ];
        if (this.isAuthorisedToEdit) {
          this.displayedColumns.push('id', 'markDeleted');
        }
        this.youngRegistrationData = regInfos.sort((a, b) => {
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
        return item.question5?.toLowerCase() || '';
      case 'age':
        return item.question7;
      case 'advancePayed':
        return this.translateService.get(this.presentBooleanField(item.advancePayed));
      case 'fullAmountPayed':
        return this.translateService.get(this.presentBooleanField(item.fullAmountPayed));
      case 'lastModificationTimestamp':
      case 'creationTimestamp':
        return DateTime.fromISO(item[property]).toMillis();
      default:
        return item[property];
    }
  }

  protected presentBooleanField(booleanValue: boolean): string {
    return booleanValue ? 'bk.admin.panel.table.yes' : 'bk.admin.panel.table.no';
  }

  protected filterOriginalData(): void {
    let filerByNotPayedSome: boolean = false;
    let filerByNotPayedAll: boolean = false;
    let filterOnlyDeleted: boolean = false;
    this.selectedAdditionsToFilter.forEach((setting) => {
      switch(setting) {
        case 'somePayed':
          filerByNotPayedSome = true;
          break;
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

    let filteredData = this.youngRegistrationData
      .filter(elem => {
        if (!filerByNotPayedSome) {
          return true;
        }
        return !elem.advancePayed;
      })
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

  protected openRegistrationDetailsYoung(id: string): any {
    const dialogRef = this.dialog.open(
      RegistrationDetailsPopupAdultComponent,
      {
        maxWidth: '700px',
        disableClose: true,
        data: this.youngRegistrationData.find(elem => elem.id === id)
      }
    );
  }

  protected restoreDeleted(id: string) {
    this.authService.loggedUserPromise()
      .then((customUser: CustomUser | null) => {
        if (customUser === null) {
          throw new Error('Currently logged user cannot be null!');
        }
        let regData = this.youngRegistrationData.find(elem => elem.id === id);
        if (regData === undefined) {
          throw new Error('Red data cannot be undefined!');
        }
        this.registrationAdultService.markAsUnDeleted(regData, customUser.firstName + ' ' + customUser.lastName)
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
        let regData = this.youngRegistrationData.find(elem => elem.id === id);
        if (regData === undefined) {
          throw new Error('Red data cannot be undefined!');
        }
        this.registrationAdultService.markAsDeleted(regData, customUser.firstName + ' ' + customUser.lastName)
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

  protected calculateFullYears(luzonDateStr: string): number {
    const luzonDate = DateTime.fromISO(luzonDateStr);
    const currentDate = DateTime.now();
    let yearsDifference = currentDate.year - luzonDate.year;
    if (currentDate < luzonDate.plus({ years: yearsDifference })) {
      yearsDifference--;
    }
    return yearsDifference;
  }

}
