import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentChangeAction} from "@angular/fire/compat/firestore";
import {map, Observable} from "rxjs";
import {RegistrationStaffData} from "../../_models/registration/registration-staff-data";
import {RegistrationSharedDaoService} from "./registration-shared-dao.service";

@Injectable({
  providedIn: 'root'
})
export class RegistrationStaffDaoService {

  private dbPathBase: string = '/registration_';
  private dbPathSuffix: string = 'staff';

  registrationData: AngularFirestoreCollection<RegistrationStaffData>;

  constructor(
    private sharedDAO: RegistrationSharedDaoService,
    private db: AngularFirestore
  ) {
    this.registrationData = db.collection(this.getDbPath());
  }

  getAll(): Observable<RegistrationStaffData[]> {
    return this.db.collection(this.getDbPath()).snapshotChanges()
      .pipe(
        map(changes => changes
          .map(this.mapDocumentChangeActionToRegistrationStaffData)
        )
      );
  }

  getNotDeletedOnly(): Observable<RegistrationStaffData[]> {
    return this.db.collection(this.getDbPath()).snapshotChanges()
      .pipe(
        map(changes => changes
          .map(this.mapDocumentChangeActionToRegistrationStaffData)
          .filter(data => !data.deleted)
        )
      );
  }

  private mapDocumentChangeActionToRegistrationStaffData(c: DocumentChangeAction<unknown>): RegistrationStaffData {
    const data = c.payload.doc.data() as RegistrationStaffData;
    return {
      ...data,
      id: c.payload.doc.id
    };
  }

  create(registrationData: RegistrationStaffData): any {
    return this.registrationData.add({ ...registrationData });
  }

  update(id: string, data: any): Promise<void> {
    return this.registrationData.doc(id).update(data);
  }

  markAsDeleted(regDataToUpdate: RegistrationStaffData, editedByUser: string): Promise<void> {
    return this.sharedDAO.markDeleted(this.registrationData, regDataToUpdate.id, regDataToUpdate, editedByUser, true);
  }

  markAsUnDeleted(regDataToUpdate: RegistrationStaffData, editedByUser: string): Promise<void> {
    return this.sharedDAO.markDeleted(this.registrationData, regDataToUpdate.id, regDataToUpdate, editedByUser, false);
  }

  delete(id: string): Promise<void> {
    return this.registrationData.doc(id).delete();
  }

  private getDbPath() {
    return this.dbPathBase + this.dbPathSuffix;
  }

}
