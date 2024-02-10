import { Timestamp } from 'firebase-admin/firestore';
import { CallableRequest, HttpsError } from 'firebase-functions/v2/https';

import { GPWUserFCMRegistrationToken } from '../models/documents/user_fcm_registration_token.model';
import { GPWUserFCMRegistrationTokenDeleteBody } from '../models/functions/user_fcm_registration_token_delete_body.model';
import { GPWUserFCMRegistrationTokenInsertOrUpdateBody } from '../models/functions/user_fcm_registration_token_insert_or_update_body.model';
import { userFCMNotificationService } from '../services';

export class GPWUserFCMRegistrationTokenController {
    // static async onDocumentCreated(snapshot: DocumentSnapshot, context: EventContext) {
    //     const ts = Timestamp.now();
    //     const userId = context.params.userId as string;
    //     const tokenId = context.params.tokenId as string;

    //     const userToken: GPWUserFCMRegistrationToken = {
    //         userId: snapshot.data()?.userId,
    //         tokenId: snapshot.data()?.tokenId,
    //         token: snapshot.data()?.token,
    //         deviceType: snapshot.data()?.deviceType,
    //         modificationDate: ts,
    //         creationDate: ts,
    //     };

    //     await userFCMNotificationService.save(userId, tokenId, userToken);
    // }

    // static async onDocumentUpdated(snapshot: Change<DocumentSnapshot>, context: EventContext) {
    //     const ts = Timestamp.now();
    //     const userId = context.params.userId as string;
    //     const tokenId = context.params.tokenId as string;

    //     const userTokenBefore = snapshot.before.data() as GPWUserFCMRegistrationToken;
    //     const userTokenAfter = snapshot.after.data() as GPWUserFCMRegistrationToken;
    //     // userTokenBefore.creationDate = userTokenAfter.creationDate; // QUESTION: Do we need this and why?

    //     if (userTokenBefore === userTokenAfter) return;

    //     userTokenAfter.modificationDate = ts;

    //     await userFCMNotificationService.save(userId, tokenId, userTokenAfter);
    // }

    // static async onDocumentDeleted(snapshot: DocumentSnapshot, context: EventContext) {
    //     const userId = context.params.userId as string;
    //     const tokenId = context.params.tokenId as string;

    //     await userFCMNotificationService.delete(userId, tokenId);
    // }

    async onInsertOrUpdateFunctionCalled(request: CallableRequest<GPWUserFCMRegistrationTokenInsertOrUpdateBody>) {
        if (!process.env.GPW_FIREBASE_EMULATOR && request.app == undefined) {
            throw new HttpsError('failed-precondition', 'The function must be called from an App Check verified app.');
        }

        const ts = Timestamp.now();
        const userId = request.auth?.uid;
        const body = request.data;

        if (body) {
            if (userId) {
                if (userId == body.userId) {
                    const existingDoc = await userFCMNotificationService.get(body.userId, body.tokenId);
                    if (existingDoc) {
                        const updatedDoc: GPWUserFCMRegistrationToken = {
                            userId: existingDoc.userId,
                            tokenId: existingDoc.tokenId,
                            token: body.token,
                            deviceType: body.deviceType,
                            creationDate: existingDoc.creationDate,
                            modificationDate: ts,
                        };
                        await userFCMNotificationService.save(body.userId, body.tokenId, updatedDoc);
                    } else {
                        await userFCMNotificationService.create(body.userId, body.tokenId, body.token, body.deviceType);
                    }
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

    async onDeleteFunctionCalled(request: CallableRequest<GPWUserFCMRegistrationTokenDeleteBody>) {
        if (!process.env.GPW_FIREBASE_EMULATOR && request.app == undefined) {
            throw new HttpsError('failed-precondition', 'The function must be called from an App Check verified app.');
        }

        const userId = request.auth?.uid;
        const body = request.data;

        if (request) {
            if (userId) {
                if (userId == body.userId) {
                    const userFCMRegistrationToken = await userFCMNotificationService.get(body.userId, body.tokenId);
                    if (userFCMRegistrationToken) await userFCMNotificationService.delete(body.userId, body.tokenId);
                    else throw new HttpsError('not-found', 'The user token does not exist');
                } else throw new HttpsError('permission-denied', 'You are not authorized to delete this user token');
            } else throw new HttpsError('unauthenticated', 'You must be authenticated to use this function');
        } else throw new HttpsError('invalid-argument', 'Wrong body structure');
    }
}
