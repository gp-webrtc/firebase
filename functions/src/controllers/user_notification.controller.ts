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

import { Change, FirestoreEvent, QueryDocumentSnapshot } from 'firebase-functions/v2/firestore';

import { userNotificationMetadata } from '../data';
import { GPWUserNotification, GPWUserNotificationOptions } from '../models';
import { apnsService, fcmService, userNotificationTokenService, userNotificationService } from '../services';
import { Notification } from '@parse/node-apn';

export class GPWUserNotificationController {
    async onDocumentUpdated(
        event: FirestoreEvent<Change<QueryDocumentSnapshot> | undefined, { userId: string; notificationId: string }>
    ) {
        if (event.data) {
            const userId = event.params.userId;
            const notificationId = event.params.notificationId;
            const before = event.data.before.data() as GPWUserNotification;
            const after = event.data.before.data() as GPWUserNotification;

            if (before.wasRead !== after.wasRead || before.wasReceived || after.wasReceived) {
                await userNotificationService.updateModificationDate(userId, notificationId);
            }
        }
    }

    async send(userId: string, options: GPWUserNotificationOptions) {
        const { uuid } = await userNotificationService.create(userId, options);

        const metadata = userNotificationMetadata[options.type];

        const data = { json: JSON.stringify(options.data) };

        const tokens = await userNotificationTokenService.getAll(userId);

        if (tokens.length === 0) {
            return;
        }

        const apnsTokens = tokens
            .map((token) => {
                const deviceToken = 'token' in token ? token.token : token.deviceToken;
                if ('apnsToken' in deviceToken)
                    return {
                        tokenId: token.tokenId,
                        token: deviceToken.apnsToken.apns,
                        environment: deviceToken.apnsToken.environment,
                    };
                else return undefined;
            })
            .flatMap((token) => (token ? [{ ...token }] : []));

        const voipTokens = tokens
            .map((token) => {
                const deviceToken = 'token' in token ? token.token : token.deviceToken;
                if ('apnsToken' in deviceToken && deviceToken.apnsToken.voip)
                    return {
                        tokenId: token.tokenId,
                        token: deviceToken.apnsToken.voip,
                        environment: deviceToken.apnsToken.environment,
                    };
                else return undefined;
            })
            .flatMap((token) => (token ? [{ ...token }] : []));

        const fcmTokens = tokens
            .map((token) => {
                const deviceToken = 'token' in token ? token.token : token.deviceToken;
                if ('fcmToken' in deviceToken)
                    return {
                        tokenId: token.tokenId,
                        token: deviceToken.fcmToken,
                    };
                else return undefined;
            })
            .flatMap((token) => (token ? [{ tokenId: token.tokenId, token: token.token }] : []));

        switch (options.type) {
            case 'call':
                if (metadata.apns && metadata.apns.pushType === 'voip' && voipTokens.length > 0) {
                    const notification = new Notification();
                    notification.id = uuid;
                    notification.pushType = metadata.apns.pushType;
                    notification.topic = metadata.apns.topic;
                    notification.expiry = 0;
                    notification.priority = metadata.apns.priority;
                    // notification.mutableContent = true;
                    notification.payload = options.data;
                    await apnsService.send(userId, voipTokens, notification);
                }
                if (metadata.fcm && fcmTokens.length > 0) {
                    await fcmService.send(userId, fcmTokens, {
                        ...metadata.fcm,
                        data,
                    });
                }
                break;
            case 'userCallReceived':
                if (metadata.apns && metadata.apns.pushType === 'alert' && apnsTokens.length > 0) {
                    const notification = new Notification();
                    notification.id = uuid;
                    notification.pushType = metadata.apns.pushType;
                    notification.topic = metadata.apns.topic;
                    notification.expiry = Math.floor(Date.now() / 1000) + metadata.apns.expiration;
                    notification.priority = metadata.apns.priority;
                    notification.collapseId = options.data.callId;
                    notification.mutableContent = true;
                    notification.aps.alert = {
                        title: 'Incoming call',
                        body: 'End to end encrypted call',
                    };
                    notification.aps.category = metadata.apns.category;
                    (notification.payload = options.data), await apnsService.send(userId, apnsTokens, notification);
                }
                if (metadata.fcm && fcmTokens.length > 0) {
                    await fcmService.send(userId, fcmTokens, {
                        ...metadata.fcm,
                        data,
                    });
                }
                break;
            case 'userDeviceAdded':
                if (metadata.apns && metadata.apns.pushType === 'alert' && apnsTokens.length > 0) {
                    const notification = new Notification();
                    notification.id = uuid;
                    notification.pushType = metadata.apns.pushType;
                    notification.topic = metadata.apns.topic;
                    notification.expiry = Math.floor(Date.now() / 1000) + metadata.apns.expiration;
                    notification.priority = metadata.apns.priority;
                    notification.collapseId = options.data.deviceId;
                    notification.mutableContent = true;
                    notification.aps.category = metadata.apns.category;
                    notification.aps.alert = {
                        title: 'New device added',
                        body: 'A new device has been added',
                    };
                    notification.payload = options.data;
                    await apnsService.send(userId, apnsTokens, notification);
                }
                if (metadata.fcm && fcmTokens.length > 0) {
                    await fcmService.send(userId, fcmTokens, {
                        notification: options.notification,
                        ...metadata.fcm,
                        data,
                    });
                }
                break;
        }
    }
}
