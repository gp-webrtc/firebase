//
// gp-webrtc/firebase
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
import { AuthBlockingEvent } from 'firebase-functions/v2/identity';
import { GPWUser } from '../models';
import { Timestamp } from 'firebase-admin/firestore';

export class GPWUserService {
    async get(userId: string): Promise<GPWUser | undefined> {
        const db = firestore();
        return (await db.collection('/users').doc(userId).get())?.data() as GPWUser;
    }

    async create(userId: string, displayName: string) {
        const db = firestore();
        const ts = Timestamp.now();

        // Create the user record
        const user: GPWUser = {
            userId: userId,
            isEncrypted: false,
            encrypted: Buffer.from(JSON.stringify({ displayName })).toString('base64'),
            creationDate: ts,
            modificationDate: ts,
        };
        await db.collection('/users').doc(userId).create(user);
    }

    async updateLastSignIn(userId: string, event: AuthBlockingEvent) {
        const db = firestore();
        await db.collection('/users').doc(userId).update({ lastSignInDate: event.timestamp });
    }

    async delete(userId: string) {
        const db = firestore();
        await db.collection('/users').doc(userId).delete();
    }
}
