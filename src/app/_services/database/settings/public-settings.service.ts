import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class PublicSettingsService {
  private dbPathBase: string = '/public_settings';

  constructor(private db: AngularFirestore) {
  }

  public getDocument(docId: string): Observable<any> {
    const documentReference = this.db.doc(this.dbPathBase + '/' + docId);
    return documentReference.valueChanges();
  }

  public update(docId: string, data: any): Promise<void> {
    return this.db.doc(this.dbPathBase + '/' + docId).update(data);
  }

}
