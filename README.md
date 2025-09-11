# Angular Firebase Accelerator app

This project was generated with latest version of [Angular CLI](https://github.com/angular/angular-cli).

## Local server

Run `ng serve` for a local server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## GitHub pages

[Deployed app on GitHub pages](https://szymciogrosik.github.io/angular-firebase-accelerator)

## Firebase hosting

[Deployed app on firebase hosting](https://angular-firebase-accelerator.web.app)

## Change version of angular cli

npm uninstall -g @angular/cli

npm cache clean --force

npm cache verify

npm install -g @angular/cli@wished.version.here

ng version

## Setup firebase

- Create a project
- Enable authentication (email and google with default settings)
- Add dummy logged user + add it to Firestore database:
- email: email@gmail.com
- firstName: "Adam"
- lastName: "Abacki"
- roles: ["ADMIN_FULL_ACCESS"]
- uid: "FROM_AUTHENTICATION"

- If you are planning to use GH-pages add a page to authentication -> Settings -> Authorized domains

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
 }
}
```
- Install firebase cli (https://firebase.google.com/docs/cli?hl=pl)
- firebase login
- firebase init - will be added GH secret FIREBASE_SERVICE_ACCOUNT_<PROJECT_NAME> as private key generated on service accounts page

- GH settings -> Workflow permissions -> Read and write permissions
- + Allow GitHub Actions to create and approve pull requests
- GH settings -> pages -> enable from GitHub Actions

- GH Pages
- GH -> Settings -> Pages -> GitHub Actions
- GH -> Settings -> Environment -> github-pages -> Deployment branches and tags -> add release/gh-pages
- Firebase -> Authentication -> Settings -> Authorized domains -> add GitHub page
- GH -> Settings -> environment -> gh-pages -> add secret FIREBASE_API_KEY

- Copy and paste environment-example.ts to environment.ts
