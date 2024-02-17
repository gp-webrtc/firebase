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

import * as uuid from 'uuid';
import * as express from 'express';

import { Timestamp } from 'firebase-admin/firestore';

import { GPWUserDevice } from '../models';
import { userService, userCallService, userNotificationService } from '../services';
import { userNotificationController } from '.';

export const httpController = express.default();

// build multiple CRUD interfaces:
httpController.post('/users/:userId/call', async (req, res) => {
    const userId = req.params.userId;
    // const userNotification = new GPWUserNotificationService();
    // const userCall = new GPWUserCallService();

    const user = await userService.get(userId);

    if (user) {
        // Create a call session
        const callId = await userCallService.create(userId, '21635e00-06ca-4478-9039-05e871b4324b', 'Test device');

        // Create a notification
        await userNotificationService.create(userId, {
            type: 'call',
            data: { callId, callerId: '21635e00-06ca-4478-9039-05e871b4324b', displayName: 'Test device' },
        });

        res.json({ callId: callId }).sendStatus(200);
    }

    res.sendStatus(404);
});

// build multiple CRUD interfaces:
httpController.post('/users/:userId/onDeviceAdded', async (req, res) => {
    const ts = Timestamp.now();
    const userId = req.params.userId;
    const deviceId = uuid.v4();

    const user = await userService.get(userId);

    if (user) {
        const device: GPWUserDevice = {
            userId,
            deviceId,
            encrypted: '',
            isEncrypted: false,
            creationDate: ts,
            modificationDate: ts,
        };

        await userNotificationController.send(userId, {
            type: 'userDeviceAdded',
            data: device,
            notification: {
                title: 'New device added',
                body: 'You have added devive iPhone tralala.',
            },
        });

        res.json({ deviceId }).sendStatus(200);
    }

    res.sendStatus(404);
});
