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

export type { GPWUser } from './documents/user.model';
export type { GPWUserCall } from './documents/user_call.model';
export type { GPWUserDevice } from './documents/user_device.model';
export type { GPWUserFCMRegistrationToken } from './documents/user_fcm_registration_token.model';
export type { GPWUserNotification } from './documents/user_notification.model';

export type { GPWUserFCMRegistrationTokenDeleteBody } from './functions/user_fcm_registration_token_delete_body.model';
export type { GPWUserFCMRegistrationTokenInsertOrUpdateBody } from './functions/user_fcm_registration_token_insert_or_update_body.model';

export type { GPWSupportedLanguage } from './shared/supported_language.model';
export type { GPWUserFCMRegistrationTokenDeviceType } from './shared/user_fcm_registration_token_device.model';
export type { GPWUserNotificationMetadata } from './shared/user_notification_metadata.model';
export type { GPWUserNotificationOptions } from './shared/user_notification_options.model';
export type { GPWUserNotificationType } from './shared/user_notification_type.model';
export type { GPWUserSettings } from './shared/user_settings.model';
