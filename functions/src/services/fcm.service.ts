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

import { messaging } from 'firebase-admin';
import { BaseMessage, MulticastMessage } from 'firebase-admin/messaging';

import { userFCMRegistrationTokenService } from '.';

export class GPWFCMService {
    async send(userId: string, baseMessage: BaseMessage) {
        const fcm = messaging();
        const tokens = await userFCMRegistrationTokenService.getAll(userId);

        // for (const token of tokens) {
        //     const message: Message = {
        //         token: token.token,
        //         ...baseMessage,
        //     };

        //     try {
        //         await fcm.send(message);
        //     } catch (error) {
        //         if (
        //             error instanceof FirebaseMessagingException &&
        //             error.code === 'messaging/registration-token-not-registered'
        //         ) {
        //             await userFCMRegistrationTokenService.delete(userId, token.tokenId);
        //         } else {
        //             throw error;
        //         }
        //     }
        // }

        const message: MulticastMessage = {
            tokens: tokens.map((token) => token.token),
            ...baseMessage,
        };

        const responses = await fcm.sendEachForMulticast(message);

        let i = 0;
        for (const response of responses.responses) {
            if (
                response.error &&
                (response.error.code === 'messaging/registration-token-not-registered' ||
                    response.error.code === 'messaging/invalid-argument')
            ) {
                const tokenId = tokens[i].tokenId;
                await userFCMRegistrationTokenService.delete(userId, tokenId);
            }
            i++;
        }
    }
}
