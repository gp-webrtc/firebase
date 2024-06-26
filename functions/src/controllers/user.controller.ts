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

import _ from 'lodash';
import { Change, DocumentSnapshot, FirestoreEvent, QueryDocumentSnapshot } from 'firebase-functions/v2/firestore';
import { logger } from 'firebase-functions/v2';

import { GPWUser } from '../models';
// import { userNotificationTokenService, userService } from '../services';
// import { userNotificationController } from '.';

export class GPWUserController {
    async onDocumentCreated(event: FirestoreEvent<DocumentSnapshot | undefined, { userId: string }>) {
        const userId = event.params.userId;
        const user = event.data;
        logger.debug(`Document /users/${userId} created`, user);

        // Example alert notification
        // const data = {
        //     encryptedTitle: Buffer.from('New friend added', 'utf-8').toString('base64'),
        //     encryptedBody: Buffer.from('A new friend has been added', 'utf-8').toString('base64'),
        //     encryptedCategoryIdentifier: Buffer.from('org.gpfister.republik.newContact', 'utf-8').toString('base64'),
        //     encryptedPayload: '',
        // };
        // const users = await userService.getAll();
        // for (const user of users) {
        //     if (user.userId !== userId) {
        //         data.encryptedPayload = Buffer.from(
        //             JSON.stringify({
        //                 userId: user.userId,
        //                 contactId: userId,
        //                 displayName: 'Automatically added',
        //                 publicKey: '',
        //                 nonce: 0,
        //             }),
        //             'utf-8'
        //         ).toString('base64');
        //         userNotificationController.send(user.userId, {
        //             type: 'userEncrypted',
        //             pushType: 'alert',
        //             priority: 5,
        //             expiration: 7 * 24 * 3600,
        //             collapseId: userId,
        //             data: { ...data },
        //         });
        //     }
        // }
    }

    async onDocumentUpdated(event: FirestoreEvent<Change<QueryDocumentSnapshot> | undefined, { userId: string }>) {
        if (event.data) {
            const before = event.data.before.data() as GPWUser;
            const after = event.data.after.data() as GPWUser;

            // Skipped if this is related to a data update
            if (
                // ('modelVersion' in before && 'modelVersion' in after && before.modelVersion !== after.modelVersion) ||
                // (!('modelVersion' in before) && 'modelVersion' in after) ||
                // ('modelVersion' in before && !('modelVersion' in after))
                _.isEqual(before.modelVersion, after.modelVersion)
            ) {
                return;
            }

            // // If this is a monitored change
            // if (!_.isEqual(before.settings, after.settings)) {
            //     if (!after.settings.notifications.isEnabled) await userNotificationTokenService.deleteAll(userId);
            //     await userService.updateModificationDate(userId);
            // }
        }
    }

    async onDocumentDeleted(event: FirestoreEvent<DocumentSnapshot | undefined, { userId: string }>) {
        const userId = event.params.userId;
        logger.debug(`Document /users/${userId} deleted`);

        // // Example background notification
        // const data = {
        //     encryptedCategoryIdentifier: Buffer.from('org.gpfister.republik.deletedContact', 'utf-8').toString(
        //         'base64'
        //     ),
        //     encryptedPayload: '',
        // };
        // const users = await userService.getAll();
        // for (const user of users) {
        //     if (user.userId !== userId) {
        //         data.encryptedPayload = Buffer.from(
        //             JSON.stringify({
        //                 userId: user.userId,
        //                 contactId: userId,
        //             }),
        //             'utf-8'
        //         ).toString('base64');
        //         userNotificationController.send(user.userId, {
        //             type: 'userEncrypted',
        //             pushType: 'background',
        //             priority: 5,
        //             expiration: 7 * 24 * 3600,
        //             data: { ...data },
        //         });
        //     }
        // }
    }
}
