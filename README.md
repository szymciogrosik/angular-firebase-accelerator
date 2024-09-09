# Angular Firebase Accelerator app

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.10.

## Local server

Run `ng serve` for a local server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## GitGub pages

[Deployed app on GitHub pages](https://szymciogrosik.github.io/angular-firebase-accelerator)

## Firebase hosting

[Deployed app on firebase hosting](https://szymciogrosik.github.io/angular-firebase-accelerator)

## Change version of angular cli

npm uninstall -g @angular/cli

npm cache clean --force

npm cache verify

npm install -g @angular/cli@wished.version.here

ng version

## Setup firebase

- Create a project
- Enable authentication (email and google with default settings)
- Add dummy logged user

- Generate firebase config (main page -> </> -> with hosting)
- Add firebase config to codebase (without api key ofc)

- Firestore database, create new -> location warsaw -> start in prod mode -> fill:
```json
rules_version = '2';

service cloud.firestore {
 match /databases/{database}/documents {
   // Match any document in the database
   match /{document=**} {
     allow read: if false;
     allow write: if false;
   }

	 // Specific rules for the 'public_settings' collection
   match /public_settings/{document=**} {
     allow read: if true;
     allow write: if request.auth != null;
   }
   
   // Specific rules for the 'users' collection
   match /users/{document=**} {
     allow read: if request.auth != null;
     allow write: if request.auth != null;
   }

   // Specific rules for the 'registration' collection
   match /registration_13_18/{document=**} {
   	 allow read: if request.auth != null;
     allow write: if true;
   }
   match /registration_19_26/{document=**} {
   	 allow read: if request.auth != null;
     allow write: if true;
   }
   match /registration_staff/{document=**} {
   	 allow read: if request.auth != null;
     allow write: if true;
   }
 }
}
```

- 
