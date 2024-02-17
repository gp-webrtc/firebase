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

import { HttpsError } from 'firebase-functions/v1/auth';
import { CallableRequest } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/v2';

import { GPWCoreModelUpdateBody, GPWCoreModelVersion, GPWUser } from '../models';
import { userService } from '../services';
import { coreVersionMatrix } from '../data';

export class GPWCoreController {
    async updateModel(request: CallableRequest<GPWCoreModelUpdateBody>) {
        if (!process.env.GPW_FIREBASE_EMULATOR && request.app == undefined) {
            throw new HttpsError('failed-precondition', 'The function must be called from an App Check verified app.');
        }

        const userId = request.auth?.uid;
        const body = request.data;

        if (body) {
            if (userId) {
                if (userId == body.userId) {
                    await this.updateUserModel(userId, body.toVersion);
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

    private async updateUserModel(userId: string, version: GPWCoreModelVersion) {
        const targetVersion = coreVersionMatrix.model[version];
        const user = await userService.get(userId);
        if (user) {
            let sourceVersion: GPWCoreModelVersion;
            if ('modelVersion' in user) {
                sourceVersion = user.modelVersion;
            } else {
                sourceVersion = '0.0.0(0)';
            }
            if (targetVersion.upgradableFrom <= sourceVersion) {
                logger.info(`Upgrading user ${userId} from ${sourceVersion} to ${targetVersion}`);
                await updateModelTo[version](userId);
            } else {
                await updateModelTo[targetVersion.upgradableFrom](userId);
                await updateModelTo[version](userId);
            }
        }
    }
}

const updateModelTo: { [key in GPWCoreModelVersion]: (userId: string) => Promise<void> } = {
    '0.0.0(0)': dummy,
    '0.1.0(1)': updateModelTo1_0_0_1,
};

async function dummy(userId: string) {
    logger.error(`User ${userId} called for dummy update`);
    throw Error('Dummy upgrade');
}

async function updateModelTo1_0_0_1(userId: string) {
    const user = await userService.get(userId);
    if (user) {
        const updatedUser: GPWUser = {
            modelVersion: '0.1.0(1)',
            userId: user.userId,
            isEncrypted: user.isEncrypted,
            encrypted: user.encrypted,
            settings: user.settings,
            creationDate: user.creationDate,
            modificationDate: user.modificationDate,
        };
        await userService.save(userId, updatedUser);
    }
}
