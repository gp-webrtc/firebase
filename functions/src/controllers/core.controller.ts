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
import { HttpsError } from 'firebase-functions/v1/auth';
import { CallableRequest } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/v2';

import { GPWCoreModelUpdateBody, GPWCoreModelVersion, GPWUser } from '../models';
import { userService } from '../services';
import { coreStatus, coreVersion } from '../data';
import { Timestamp } from 'firebase-admin/firestore';

export class GPWCoreController {
    async initEmulator(request: CallableRequest<void>) {
        if (!process.env.GPW_FIREBASE_EMULATOR && request.app === undefined) {
            throw new HttpsError('failed-precondition', 'The function must be called from an App Check verified app.');
        }
        if (process.env.GPW_FIREBASE_EMULATOR) {
            const ts = Timestamp.now();
            const db = firestore();
            const status = await db.collection('/core').doc('status').get();
            if (!status.exists) {
                await db
                    .collection('/core')
                    .doc('status')
                    .set({
                        ...coreStatus,
                        creationDate: ts,
                        modificationDate: ts,
                    });
            }
            const version = await db.collection('/core').doc('version').get();
            if (!version.exists) {
                await db
                    .collection('/core')
                    .doc('version')
                    .set({
                        ...coreVersion,
                        creationDate: ts,
                        modificationDate: ts,
                    });
            }
        }
    }

    async updateModel(request: CallableRequest<GPWCoreModelUpdateBody>) {
        if (!process.env.GPW_FIREBASE_EMULATOR && request.app === undefined) {
            throw new HttpsError('failed-precondition', 'The function must be called from an App Check verified app.');
        }

        const userId = request.auth?.uid;
        const body = request.data;

        if (body) {
            if (userId) {
                if (userId === body.userId) {
                    await updateUserModel(userId, body.toVersion);
                } else {
                    throw new HttpsError('permission-denied', 'You are not authorized to update the user data.');
                }
            } else {
                throw new HttpsError('unauthenticated', 'You must be authenticated to use this function');
            }
        } else {
            throw new HttpsError('invalid-argument', 'Wrong body structure');
        }
    }
}

const updateUserModelTo: { [key in GPWCoreModelVersion]: (userId: string) => Promise<void> } = {
    '0.0.0(0)': dummy,
    '0.1.0(1)': updateUserModelTo1_0_0_1,
};

async function updateUserModel(userId: string, version: GPWCoreModelVersion) {
    const targetVersion = coreVersion.model[version];
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
            await updateUserModelTo[version](userId);
        } else {
            logger.error('Should not get here', { user, sourceVersion, targetVersion });
            // await updateModel[targetVersion.upgradableFrom](userId);
            // await updateModelTo[version](userId);
        }
    }
}

async function dummy(userId: string) {
    logger.error(`User ${userId} called for dummy update`);
    throw Error('Dummy upgrade');
}

async function updateUserModelTo1_0_0_1(userId: string) {
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

// async function updateUserModelTo1_0_0_2(userId: string) {
//     const user = await userService.get(userId);
//     if (user) {
//         const updatedUser: GPWUser = {
//             modelVersion: '0.1.0(2)',
//             userId: user.userId,
//             isEncrypted: user.isEncrypted,
//             encrypted: user.encrypted,
//             settings: user.settings,
//             creationDate: user.creationDate,
//             modificationDate: user.modificationDate,
//         };
//         await userService.save(userId, updatedUser);
//     }
// }
