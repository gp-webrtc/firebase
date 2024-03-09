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

import { Change, DocumentSnapshot, FirestoreEvent, QueryDocumentSnapshot } from 'firebase-functions/v2/firestore';
// import { logger } from 'firebase-functions/v2';

import { GPWUser } from '../models';
import { userService } from '../services';

export class GPWUserController {
    async onDocumentCreated(event: FirestoreEvent<DocumentSnapshot | undefined, { userId: string }>) {
        if (event.data) {
            const userId = event.params.userId;

            const data = event.data.data() as GPWUser;

            await userService.create(userId, data.encrypted, data.isEncrypted, data.settings, data.modelVersion);
        }
    }

    async onDocumentUpdated(event: FirestoreEvent<Change<QueryDocumentSnapshot> | undefined, { userId: string }>) {
        if (event.data) {
            const userId = event.params.userId;
            const before = event.data.before.data() as GPWUser;
            const after = event.data.after.data() as GPWUser;

            // Skipped if this is related to a data update
            if (
                ('modelVersion' in before && 'modelVersion' in after && before.modelVersion !== after.modelVersion) ||
                (!('modelVersion' in before) && 'modelVersion' in after) ||
                ('modelVersion' in before && !('modelVersion' in after))
            ) {
                return;
            }

            // If this is a monitored change
            if (
                before.encrypted !== after.encrypted ||
                before.isEncrypted !== after.isEncrypted ||
                before.settings !== after.settings
            ) {
                await userService.save(userId, after);
            }
        }
    }
}
