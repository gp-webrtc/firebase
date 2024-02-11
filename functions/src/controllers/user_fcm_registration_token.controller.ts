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
    GPWUserFCMRegistrationToken,
    GPWUserFCMRegistrationTokenDeleteBody,
    GPWUserFCMRegistrationTokenInsertOrUpdateBody,
} from '../models';
import { userFCMRegistrationTokenService } from '../services';

export class GPWUserFCMRegistrationTokenController {
    async onInsertOrUpdateFunctionCalled(request: CallableRequest<GPWUserFCMRegistrationTokenInsertOrUpdateBody>) {
        if (!process.env.GPW_FIREBASE_EMULATOR && request.app == undefined) {
            throw new HttpsError('failed-precondition', 'The function must be called from an App Check verified app.');
        }

        const userId = request.auth?.uid;
        const body = request.data;

        if (body) {
            if (userId) {
                if (userId == body.userId) {
                    const existingDoc = await userFCMRegistrationTokenService.get(body.userId, body.tokenId);
                    if (existingDoc) {
                        const updatedDoc: GPWUserFCMRegistrationToken = {
                            userId: existingDoc.userId,
                            tokenId: existingDoc.tokenId,
                            token: body.token,
                            deviceType: body.deviceType,
                            creationDate: existingDoc.creationDate,
                            modificationDate: existingDoc.modificationDate,
                        };
                        await userFCMRegistrationTokenService.save(body.userId, body.tokenId, updatedDoc);
                    } else {
                        await userFCMRegistrationTokenService.create(
                            body.userId,
                            body.tokenId,
                            body.token,
                            body.deviceType
                        );
                    }
                } else {
                    throw new HttpsError(
                        'permission-denied',
                        'You are not authorized to add or update user registration token.r'
                    );
                }
            } else {
                throw new HttpsError('unauthenticated', 'You must be authenticated to use this function');
            }
        } else {
            throw new HttpsError('invalid-argument', 'Wrong body structure');
        }
    }

    async onDeleteFunctionCalled(request: CallableRequest<GPWUserFCMRegistrationTokenDeleteBody>) {
        if (!process.env.GPW_FIREBASE_EMULATOR && request.app == undefined) {
            throw new HttpsError('failed-precondition', 'The function must be called from an App Check verified app.');
        }

        const userId = request.auth?.uid;
        const body = request.data;

        if (request) {
            if (userId) {
                if (userId == body.userId) {
                    const userFCMRegistrationToken = await userFCMRegistrationTokenService.get(
                        body.userId,
                        body.tokenId
                    );
                    if (userFCMRegistrationToken)
                        await userFCMRegistrationTokenService.delete(body.userId, body.tokenId);
                    else throw new HttpsError('not-found', 'The user token does not exist');
                } else throw new HttpsError('permission-denied', 'You are not authorized to delete this user token');
            } else throw new HttpsError('unauthenticated', 'You must be authenticated to use this function');
        } else throw new HttpsError('invalid-argument', 'Wrong body structure');
    }
}
