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
    onMessageReceived: {
        apns: {
            headers: {
                'apns-priority': '5',
            },
            payload: {
                aps: {
                    category: 'MESSAGE_RECEIVED',
                    contentAvailable: true,
                    mutableContent: true,
                },
            },
        },
    },
    onDeviceAdded: {
        apns: {
            headers: {
                'apns-priority': '5',
            },
            payload: {
                aps: {
                    category: 'DEVICE_ADDED',
                    contentAvailable: true,
                    mutableContent: true,
                },
            },
        },
    },
    onDeviceRemoved: {
        apns: {
            headers: {
                'apns-priority': '5',
            },
            payload: {
                aps: {
                    category: 'DEVICE_REMOVED',
                    contentAvailable: true,
                    mutableContent: true,
                },
            },
        },
    },
    call: {
        apns: {
            headers: {
                'apns-push-type': 'voip',
                'apns-topic': 'org.gpfister.webrtc.voip',
            },
        },
    },
};
