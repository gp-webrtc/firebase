//
// gp-webrtc-firebase
// Copyright (c) 2024, Greg PFISTER. MIT License.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the “Software”), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

import { initializeApp } from 'firebase-admin/app';
import * as functions from 'firebase-functions';

import {
    authController,
    coreController,
    // httpController,
    userController,
    // userDeviceController,
    userNotificationTokenController,
    userNotificationController,
} from './controllers';
import { onCall /*, onRequest */ } from 'firebase-functions/v2/https';
import { onDocumentCreated, onDocumentDeleted, onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { setGlobalOptions } from 'firebase-functions/v2/options';

// Initialize firebase App
initializeApp();

setGlobalOptions({ region: 'europe-west3' });

const enforceAppCheck = !process.env.GPW_FIREBASE_EMULATOR ? true : false;

export const auth = {
    // onAccountCreated: functions
    //     .runWith({ secrets: ['RANDOMMER_IO_API_KEY'] })
    //     .region('europe-west3')
    //     .auth.user()
    //     .onCreate(authController.onAccountCreated),
    onAccountDeleted: functions.region('europe-west3').auth.user().onDelete(authController.onAccountDeleted),
};

export const core = {
    initEmulator: onCall({ region: 'europe-west3', enforceAppCheck: enforceAppCheck }, coreController.initEmulator),
    updateModel: onCall({ region: 'europe-west3', enforceAppCheck: enforceAppCheck }, coreController.updateModel),
};

export const user = {
    // User documents
    onCreated: onDocumentCreated('/users/{userId}', userController.onDocumentCreated),
    onUpdated: onDocumentUpdated('/users/{userId}', userController.onDocumentUpdated),
    onDeleted: onDocumentDeleted('/users/{userId}', userController.onDocumentDeleted),

    // // User Device documents
    // onDeviceCreated: onDocumentCreated('users/{userId}/devices/{deviceId}', userDeviceController.onDocumentCreated),
    // onDeviceUpdated: onDocumentUpdated('users/{userId}/devices/{deviceId}', userDeviceController.onDocumentUpdated),

    // User notification token callable functions
    insertOrUpdateNotificationToken: onCall(
        { region: 'europe-west3', enforceAppCheck: enforceAppCheck },
        userNotificationTokenController.onInsertOrUpdateFunctionCalled
    ),
    deleteNotificationTokenDelete: onCall(
        { region: 'europe-west3', enforceAppCheck: enforceAppCheck },
        userNotificationTokenController.onDeleteFunctionCalled
    ),

    // User notifications
    sendEncryptedNotification: onCall(
        {
            region: 'europe-west3',
            enforceAppCheck: enforceAppCheck,
            secrets: ['GPW_APNS_KEY', 'GPW_APNS_KEY_DEV', 'GPW_APNS_KEY_ID', 'GPW_APNS_KEY_ID_DEV', 'GPW_APNS_TEAM_ID'],
        },
        userNotificationController.onSendEncryptedNotificationCalled
    ),
    onNotificationUpdated: onDocumentUpdated(
        'users/{userId}/notifications/{notificationId}',
        userNotificationController.onDocumentUpdated
    ),
};

// export const test = {
//     http: onRequest(
//         { secrets: ['GPW_APNS_KEY', 'GPW_APNS_KEY_DEV', 'GPW_APNS_KEY_ID', 'GPW_APNS_KEY_ID_DEV', 'GPW_APNS_TEAM_ID'] },
//         httpController
//     ),
// };
