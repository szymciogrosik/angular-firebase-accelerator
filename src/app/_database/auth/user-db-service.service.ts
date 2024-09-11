import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {CustomUser} from "../../_models/user/custom-user";
import {map, Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class UserDbService {
  private dbPathBase: string = '/users';

  constructor(private db: AngularFirestore) {
  }

  public getUser(uid: string, email: string): AngularFirestoreCollection<CustomUser> {
    return this.db.collection<CustomUser>(this.dbPathBase, ref =>
      ref.where('uid', '==', uid)
        .where('email', '==', email)
    );
  }

  public getAll(): Observable<CustomUser[]> {
    return this.db.collection<CustomUser>(this.dbPathBase).snapshotChanges()
      .pipe(
        map(changes => changes.map(c => {
          const data = c.payload.doc.data() as CustomUser;
          return {
            ...data,
            id: c.payload.doc.id
          };
        }))
      );
  }

  delete(id: string): Promise<void> {
    return this.db.collection<CustomUser>(this.dbPathBase).doc(id).delete();
  }

  update(docId: string, updatedUser: any): Promise<void> {
    return this.db.doc(this.dbPathBase + '/' + docId).update(updatedUser);
  }

  create(newUser: CustomUser): Promise<void> {
    return new Promise((resolve, reject) => {
      return this.db.collection<CustomUser>(this.dbPathBase).add({...newUser})
        .then(() => resolve())
        .catch((err) => reject(err));
    });
  }

}
