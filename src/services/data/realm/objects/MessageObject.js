import { getRealm } from "../realm";
import uuid from "react-native-uuid";

const realm = getRealm();

export function createMessage(chatId, username, userId, text) {
  realm.write(() => {
    realm.create("Message", {
      id: uuid.v4(),
      chatId,
      username,
      userId,
      text,
      syncObject: {
        updatedAt: new Date(),
        createdAt: new Date()
      }
    });
  })
}

export function downloadMessage(data) {
  const { id, chatId, username, userId, text, updatedAt, createdAt } = data;
  const existingMessage = realm.objectForPrimaryKey("Message", id);
  if (existingMessage == undefined) {
    // create instance
    realm.write(() => {
      realm.create("Message", {
        id,
        chatId,
        username,
        userId,
        text,
        syncObject: {
          updatedAt: updatedAt.toDate(),
          createdAt: createdAt.toDate()
        }
      });
    });
  }
}

//delete messages in realm when leaveGroupChat
export function deleteMessage(chatId) {
  let obj = realm.objects("Message").filtered('chatId == $0', chatId);
  realm.write(() => {
    realm.delete(obj);
  })
}
