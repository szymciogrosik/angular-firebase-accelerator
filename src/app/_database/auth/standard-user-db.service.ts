import {Injectable, inject} from '@angular/core';
import {UserDbService} from './user-db-service.service';
import {CustomUser} from '../../_models/user/custom-user';
import {map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StandardUserDbService {
  private userDbService = inject(UserDbService);

  constructor() {}

  public watchUser(uid: string, email: string | null): Observable<CustomUser | null> {
    if (email === null) {
      throw new Error('Email cannot be null!');
    }

    return this.userDbService.getUser(uid, email).pipe(
      map(users => {
        if (users.length === 1) {
          return users[0];
        } else if (users.length === 0) {
          return null;
        } else {
          throw new Error('There are more than one user saved with the same uid and id');
        }
      })
    );
  }

  public async create(newUser: CustomUser): Promise<void> {
    return this.userDbService.create(newUser);
  }
}
