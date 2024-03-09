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

import { firestore } from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

import { GPWCoreModelVersion, GPWUser, GPWUserSettings } from '../models';

export class GPWUserService {
    async get(userId: string): Promise<GPWUser | undefined> {
        const db = firestore();
        return (await db.collection('/users').doc(userId).get())?.data() as GPWUser;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async create(
        userId: string,
        encrypted: string,
        isEncrypted: boolean,
        settings: GPWUserSettings,
        modelVersion: GPWCoreModelVersion
    ) {
        const db = firestore();
        const ts = Timestamp.now();

        // Create the user record
        const user: GPWUser = {
            // modelVersion: modelVersion,
            userId: userId,
            isEncrypted: isEncrypted,
            encrypted: encrypted,
            settings: settings,
            modelVersion: modelVersion,
            creationDate: ts,
            modificationDate: ts,
        };
        await db.collection('/users').doc(userId).create(user);
    }

    async save(userId: string, user: GPWUser) {
        const db = firestore();
        const ts = Timestamp.now();

        user.modificationDate = ts;
        await db.collection('/users').doc(userId).update(user);
    }

    async delete(userId: string) {
        const db = firestore();
        await db.collection('/users').doc(userId).delete();
    }
}
