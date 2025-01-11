import {Injectable} from '@angular/core';
import {UserDbService} from "./user-db-service.service";
import {CustomUser} from "../../_models/user/custom-user";

@Injectable({
  providedIn: 'root'
})
export class StandardUserDbService {

  constructor(
    private userDbService: UserDbService
  ) {
  }

  public getUser(uid: string, email: string | null): Promise<CustomUser | null> {
    if (email === null) {
      throw new Error("Email cannot be null!")
    }

    return new Promise((resolve, reject) => {
      this.userDbService.getUser(uid, email).valueChanges()
        .subscribe({
          next: (customUser) => {
            if (customUser.length === 1) {
              resolve(customUser[0]);
            } else if (customUser.length === 0) {
              resolve(null);
            } else {
              reject("There are more than one user saved with the same uid and id");
            }
          },
          error: (err) => reject(err)
        });
    });
  }

}
