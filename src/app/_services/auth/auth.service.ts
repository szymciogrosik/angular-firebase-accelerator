import {Injectable} from '@angular/core';
import firebase from "firebase/compat/app";
import {BehaviorSubject, firstValueFrom, map, Observable} from "rxjs";
import {SnackbarService} from "../util/snackbar.service";
import {RedirectionEnum} from "../../../utils/redirection.enum";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import {CustomUser} from "../../_models/user/custom-user";
import {Router} from "@angular/router";
import {StandardUserDbService} from "../../_database/auth/standard-user-db.service";
import {CustomTranslateService} from "../translate/custom-translate.service";
import {getAuth, signInWithEmailAndPassword} from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject: BehaviorSubject<CustomUser | null>;
  private readonly user: Observable<CustomUser | null>;

  constructor(
    private router: Router,
    private snackbarService: SnackbarService,
    private angularFireAuth: AngularFireAuth,
    private standardUserService: StandardUserDbService,
    private translateService: CustomTranslateService
  ) {
    this.userSubject = new BehaviorSubject<CustomUser | null>(null);
    this.user = this.userSubject.asObservable();
    this.listenForLoggedInFirebaseEvents();
  }

  private listenForLoggedInFirebaseEvents() {
    this.angularFireAuth.authState.subscribe({
      next: (loggedUser) => {
        if (loggedUser !== null) {
          this.standardUserService.getUser(loggedUser.uid, loggedUser.email)
            .then((foundUser) => {
              if (foundUser !== null) {
                this.userSubject.next(foundUser);
              } else {
                this.logout(true);
                this.snackbarService.openLongSnackBar(this.translateService.get('bk.login.error.invalidUser'));
              }
            })
            .catch((error) => {
              this.logout(true);
              this.snackbarService.openLongSnackBar(this.translateService.get('bk.login.error.internal'));
              console.error(error);
            });
        } else {
          this.logout(false);
        }
      },
      error: (error) => {
        this.logout(false);
        this.snackbarService.openLongSnackBar(this.translateService.get('bk.login.error.internal'));
        console.error(error);
      }
    });
  }

  public registerUser(email: string, password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.angularFireAuth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          let uid: string | undefined = userCredential.user?.uid;
          if (uid) {
            resolve(uid);
          } else {
            reject('Registered user uid is undefined');
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public loginWithEmailAndPassword(email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      signInWithEmailAndPassword(getAuth(), email, password)
        .then(() => {
          resolve();
        })
        .catch((err) => {
          console.error(err);
          reject(this.translateService.get('bk.login.error.internal'));
        });
    });
  }

  public loginWithGoogleSso(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.angularFireAuth.signInWithPopup(new GoogleAuthProvider())
        .then(() => {
          resolve();
        })
        .catch((err) => {
          console.error(err);
          reject(this.translateService.get('bk.login.error.internal'));
        });
    });
  }

  public logout(withRedirection: boolean): void {
    this.angularFireAuth.signOut()
      .then(() => {
        this.userSubject.next(null);
        if (withRedirection) {
          this.router.navigate([RedirectionEnum.LOGIN]);
        }
      })
      .catch((error) => {
        this.userSubject.next(null);
        this.snackbarService.openLongSnackBar(this.translateService.get('bk.login.error.internal'));
        console.error(error);
      });
  }

  public isAuthenticated(): Observable<boolean> {
    return this.user.pipe(map(user => !!user));
  }

  public loggedUser(): Observable<CustomUser | null> {
    return this.user;
  }

  public async loggedUserPromise(): Promise<CustomUser | null> {
    return await firstValueFrom(this.loggedUser());
  }

}
