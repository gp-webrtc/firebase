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

import { AndroidConfig, FcmOptions, WebpushConfig } from 'firebase-admin/messaging';
import { GPWUserNotificationType } from './user_notification_type.model';

type GPWUserNotificationVoIPMetadata = {
    pushType: 'voip';
    priority: 10;
    topic: string;
};

type GPWUserNotificationAlertMetadata = {
    pushType: 'alert';
    topic: string;
    priority?: 5 | 10;
    category: string;
};

type GPWUserNotificationBackgroundMetadata = {
    pushType: 'background';
    topic: string;
    priority: 1 | 5 | 10;
    category: string;
};

export type GPWUserNotificationMetadata = {
    [key in GPWUserNotificationType]: {
        fcm?: {
            android?: AndroidConfig;
            webpush?: WebpushConfig;
            fcmOptions?: FcmOptions;
        };
        apns?: { expiration?: number } & (
            | GPWUserNotificationVoIPMetadata
            | GPWUserNotificationAlertMetadata
            | GPWUserNotificationBackgroundMetadata
        );
    };
};
