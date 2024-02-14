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

import { Timestamp } from 'firebase-admin/firestore';
import { Change, DocumentSnapshot, FirestoreEvent, QueryDocumentSnapshot } from 'firebase-functions/v2/firestore';

import { userDeviceService } from '../services';
import { GPWUserDevice } from '../models';
import { userNotificationController } from '.';

export class GPWUserDeviceController {
    async onDocumentCreated(event: FirestoreEvent<DocumentSnapshot | undefined, { userId: string; deviceId: string }>) {
        if (event.data) {
            const userId = event.params.userId;

            const device = event.data.data() as GPWUserDevice;

            userNotificationController.send(userId, {
                type: 'onDeviceAdded',
                data: device,
            });
        }
    }

    async onDocumentUpdated(
        event: FirestoreEvent<Change<QueryDocumentSnapshot> | undefined, { userId: string; deviceId: string }>
    ) {
        const ts = Timestamp.now();

        if (event.data) {
            const userId = event.params.userId;
            const deviceId = event.params.deviceId;
            const before = event.data.before.data() as GPWUserDevice;
            const after = event.data.before.data() as GPWUserDevice;
            after.modificationDate = before.modificationDate;

            if (before.encrypted !== after.encrypted || before.isEncrypted !== after.isEncrypted) {
                after.modificationDate = ts;
                await userDeviceService.save(userId, deviceId, after);
            }
        }
    }

    // async onDocumentDeleted(event: FirestoreEvent<DocumentSnapshot | undefined, { userId: string; deviceId: string }>) {
    //     if (event.data) {
    //         const userId = event.params.userId;

    //         const device = event.data.data() as GPWUserDevice;

    //         userNotificationController.send(userId, {
    //             type: 'onDeviceRemoved',
    //             data: device,
    //         });
    //     }
    // }
}
