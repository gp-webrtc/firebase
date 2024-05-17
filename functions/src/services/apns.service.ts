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

import { Notification, Provider } from '@parse/node-apn';
import { userNotificationTokenService } from '.';
import { logger } from 'firebase-functions/v1';

export class GPWAPNSService {
    async send(
        userId: string,
        tokens: { tokenId: string; token: string; environment: 'development' | 'production' }[],
        notification: Notification
    ) {
        const developmentToken = tokens
            .filter((token) => token.environment === 'development')
            .map((token) => {
                return { tokenId: token.tokenId, token: token.token };
            });
        if (developmentToken.length > 0) this._send(userId, developmentToken, notification, 'development');

        const productionToken = tokens
            .filter((token) => token.environment === 'production')
            .map((token) => {
                return { tokenId: token.tokenId, token: token.token };
            });
        if (productionToken.length > 0) this._send(userId, productionToken, notification, 'production');
    }

    async _send(
        userId: string,
        tokens: { tokenId: string; token: string }[],
        notification: Notification,
        environment: 'development' | 'production'
    ) {
        logger.debug(notification);
        if (
            process.env.GPW_APNS_KEY &&
            process.env.GPW_APNS_KEY_ID &&
            process.env.GPW_APNS_KEY_DEV &&
            process.env.GPW_APNS_KEY_ID_DEV &&
            process.env.GPW_APNS_TEAM_ID
        ) {
            const key = Buffer.from(
                (environment === 'development' ? process.env.GPW_APNS_KEY_DEV : process.env.GPW_APNS_KEY) as string,
                'base64'
            ).toString();
            const apn = new Provider({
                token: {
                    key: Buffer.from(key),
                    keyId: (environment === 'development'
                        ? process.env.GPW_APNS_KEY_ID_DEV
                        : process.env.GPW_APNS_KEY_ID) as string,
                    teamId: process.env.GPW_APNS_TEAM_ID as string,
                },
                production: environment === 'production',
            });

            const response = await apn.send(
                notification,
                tokens.map((token) => token.token)
            );

            logger.debug('Response from APNS', response);

            // Handling response:
            // https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/handling_notification_responses_from_apns

            for (const failed of response.failed) {
                // If the token is not longer valid
                if (failed.status === 410) {
                    const token = tokens.find((token) => token.token === failed.device);
                    if (token) {
                        await userNotificationTokenService.delete(userId, token.tokenId);
                        logger.warn(`Delete notification token /users/${userId}/notificationTokens/${token.tokenId}`);
                    }
                }
            }
        } else {
            if (!process.env.GPW_APNS_KEY) logger.error('APNS key (prod) is missing');
            if (!process.env.GPW_APNS_KEY_ID) logger.error('APNS key ID (prod) is missing');
            if (!process.env.GPW_APNS_KEY_DEV) logger.error('APNS key (dev) is missing');
            if (!process.env.GPW_APNS_KEY_ID_DEV) logger.error('APNS key ID (dev) is missing');
            if (!process.env.GPW_APNS_TEAM_ID) logger.error('APNS team id is missing');
        }
    }

    // private async postNotificationToAPNS(
    //     deviceToken: string,
    //     data: Record<string, string | number | boolean>,
    //     apnsHeaders: Record<string, string>
    // ) {
    //     const token = '';
    //     axios.default.post(`${process.env.GPW_APNS_HOSTNAME}/3/device/${deviceToken}`, data, {
    //         headers: { Authorization: `bearer ${token}`, ...apnsHeaders },
    //     });
    // }
}
