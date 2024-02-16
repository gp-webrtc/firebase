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

import { GPWUserNotification, GPWUserNotificationOptions } from '../models';

export class GPWUserNotificationService {
    static default = new GPWUserNotificationService();

    async create(userId: string, options: GPWUserNotificationOptions) {
        const db = firestore();
        const ts = Timestamp.now();

        const notificationId = db.collection(`/users/${userId}/notifications`).doc().id;

        const notification: GPWUserNotification = {
            userId,
            notificationId,
            type: options.type,
            payload: this.documentData(options),
            wasRead: false,
            wasReceived: false,
            creationDate: ts,
            modificationDate: ts,
        };
        await db.collection(`/users/${userId}/notifications`).doc(notificationId).set(notification);
    }

    async save(userId: string, notificationId: string, notification: GPWUserNotification) {
        const db = firestore();
        const ts = Timestamp.now();

        notification.modificationDate = ts;

        await db.collection(`/users/${userId}/notifications`).doc(notificationId).update(notification);
    }

    async deleteAll(userId: string) {
        const db = firestore();
        const docs = await db.collection(`/users/${userId}/notifications`).listDocuments();
        for (const doc of docs) {
            await doc.delete();
        }
    }

    documentData(
        options: GPWUserNotificationOptions
    ): { path: string } | { callId: string; callerId: string; displayName: string } {
        switch (options.type) {
            case 'onDeviceAdded':
                return {
                    path: `/users/${options.data.userId}/devices/${options.data.deviceId}`,
                };
            case 'onDeviceRemoved':
                return {
                    path: `/users/${options.data.userId}/devices/${options.data.deviceId}`,
                };
            case 'onMessageReceived':
                return {
                    path: '',
                };
            case 'call':
                return {
                    callId: options.data.callId,
                    callerId: options.data.callerId,
                    displayName: options.data.displayName,
                };
        }
    }
}
