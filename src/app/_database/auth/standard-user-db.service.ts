import { Injectable } from '@angular/core';
import { UserDbService } from './user-db-service.service';
import { CustomUser } from '../../_models/user/custom-user';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StandardUserDbService {
  constructor(private userDbService: UserDbService) {}

  /**
   * Pobiera pojedynczego użytkownika po uid i email.
   * Zwraca Promise<CustomUser | null>.
   */
  public async getUser(uid: string, email: string | null): Promise<CustomUser | null> {
    if (email === null) {
      throw new Error('Email cannot be null!');
    }

    try {
      // modularne API zwraca Observable<CustomUser[]>
      const users = await firstValueFrom(this.userDbService.getUser(uid, email));
      if (users.length === 1) {
        return users[0];
      } else if (users.length === 0) {
        return null;
      } else {
        throw new Error('There are more than one user saved with the same uid and id');
      }
    } catch (err: unknown) {
      throw err;
    }
  }
}
