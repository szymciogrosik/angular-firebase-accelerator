import {computed, inject, Injectable, Signal} from '@angular/core';
import {AuthService} from './auth.service';
import {AccessRole} from '../../_models/user/access-role';
import {catchError, firstValueFrom, map, Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccessRoleService {
  private readonly authService = inject(AuthService);

  public isAuthorizedSignal(requestedRole: AccessRole): Signal<boolean> {
    return computed(() => {
      const user = this.authService.currentUser();
      return !!user?.roles.includes(requestedRole);
    });
  }

  public async isAuthorized(requestedRole: AccessRole): Promise<boolean> {
    try {
      const user = await firstValueFrom(this.authService.loggedUser());
      return !!user?.roles.includes(requestedRole);
    } catch {
      return false;
    }
  }

  public isAuthorized$(requestedRole: AccessRole): Observable<boolean> {
    return this.authService.loggedUser().pipe(
      map(customUser => !!customUser && customUser.roles.includes(requestedRole)),
      catchError(() => of(false))
    );
  }
}
