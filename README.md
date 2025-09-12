# Word Checker App

This project was generated with latest version of [Angular CLI](https://github.com/angular/angular-cli).

## Local server

Run `ng serve` for a local server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## GitHub pages

[Deployed app on GitHub pages](https://szymciogrosik.github.io/word-checker-app)

## Firebase hosting

[Deployed app on firebase hosting](https://word-checker-app-2cbfd.web.app)

## Change version of angular cli

npm uninstall -g @angular/cli

npm cache clean --force

npm cache verify

npm install -g @angular/cli@wished.version.here

ng version

## Use template

Create new project based on template. Do not copy branches.
Add and push new two branches:
- release/gh-pages
- release/firebase


## Setup firebase

- Create a project
- Enable authentication (email and google with default settings)
- Add dummy user in authentication console by: email: email@gmail.com, pass: <whatever you want> -> copy the uid and store somewhere
- Navigate to the Settings in Authentication, and select Authorized domains. Add your GitHub pages domain, in my case it is: szymciogrosik.github.io

- Create Firebase database -> location: Warsaw -> Start in prod mode
- Add dummy user in authentication console by:  (location -> users -> AdamAbacki -> the rest as following)
- email: type string: email@gmail.com (your google email)
- firstName: type string: Adam
- lastName: type string: Abacki
- roles: type array -> string: ADMIN_FULL_ACCESS
- uid: type string: <copied from authentication>
- Fill in "Rules" tab
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

- Generate firebase config (Settings on the top -> General -> Scroll down "Web" -> process with guide)
- Add firebase config to codebase (without api key ofc), to the files:
  - environment.ts
  - firebase/environment.ts
  - ftp/environment.ts
  - gh-pages/environment.ts

- Install firebase cli (https://firebase.google.com/docs/cli?hl=pl)
- Install tools if not installed yet: npm install -g firebase-tools
- firebase login
- firebase init (will added GH secret FIREBASE_SERVICE_ACCOUNT_<PROJECT_NAME> as private key generated on service accounts page). Select:
  - Hosting -> Create a new project
  - What do you want to use as your public directory? Enter
  - ✔ Configure as a single-page app (rewrite all urls to /index.html)? Yes
  - ✔ Set up automatic builds and deploys with GitHub? Yes -> provide your user/repository
- Check if you are turned on API Identity and Access Management (IAM)
  - Open Google Cloud Console (https://console.cloud.google.com/apis/library)
  - Select project (your app name).
  - Select API & Services → Enabled APIs & services.
  - If there is no Identity and Access Management (IAM) API, turn them on:
  - Enable APIs & Services → search "IAM Service Account Credentials API" → Enable.
- firebase init. Select:
  - Hosting
  - What do you want to use as your public directory? Enter
  - ✔ Configure as a single-page app (rewrite all urls to /index.html)? Yes
  - ✔ Set up automatic builds and deploys with GitHub? Yes -> provide your user/repository
  - Set up the workflow to run a build script before every deploy? (Y/n) -> n
  - Set up automatic deployment to your site's live channel when a PR is merged? (Y/n) -> n
- Revert changes in firebase.json file

- GH settings -> Actions -> General -> Workflow permissions ->
- + Read and write permissions
- + Allow GitHub Actions to create and approve pull requests

- GH Pages
- GH -> Settings -> Pages -> Build and deployment: GitHub Actions
- GH -> Settings -> Environments -> github-pages -> Deployment branches and tags -> add release/gh-pages
- GH -> Settings -> Environments -> github-pages -> add secret FIREBASE_API_KEY (from Firebase app)
- GH -> Settings -> Environments -> firebase -> add secret FIREBASE_API_KEY (from Firebase app)

- Copy and paste environment-example.ts to environment.ts and replace firebase config

- Replace all places with angular-firebase-accelerator with your app name. Only in those places provide your unique firebase app id:
  - .firebaserc
  - CI - firebase - Step 2 - Build and deploy to firebase-release.yaml (two places in that file)
  - README.md (link to firebase hosting)

- Replace also token in:
  - FIREBASE_SERVICE_ACCOUNT_ANGULAR_FIREBASE_ACCELERATOR -> your token name from GitHub
