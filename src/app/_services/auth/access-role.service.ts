import {Injectable, OnDestroy} from '@angular/core';
import {AuthService} from "./auth.service";
import {AccessPageEnum} from "./access-page-enum";
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

  public isAuthorizedToSeePage(accessPage: AccessPageEnum): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.authService.loggedUser().subscribe({
        next: (customUser) => {
          if (customUser !== null) {
            resolve(this.isAuthorizedRoleToSeePage(customUser.roles, accessPage));
          } else {
            reject("User is null");
          }
        },
        error: (err) => reject(err)
      });
    });
  }

  private isAuthorizedRoleToSeePage(roles: AccessRole[], page: AccessPageEnum): boolean {
    switch (page) {
      case AccessPageEnum.SETTINGS:
        return roles.includes(AccessRole.ADMIN_FULL_ACCESS);
      default:
        throw new Error('Unrecognized access page: "' + page + '"');
    }
  }

}
