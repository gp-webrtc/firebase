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

import { CallableRequest, HttpsError } from 'firebase-functions/v2/https';

import {
    GPWUserNotificationToken,
    GPWUserNotificationTokenDeleteBody,
    GPWUserNotificationTokenInsertOrUpdateBody,
} from '../models';
import { userNotificationTokenService } from '../services';

export class GPWUserNotificationTokenController {
    async onInsertOrUpdateFunctionCalled(request: CallableRequest<GPWUserNotificationTokenInsertOrUpdateBody>) {
        if (!process.env.GPW_FIREBASE_EMULATOR && request.app === undefined) {
            throw new HttpsError('failed-precondition', 'The function must be called from an App Check verified app.');
        }

        const userId = request.auth?.uid;
        const body = request.data;

        if (body) {
            if (userId) {
                if (userId === body.userId) {
                    const existingDoc = await userNotificationTokenService.get(body.userId, body.tokenId);
                    if (existingDoc) {
                        const deviceToken = 'token' in body ? body.token : body.deviceToken;
                        const updatedDoc: GPWUserNotificationToken = {
                            userId: existingDoc.userId,
                            tokenId: existingDoc.tokenId,
                            token: deviceToken,
                            deviceType: body.deviceType,
                            creationDate: existingDoc.creationDate,
                            modificationDate: existingDoc.modificationDate,
                        };
                        await userNotificationTokenService.save(body.userId, body.tokenId, updatedDoc);
                    } else {
                        const deviceToken = 'token' in body ? body.token : body.deviceToken;
                        await userNotificationTokenService.create(
                            body.userId,
                            body.tokenId,
                            deviceToken,
                            body.deviceType
                        );
                    }
                } else {
                    throw new HttpsError(
                        'permission-denied',
                        'You are not authorized to add or update user notification token.'
                    );
                }
            } else {
                throw new HttpsError('unauthenticated', 'You must be authenticated to use this function');
            }
        } else {
            throw new HttpsError('invalid-argument', 'Wrong body structure');
        }
    }

    async onDeleteFunctionCalled(request: CallableRequest<GPWUserNotificationTokenDeleteBody>) {
        if (!process.env.GPW_FIREBASE_EMULATOR && request.app === undefined) {
            throw new HttpsError('failed-precondition', 'The function must be called from an App Check verified app.');
        }

        const userId = request.auth?.uid;
        const body = request.data;

        if (request) {
            if (userId) {
                if (userId === body.userId) {
                    const userNotificationToken = await userNotificationTokenService.get(body.userId, body.tokenId);
                    if (userNotificationToken) await userNotificationTokenService.delete(body.userId, body.tokenId);
                    else throw new HttpsError('not-found', 'The user token does not exist');
                } else throw new HttpsError('permission-denied', 'You are not authorized to delete this user token');
            } else throw new HttpsError('unauthenticated', 'You must be authenticated to use this function');
        } else throw new HttpsError('invalid-argument', 'Wrong body structure');
    }
}
