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

import { GPWUserFCMRegistrationTokenDeviceType } from '../models/shared/user_fcm_registration_token_device.model';
import { GPWUserFCMRegistrationToken } from '../models/documents/user_fcm_registration_token.model';

export class GPWUserFCMRegistrationTokenService {
    async get(userId: string, tokenId: string): Promise<GPWUserFCMRegistrationToken | undefined> {
        const db = firestore();
        return (
            await db.collection(`/users/${userId}/fcmRegistrationTokens`).doc(tokenId).get()
        ).data() as GPWUserFCMRegistrationToken;
    }

    async save(userId: string, tokenId: string, data: GPWUserFCMRegistrationToken) {
        const db = firestore();
        await db.collection(`/users/${userId}/fcmRegistrationTokens`).doc(tokenId).update(data);
    }

    async create(userId: string, tokenId: string, token: string, deviceType: GPWUserFCMRegistrationTokenDeviceType) {
        const db = firestore();
        const ts = Timestamp.now();

        const userToken: GPWUserFCMRegistrationToken = {
            userId: userId,
            tokenId: tokenId,
            token,
            deviceType,
            modificationDate: ts,
            creationDate: ts,
        };

        await db.collection(`/users/${userId}/fcmRegistrationTokens`).doc(tokenId).set(userToken);
    }

    async delete(userId: string, tokenId: string) {
        const db = firestore();
        await db.collection(`/users/${userId}/fcmRegistrationTokens`).doc(tokenId).delete();
    }

    async deleteAll(userId: string) {
        const db = firestore();
        const docs = await db.collection(`/users/${userId}/fcmRegistrationTokens`).listDocuments();
        for (const doc of docs) {
            await doc.delete();
        }
    }
}
