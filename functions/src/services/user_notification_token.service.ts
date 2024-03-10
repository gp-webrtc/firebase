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

import { GPWUserDeviceType, GPWUserNotificationDeviceToken, GPWUserNotificationToken } from '../models';

export class GPWUserNotificationTokenService {
    async get(userId: string, tokenId: string): Promise<GPWUserNotificationToken | undefined> {
        const db = firestore();
        return (
            await db.collection(`/users/${userId}/notificationTokens`).doc(tokenId).get()
        ).data() as GPWUserNotificationToken;
    }

    async getAll(userId: string): Promise<GPWUserNotificationToken[]> {
        const db = firestore();
        const query = await db.collection(`/users/${userId}/notificationTokens`).get();
        return query.docs.map((doc) => doc.data() as GPWUserNotificationToken);
    }

    async create(
        userId: string,
        tokenId: string,
        deviceToken: GPWUserNotificationDeviceToken,
        deviceType: GPWUserDeviceType
    ) {
        const db = firestore();
        const ts = Timestamp.now();

        const NotificationToken: GPWUserNotificationToken = {
            userId,
            tokenId,
            deviceToken,
            deviceType,
            modificationDate: ts,
            creationDate: ts,
        };

        await db.collection(`/users/${userId}/notificationTokens`).doc(tokenId).set(NotificationToken);
    }

    async save(userId: string, tokenId: string, NotificationToken: GPWUserNotificationToken) {
        const ts = Timestamp.now();
        const db = firestore();

        NotificationToken.modificationDate = ts;

        await db.collection(`/users/${userId}/notificationTokens`).doc(tokenId).update(NotificationToken);
    }

    async updateModificationDate(userId: string, tokenId: string) {
        const db = firestore();
        const ts = Timestamp.now();

        await db.collection(`/users/${userId}/notificationTokens`).doc(tokenId).update({ modificationDate: ts });
    }

    async delete(userId: string, tokenId: string) {
        const db = firestore();
        await db.collection(`/users/${userId}/notificationTokens`).doc(tokenId).delete();
    }

    async deleteAll(userId: string) {
        const db = firestore();
        const docs = await db.collection(`/users/${userId}/notificationTokens`).listDocuments();
        for (const doc of docs) {
            await doc.delete();
        }
    }
}
