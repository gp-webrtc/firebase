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
import { GPWUserDevice } from '../models';
import { Timestamp } from 'firebase-admin/firestore';

export class GPWUserDeviceService {
    async get(userId: string, deviceId: string): Promise<GPWUserDevice | undefined> {
        const db = firestore();
        return (await db.collection(`/users/${userId}/devices`).doc(deviceId).get())?.data() as GPWUserDevice;
    }

    async save(userId: string, deviceId: string, device: GPWUserDevice) {
        const ts = Timestamp.now();
        const db = firestore();

        device.modificationDate = ts;

        await db.collection(`/users/${userId}/devices`).doc(deviceId).update(device);
    }

    async deleteAll(userId: string) {
        const db = firestore();
        const docs = await db.collection(`/users/${userId}/devices`).listDocuments();

        for (const doc of docs) {
            await doc.delete();
        }
    }
}
