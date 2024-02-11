import { messaging } from 'firebase-admin';
import { ApnsConfig } from 'firebase-admin/messaging';
import { userFCMRegistrationTokenService } from '.';

export class GPWFCMService {
    async send(userId: string, apns?: ApnsConfig, data?: { [key: string]: string }) {
        const tokens = (await userFCMRegistrationTokenService.getAll(userId)).map((token) => token.token);

        for (const token of tokens) {
            await messaging().send({
                token,
                apns,
                data,
            });
        }
    }
}
