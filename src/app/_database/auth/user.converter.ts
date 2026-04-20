import {FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions} from '@angular/fire/firestore';
import {CustomUser} from '../../_models/user/custom-user';

export const userConverter: FirestoreDataConverter<CustomUser> = {
  toFirestore(user: CustomUser): any {
    // We do not store the "id" explicitly in the document data, as Firestore uses it for the Document ID.
    // However, if there are updates with partial data, this method handles them natively if using setDoc, 
    // but updateDoc does not natively use converters.
    const { id, ...dataToSave } = user;
    return dataToSave;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): CustomUser {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      uid: data['uid'] ?? '',
      email: data['email'] ?? '',
      firstName: data['firstName'] ?? '',
      lastName: data['lastName'] ?? '',
      roles: data['roles'] || [],
      photoUrl: data['photoUrl'] ?? null,
      isDeleted: data['isDeleted'] ?? false
    };
  }
};
