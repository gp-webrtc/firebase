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

import { userController, userFCMRegistrationTokenController } from './controllers';
import { onCall } from 'firebase-functions/v2/https';

// Initialize firebase App
initializeApp();

export const user = {
    // Auth triggers
    onAccountCreated: functions
        .runWith({ secrets: ['RANDOMMER_IO_API_KEY'] })
        .region('europe-west3')
        .auth.user()
        .onCreate(userController.onAccountCreated),
    onAccountDeleted: functions.region('europe-west3').auth.user().onDelete(userController.onAccountDeleted),
    insertOrUpdateFCMRegistrationToken: onCall(
        { region: 'europe-west3' },
        userFCMRegistrationTokenController.onInsertOrUpdateFunctionCalled
    ),
    deleteFCMRegistrationTokenDelete: onCall(
        { region: 'europe-west3' },
        userFCMRegistrationTokenController.onDeleteFunctionCalled
    ),
};
