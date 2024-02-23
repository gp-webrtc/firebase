[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.md)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)

# Greg's WebRTC - Firebase backend

> Copyright © 2024, Greg PFISTER. MIT License.

## About

This repository is providing a backend implementation using Firebase (Cloud
Firestore, Cloud Functions and Cloud Storage).

This is not production ready, but a test implementation.

- Step 1 (in development): Support peer-to-peer WebRTC
- Step 2 (upcomming): Support TURN server

This project could be release on any Firebase project, with Blaze plan
(required for Cloud Functions).

## Build and run

It is not necessary important to deploy to Firebase, as Emulators could be used.

To build and run using emulators, we recommend using `Visual Studio Code` and
`Docker`.

Then, for basic operations:

- Start the Dev Container
- Get dependencies: `npm ci && (cd functions; npm ci)`.
- Login to Firebase: `firebase-cli login`.
- Change the Firebase project in `.firebaserc`.
- Build the cloud functions: `(cd functions; npm run build)`
- Run the emulators: `npm run emul`

It is possible to run and build concurrently (meaning running the emaulators
on one side and build/watch the functions). To do so:

- Open a terminal and run the emulator.
- Open another terminal, go the `functions` folder and run `npm run build:watch`.

The emulator can retain data, to do so:

- `npm run emul:export` with start an empty emulator and export the data when
  closed.
- `npm run emul:import` will start the emulator loading the previous export (if
  any, other the emulator is empty), and export the data when closed.

## Deployment

Before deploying, the credentials for the admin service account must be
generated and stored at the root of the project:

```sh
gcloud iam service-accounts keys create credentials.json \
  --key-file-type=json \
  --iam-account=firebase-adminsdk-1803z@gp-webrtc.iam.gserviceaccount.com
```

To deploy, you must run `npm run deploy`.

## Contributions

Contributions are welcome, please read our [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## License

See [LICENSE.md](LICENSE.md).
