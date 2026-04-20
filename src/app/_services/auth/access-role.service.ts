import {computed, Injectable, Signal} from '@angular/core';
import {AuthService} from "./auth.service";
import {AccessRole} from "../../_models/user/access-role";
import {catchError, map, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AccessRoleService {

  constructor(
    private authService: AuthService
  ) {
  }

  public isAuthorizedSignal(requestedRole: AccessRole): Signal<boolean> {
    return computed(() => {
      const user = this.authService.currentUser();
      return !!user?.roles.includes(requestedRole);
    });
  }

  public isAuthorized(requestedRole: AccessRole): Promise<boolean> {
    return new Promise((resolve) => {
      const sub = this.authService.loggedUser().subscribe({
        next: (customUser) => {
          if (customUser !== null) {
            resolve(customUser.roles.includes(requestedRole));
            sub.unsubscribe();
          }
        },
        error: (err) => {
          resolve(false);
          sub.unsubscribe();
        }
      });
    });
  }

  public isAuthorized$(requestedRole: AccessRole): Observable<boolean> {
    return this.authService.loggedUser().pipe(
      map(customUser => !!customUser && customUser.roles.includes(requestedRole)),
      catchError(() => of(false))
    );
  }

}
