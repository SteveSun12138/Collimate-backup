import { getRealm } from "../realm";
import SyncObject from "../schemas/SyncObject";

const realm = getRealm();

//count number of chat user has joined
export function countMember() {
  let memberList = realm.objects('Member').filtered('isActive == true').length;
  return memberList;
}

//check if user has join chat, used when searching displayed
export function checkIfJoined(chatId) {
  let join = realm
    .objects('Member')
    .filtered('chatId == $0 && isActive == true', chatId).length;
  if (join > 0) {
    return true;
  } else {
    return false;
  }
}

//write member object to realm
export function joinChatRealm(userId, chatId) {
  let join = realm.objects('Member').filtered('chatId == $0', chatId).length;
  //if user has joined before, 
  //realm will have the old member object with isActive: FALSE
  if (join > 0) {
    let member = realm.objects('Member').filtered('chatId == $0', chatId);
    realm.write(() => {
      member[0].isActive = true;
      member[0].lastTimeViewed = new Date();
      member[0].syncObject.updatedAt = new Date();
    });
  } else {
    createMember(userId, chatId);
  }
}

//write new member object to realm
export function createMember(userId, chatId) {
  realm.write(() => {
    realm.create('Member', {
      id: `${userId}-${chatId}`,
      userId,
      chatId,
      isActive: true,
      lastTimeViewed: new Date(),
      syncObject: SyncObject.create(),
    });
  });
}

//used for leaveGroupChat
export function updateMember(chatId) {
  //find member object in realm,
  let obj = realm.objects('Member').filtered('chatId == $0', chatId);
  realm.write(() => {
    //set isActive to false and update lasttimeviewed 
    obj[0].isActive = false;
    obj[0].lastTimeViewed = new Date();
    obj[0].syncObject.updatedAt = new Date();
  });
}

export function downloadMember(data) {
  const { id, userId, chatId, isActive, lastTimeViewed, updatedAt, createdAt } =
    data;
  const existingMember = realm.objectForPrimaryKey('Member', id);
  if (existingMember == undefined) {
    realm.write(() => {
      realm.create('Member', {
        id,
        userId,
        chatId,
        isActive,
        lastTimeViewed: lastTimeViewed.toDate(),
        syncObject: {
          updatedAt: updatedAt.toDate(),
          createdAt: createdAt.toDate()
        },
      });
    });
  }
}
