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

import { GPWUserNotificationMetadata } from '../models/shared/user_notification_metadata.model';

export const userNotificationMetadata: GPWUserNotificationMetadata = {
    userCallReceived: {
        apns: {
            pushType: 'alert',
            priority: 10,
            topic: 'org.gpfister.republik',
            category: 'org.gpfister.republik.userCallReceived',
            expiration: 0,
        },
    },
    // userDeviceAdded: {
    //     apns: {
    //         pushType: 'alert',
    //         priority: 5,
    //         topic: 'org.gpfister.republik',
    //         category: 'org.gpfister.republik.userDeviceAdded',
    //         expiration: 3600 * 24 * 7, // 7 days
    //     },
    // },
    userEncrypted: {
        apns: {
            topic: 'org.gpfister.republik',
            category: 'org.gpfister.republik.userEncrypted',
        },
    },
    call: {
        apns: {
            pushType: 'voip',
            priority: 10,
            topic: 'org.gpfister.republik.voip',
            expiration: 5, // 5 Seconds
        },
    },
};
