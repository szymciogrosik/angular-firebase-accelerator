import {Injectable, OnDestroy} from '@angular/core';
import {AuthService} from "./auth.service";
import {AccessPage} from "./access-page";
import {AccessRole} from "../../_models/user/access-role";

@Injectable({
  providedIn: 'root'
})
export class AccessRoleService implements OnDestroy {

  constructor(
    private authService: AuthService
  ) {
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  public isAuthorizedToSeePage(accessPage: AccessPage): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.authService.loggedUser().subscribe({
        next: (customUser) => {
          if (customUser !== null) {
            resolve(this.isAuthorizedRoleToSeePage(customUser.role, accessPage));
          } else {
            reject("User is null");
          }
        },
        error: (err) => reject(err)
      });
    });
  }

  private isAuthorizedRoleToSeePage(role: AccessRole, page: AccessPage): boolean {
    switch (page) {
      case AccessPage.STATISTICS:
        return role === AccessRole.ADMIN_FULL_ACCESS
          || role === AccessRole.ADMIN_REGISTERED_DATA
          || role === AccessRole.ADMIN_REGISTERED_DATA_WITH_UPDATE
          || role === AccessRole.ADMIN_STATISTICS;
      case AccessPage.REGISTERED_DATA:
        return role === AccessRole.ADMIN_FULL_ACCESS
          || role === AccessRole.ADMIN_REGISTERED_DATA
          || role === AccessRole.ADMIN_REGISTERED_DATA_WITH_UPDATE;
      case AccessPage.REGISTERED_DATA_UPDATE:
        return role === AccessRole.ADMIN_FULL_ACCESS
          || role === AccessRole.ADMIN_REGISTERED_DATA_WITH_UPDATE;
      case AccessPage.SETTINGS:
        return role === AccessRole.ADMIN_FULL_ACCESS;
      default:
        throw new Error('Unrecognized access page: "' + page + '"');
    }
  }

}
