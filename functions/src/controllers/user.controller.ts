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

import * as axios from 'axios';
import { EventContext } from 'firebase-functions/v1';
import { UserRecord } from 'firebase-functions/v1/auth';
// import { AuthBlockingEvent, HttpsError } from 'firebase-functions/v2/identity';
import * as logger from 'firebase-functions/logger';
import { userDeviceService, userService } from '../services';

export class GPWUserController {
    async onAccountCreated(user: UserRecord, context: EventContext) {
        // Generate a randome display name
        const result = await axios.default.get('https://randommer.io/api/Name?nameType=fullname&quantity=1', {
            headers: { 'X-Api-Key': process.env.RANDOMMER_IO_API_KEY },
        });
        const displayName = result.data[0] ?? 'Nameless Joe';

        // Create the user record
        await userService.create(user.uid, displayName);

        // Log event
        logger.info(`User ${user.uid} created at ${context.timestamp.toString()}`);
    }

    async onAccountDeleted(user: UserRecord, context: EventContext) {
        // Delete the user data
        await userDeviceService.deleteAll(user.uid);
        await userService.delete(user.uid);

        // Log event
        logger.info(`User ${user.uid} deleted at ${context.timestamp.toString()}`);
    }

    // async onBeforeAccountCreated(event: AuthBlockingEvent) {
    //     if (event.additionalUserInfo?.providerId !== 'anonymous') {
    //         throw new HttpsError('permission-denied', 'Only anonymous login allowed');
    //     }
    // }

    // async onBeforeSignedIn(event: AuthBlockingEvent) {
    //     if (event.auth) {
    //         // Create/update user document
    //         const user = await userService.get(event.auth.uid);
    //         if (user) {
    //             await userService.updateLastSignIn(event.auth.uid, event);
    //         } else {
    //             await userService.create(event.auth.uid);
    //         }

    //         // Create sign in history record
    //         await userSignInHistoryRecord.create(event.auth.uid, event);
    //     }
    // }
}
