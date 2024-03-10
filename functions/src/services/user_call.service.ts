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

import * as UUID from 'uuid';
import { firestore } from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { GPWUserCall } from '../models';

export class GPWUserCallService {
    async get(userId: string, callId: string): Promise<GPWUserCall | undefined> {
        const db = firestore();
        return (await db.collection(`/users/${userId}/calls`).doc(callId).get())?.data() as GPWUserCall;
    }

    async create(userId: string, callerId: string, displayName: string): Promise<string> {
        const db = firestore();
        const ts = Timestamp.now();

        const callId = UUID.v4();

        // Create the user record
        const call: GPWUserCall = {
            userId: userId,
            callId: callId,
            callerId: callerId,
            displayName: displayName,
            creationDate: ts,
            modificationDate: ts,
        };
        await db.collection(`/users/${userId}/calls`).doc(callId).create(call);

        return callId;
    }

    async save(userId: string, callId: string, call: GPWUserCall) {
        const db = firestore();
        const ts = Timestamp.now();

        call.modificationDate = ts;
        await db.collection(`/users/${userId}/calls`).doc(callId).update(call);
    }

    async updateModificationDate(userId: string, callId: string) {
        const db = firestore();
        const ts = Timestamp.now();

        await db.collection(`/users/${userId}/calls`).doc(callId).update({ modificationDate: ts });
    }

    async delete(userId: string, callId: string) {
        const db = firestore();
        await db.collection(`/users/${userId}/calls`).doc(callId).delete();
    }

    async deleteAll(userId: string) {
        const db = firestore();
        const docs = await db.collection(`/users/${userId}/calls`).listDocuments();
        for (const doc of docs) {
            await doc.delete();
        }
    }
}
