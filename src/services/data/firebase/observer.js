import firestore from '@react-native-firebase/firestore';
import { getRealm } from "../realm/realm";
import { downloadMessage } from "../realm/objects/MessageObject";

const SUBSCRIBERS = {};
const realm = getRealm();

const baseObserver = (query, onResult, onError) => {
  return query.onSnapshot(onResult, onError);
}

const onMessageResult = (querySnapshot) => {
  querySnapshot.docChanges().forEach((change) => {
    if (change.type === "added") {
        data = change.doc.data();
        downloadMessage(data);
    }
  });
}

const onMessageError = (error) => {
  console.log(error);
}

/**
 * init all subscribers: firebase -> realm
 * @param email the currently login user's email (A.K.A userId)
 */
export const initSubscribers = (email) => {
  // retrieve the most up to date timestamp
  let latestDate = new Date();
  const memberByCreatedAt = realm.objects("Member").sorted("lastTimeViewed", true);
  if (memberByCreatedAt.length !== 0) {
    latestDate = memberByCreatedAt[0].lastTimeViewed;
  }
  //subscribe
  const realmQuery1 = `isActive == true and userId == '${email}'`;
  realm.objects("Member").filtered(realmQuery1)
    .forEach((member) => {
      const query = firestore()
        .collection("Message")
        .where("chatId", "==", member.chatId)
        .where("createdAt", ">=", latestDate);
      if(member.chatId in SUBSCRIBERS){
        // unsubscribe
        SUBSCRIBERS[member.chatId]();
        delete SUBSCRIBERS[member.chatId];
      }
      SUBSCRIBERS[member.chatId] = baseObserver(query, onMessageResult, onMessageError);
    });

  // subscribe on demand
  const realmQuery2 = `userId == '${email}'`;
  realm.objects("Member").filtered(realmQuery2)
    .addListener((collection, changes) => {
      // Handle newly added objects
      // subscribe
      changes.insertions.forEach((index) => {
        const insertedObject = collection[index];
        if (insertedObject.isActive) {
          const query = firestore()
            .collection("Message")
            .where("chatId", "==", insertedObject.chatId)
            .where("createdAt", ">=", latestDate);
          if(insertedObject.chatId in SUBSCRIBERS){
            SUBSCRIBERS[insertedObject.chatId]();
            delete SUBSCRIBERS[insertedObject.chatId];
          }
          SUBSCRIBERS[insertedObject.chatId] = baseObserver(query, onMessageResult, onMessageError);
        }
      });

      // Handle objects that were modified
      changes.modifications.forEach((index) => {
        const modifiedObject = collection[index];
        if (modifiedObject.isActive && !SUBSCRIBERS.hasOwnProperty(modifiedObject.chatId)) {
          // subscribe
          const query = firestore()
            .collection("Message")
            .where("chatId", "==", modifiedObject.chatId)
            .where("createdAt", ">=", latestDate);
          if(modifiedObject.chatId in SUBSCRIBERS){
            SUBSCRIBERS[modifiedObject.chatId]();
            delete SUBSCRIBERS[modifiedObject.chatId];
          }
          SUBSCRIBERS[modifiedObject.chatId] = baseObserver(query, onMessageResult, onMessageError);
        } else if (!modifiedObject.isActive && SUBSCRIBERS.hasOwnProperty(modifiedObject.chatId)) {
          SUBSCRIBERS[modifiedObject.chatId]();
          delete SUBSCRIBERS[modifiedObject.chatId];
        }
      });
    });
}

/**
 * unsubscribe all listeners: firebase -> realm
 */
export const removeSubscribers = () => {
  Object.keys(SUBSCRIBERS).forEach((subscriber => {
    // unsubscribe
    SUBSCRIBERS[subscriber]();
    // remove ref
    delete SUBSCRIBERS[subscriber];
  }));
}
