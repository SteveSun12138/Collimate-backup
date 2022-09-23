import { getRealm } from "../realm";
import SyncObject from "../schemas/SyncObject";

const realm = getRealm();

/**
 * This is used to test and debug; normal devs should never use this function
 * @param name
 * @param quarter
 */
export function createChat(name, quarter) {
  realm.write(() => {
    realm.create("Chat", {
      chatId: `${name}-${quarter}`,
      name,
      quarter,
      syncObject: SyncObject.create()
    });
  })
}

//delete chat object in realm, used for leaveGroupChat
export function deleteChat(chatId) {
  let obj = realm.objects("Chat").filtered('chatId == $0', chatId);
  realm.write(() => {
    realm.delete(obj);
  })
}

/**
 * download chat from firebase;
 * create an object instance in the db if it doesn't exist;
 * otherwise, updates it
 * @param data Firebase document data
 */
export function downloadChat(data) {
  const { chatId, name, quarter, updatedAt, createdAt } = data;
  const existingChat = realm.objectForPrimaryKey("Chat", chatId);
  if (existingChat == undefined) {
    realm.write(() => {
      realm.create("Chat", {
        chatId,
        name,
        quarter,
        syncObject: {
          updatedAt: updatedAt.toDate(),
          createdAt: createdAt.toDate()
        }
      });
    })
  }
}
