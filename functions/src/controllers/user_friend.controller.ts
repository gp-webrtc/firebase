// //
// // gp-webrtc-firebase
// // Copyright (c) 2024, Greg PFISTER. MIT License.
// //
// // Permission is hereby granted, free of charge, to any person obtaining a copy of
// // this software and associated documentation files (the “Software”), to deal in
// // the Software without restriction, including without limitation the rights to
// // use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// // the Software, and to permit persons to whom the Software is furnished to do so,
// // subject to the following conditions:
// //
// // The above copyright notice and this permission notice shall be included in all
// // copies or substantial portions of the Software.
// //
// // THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// // FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// // COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// // IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// // CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// //

// import { Change, DocumentSnapshot, FirestoreEvent, QueryDocumentSnapshot } from 'firebase-functions/v2/firestore';

// import { userFriendService } from '../services';
// import { GPWUserFriend } from '../models';
// import { userNotificationController } from '.';

// export class GPWUserFriendController {
//     async onDocumentCreated(event: FirestoreEvent<DocumentSnapshot | undefined, { userId: string; friendId: string }>) {
//         if (event.data) {
//             const userId = event.params.userId;

//             const friend = event.data.data() as GPWUserFriend;

//             userNotificationController.send(userId, {
//                 type: 'userFriendAdded',
//                 notification: {
//                     title: 'New friend added',
//                     body: 'A new friend has been added to your account',
//                 },
//                 data: friend,
//             });
//         }
//     }

//     async onDocumentUpdated(
//         event: FirestoreEvent<Change<QueryDocumentSnapshot> | undefined, { userId: string; friendId: string }>
//     ) {
//         if (event.data) {
//             const userId = event.params.userId;
//             const friendId = event.params.friendId;
//             const before = event.data.before.data() as GPWUserFriend;
//             const after = event.data.before.data() as GPWUserFriend;
//             after.modificationDate = before.modificationDate;

//             if (before.encrypted !== after.encrypted || before.isEncrypted !== after.isEncrypted) {
//                 await userFriendService.updateModificationDate(userId, friendId);
//             }
//         }
//     }

//     // async onDocumentDeleted(event: FirestoreEvent<DocumentSnapshot | undefined, { userId: string; friendId: string }>) {
//     //     if (event.data) {
//     //         const userId = event.params.userId;

//     //         const friend = event.data.data() as GPWUserFriend;

//     //         userNotificationController.send(userId, {
//     //             type: 'onFriendRemoved',
//     //             data: friend,
//     //         });
//     //     }
//     // }
// }
