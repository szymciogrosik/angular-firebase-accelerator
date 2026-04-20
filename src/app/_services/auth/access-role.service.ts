import {computed, inject, Injectable, Signal} from '@angular/core';
import {AuthService} from "./auth.service";
import {AccessRole} from "../../_models/user/access-role";
import {catchError, map, Observable, of, Subscription} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AccessRoleService {

  private authService = inject(AuthService);

  constructor() {}

  public isAuthorizedSignal(requestedRole: AccessRole): Signal<boolean> {
    return computed(() => {
      const user = this.authService.currentUser();
      return !!user?.roles.includes(requestedRole);
    });
  }

  public isAuthorized(requestedRole: AccessRole): Promise<boolean> {
    return new Promise((resolve) => {
      let sub: Subscription;
      sub = this.authService.loggedUser().subscribe({
        next: (customUser) => {
          if (customUser !== null) {
            resolve(customUser.roles.includes(requestedRole));
            if (sub) sub.unsubscribe();
          }
        },
        error: (err) => {
          resolve(false);
          if (sub) sub.unsubscribe();
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
