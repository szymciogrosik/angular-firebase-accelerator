import {Injectable} from '@angular/core';
import {DateTime} from "luxon";
import {AngularFirestoreCollection} from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root'
})
export class RegistrationSharedDaoService {

  constructor() { }

  public markDeleted<T>(regData: AngularFirestoreCollection<T>, docId: string, dataToUpdate: any, editedByUser: string, deleted: boolean): Promise<void> {
    const updatedData = { ...dataToUpdate };

    updatedData.deleted = deleted;
    updatedData.lastModificationTimestamp = DateTime.now().toString();
    updatedData.lastModificationUser = editedByUser;

    return regData.doc(docId).update(updatedData);
  }

}
