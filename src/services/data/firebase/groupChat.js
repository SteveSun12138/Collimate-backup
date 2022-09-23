import firestore from '@react-native-firebase/firestore';
import SyncObject from "../realm/schemas/SyncObject";
import { downloadChat } from "../realm/objects/ChatObject";

//load chat user joined to realm from firebase
export function loadChatToRealm(chatId) {
  let chatCollection = "Chat-" + chatId.substr(chatId.indexOf('-') + 1, chatId.length);
  firestore().collection(chatCollection).doc(chatId).get()
  .then((doc) => {
    downloadChat(doc.data());
  });
}

//join chat on firebase
export function joinChatFireBase(email, courseID) {
  id = email + '-' + courseID;
  var batch = firestore().batch();
  var ref = firestore().collection("Member").doc(id);
  ref.get()
  .then((doc) => {
      //if member has joined before, change inActive and lastTimeViewed
      if (doc.exists) {
          var ref = firestore().collection("Member").doc(id);
          batch.update(ref, {isActive : true});
          batch.update(ref, {lastTimeViewed : new Date()});
          batch.update(ref, {updatedAt : new Date()});
          batch.commit();
      } else {
          // doc.data() will be undefined in this case, create new document
          firestore().collection('Member').doc(id).set({
            chatId: courseID,
            createdAt: SyncObject.create().createdAt,
            id: id,
            isActive: true,
            lastTimeViewed: new Date(),
            updatedAt: SyncObject.create().updatedAt,
            userId: email,
          })
          // .then(() => {    // for debug purpose
          //     console.log("Successfully join chat!");
          // })
          .catch((error) => {
              console.error("Error join chat: ", error);
          });
      }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
}

// update member when leave group chat
export function leaveMemberOnFirebase(email, courseID) {
  id = email + '-' + courseID;
  var batch = firestore().batch();
  var ref = firestore().collection("Member").doc(id);
  batch.update(ref, {isActive : false});
  batch.update(ref, {lastTimeViewed : new Date()});
  batch.update(ref, {updatedAt : new Date()});
  batch.commit();
}