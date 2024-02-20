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

import { GPWAuthController } from './auth.controller';
import { GPWCoreController } from './core.controller';
import { GPWUserController } from './user.controller';
import { GPWUserDeviceController } from './user_device.controller';
import { GPWUserNotificationRegistrationTokenController } from './user_notification_registration_token.controller';
import { GPWUserNotificationController } from './user_notification.controller';

export const authController = new GPWAuthController();
export const coreController = new GPWCoreController();
export const userController = new GPWUserController();
export const userDeviceController = new GPWUserDeviceController();
export const userNotificationRegistrationTokenController = new GPWUserNotificationRegistrationTokenController();
export const userNotificationController = new GPWUserNotificationController();

export { httpController } from '../controllers/http.controller';
