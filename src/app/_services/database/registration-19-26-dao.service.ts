import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentChangeAction} from "@angular/fire/compat/firestore";
import {RegistrationAdultData} from "../../_models/registration/registration-adult-data";
import {map, Observable} from "rxjs";
import {RegistrationSharedDaoService} from "./registration-shared-dao.service";

@Injectable({
  providedIn: 'root'
})
export class Registration1926DaoService {

  private dbPathBase: string = '/registration_';
  private dbPathSuffix: string = '19_26';

  registrationData: AngularFirestoreCollection<RegistrationAdultData>;

  constructor(
    private sharedDAO: RegistrationSharedDaoService,
    private db: AngularFirestore
  ) {
    this.registrationData = db.collection(this.getDbPath());
  }

  getAll(): Observable<RegistrationAdultData[]> {
    return this.db.collection(this.getDbPath()).snapshotChanges()
      .pipe(
        map(changes => changes
          .map(this.mapDocumentChangeActionToRegistrationAdultData)
        )
      );
  }

  getNotDeletedOnly(): Observable<RegistrationAdultData[]> {
    return this.db.collection(this.getDbPath()).snapshotChanges()
      .pipe(
        map(changes => changes
          .map(this.mapDocumentChangeActionToRegistrationAdultData)
          .filter(data => !data.deleted)
        )
      );
  }

  private mapDocumentChangeActionToRegistrationAdultData(c: DocumentChangeAction<unknown>): RegistrationAdultData {
    const data = c.payload.doc.data() as RegistrationAdultData;
    return {
      ...data,
      id: c.payload.doc.id
    };
  }

  create(tutorial: RegistrationAdultData): any {
    return this.registrationData.add({ ...tutorial });
  }

  update(id: string, data: any): Promise<void> {
    return this.registrationData.doc(id).update(data);
  }

  markAsDeleted(regDataToUpdate: RegistrationAdultData, editedByUser: string): Promise<void> {
    return this.sharedDAO.markDeleted(this.registrationData, regDataToUpdate.id, regDataToUpdate, editedByUser, true);
  }

  markAsUnDeleted(regDataToUpdate: RegistrationAdultData, editedByUser: string): Promise<void> {
    return this.sharedDAO.markDeleted(this.registrationData, regDataToUpdate.id, regDataToUpdate, editedByUser, false);
  }

  delete(id: string): Promise<void> {
    return this.registrationData.doc(id).delete();
  }

  private getDbPath() {
    return this.dbPathBase + this.dbPathSuffix;
  }

}
