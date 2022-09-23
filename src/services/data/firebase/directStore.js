import firestore from '@react-native-firebase/firestore';
import SyncObject from "../realm/schemas/SyncObject";
import uuid from "react-native-uuid";

let db = firestore();

// add new user to firebase
export function directStoreUser(name, email){
  newSyncObj = SyncObject.create()
  db.collection("User")
    .doc(email)
    .set({
      name: name,
      email: email,
      createdAt: newSyncObj.createdAt,
      updatedAt: newSyncObj.updatedAt
    })
}

// add new message to firebase
export function directStoreMessage(chatId, username, userId, text){
  newSyncObj = SyncObject.create()
  const id = uuid.v4();
  db.collection("Message")
    .doc(id)
    .set({
      id: id,
      chatId: chatId,
      username: username,
      userId: userId,
      text: text,
      updatedAt: newSyncObj.updatedAt,
      createdAt: newSyncObj.createdAt
    })
}

// update lastTimeViewed when signout realm -> firebase 
export function storeLastTimeViewed(id, date) {
  var batch = firestore().batch();
  var ref = firestore().collection("Member").doc(id);
  batch.update(ref, {lastTimeViewed : date});
  batch.commit();
}

// update firebase when change username
export function storeUserName(name, email){
  var batch = firestore().batch();
  var ref = firestore().collection("User").doc(email);
  batch.update(ref, {name : name});
  batch.update(ref, {updatedAt : new Date()});
  batch.commit();
}