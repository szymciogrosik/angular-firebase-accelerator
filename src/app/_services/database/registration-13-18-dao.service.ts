import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentChangeAction} from "@angular/fire/compat/firestore";
import {RegistrationYoungData} from "../../_models/registration/registration-young-data";
import {map, Observable} from "rxjs";
import {RegistrationSharedDaoService} from "./registration-shared-dao.service";

@Injectable({
  providedIn: 'root'
})
export class Registration1318DaoService {

  private dbPathBase: string = '/registration_';
  private dbPathSuffix: string = '13_18';

  registrationData: AngularFirestoreCollection<RegistrationYoungData>;

  constructor(
    private sharedDAO: RegistrationSharedDaoService,
    private db: AngularFirestore
  ) {
    this.registrationData = db.collection(this.getDbPath());
  }

  getAll(): Observable<RegistrationYoungData[]> {
    return this.db.collection(this.getDbPath()).snapshotChanges()
      .pipe(
        map(changes => changes
          .map(this.mapDocumentChangeActionToRegistrationYoungData)
        )
      );
  }

  getNotDeletedOnly(): Observable<RegistrationYoungData[]> {
    return this.db.collection(this.getDbPath()).snapshotChanges()
      .pipe(
        map(changes => changes
          .map(this.mapDocumentChangeActionToRegistrationYoungData)
          .filter(data => !data.deleted)
        )
      );
  }

  private mapDocumentChangeActionToRegistrationYoungData(c: DocumentChangeAction<unknown>): RegistrationYoungData {
    const data = c.payload.doc.data() as RegistrationYoungData;
    return {
      ...data,
      id: c.payload.doc.id
    };
  }

  create(registrationData: RegistrationYoungData): any {
    return this.registrationData.add({ ...registrationData });
  }

  update(id: string, data: any): Promise<void> {
    return this.registrationData.doc(id).update(data);
  }

  markAsDeleted(regDataToUpdate: RegistrationYoungData, editedByUser: string): Promise<void> {
    return this.sharedDAO.markDeleted(this.registrationData, regDataToUpdate.id, regDataToUpdate, editedByUser, true);
  }

  markAsUnDeleted(regDataToUpdate: RegistrationYoungData, editedByUser: string): Promise<void> {
    return this.sharedDAO.markDeleted(this.registrationData, regDataToUpdate.id, regDataToUpdate, editedByUser, false);
  }

  delete(id: string): Promise<void> {
    return this.registrationData.doc(id).delete();
  }

  private getDbPath() {
    return this.dbPathBase + this.dbPathSuffix;
  }

}
