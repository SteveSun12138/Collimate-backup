import Realm from "realm";
import Chat from "./schemas/Chat";
import Member from "./schemas/Member";
import Message from "./schemas/Message";
import SyncObject from "./schemas/SyncObject";
import User from "./schemas/User";

const REALM_CONFIG = {
  path: "collimate.realm.local",
  // add object schemas if necessary
  schema: [Chat, Member, Message, SyncObject, User],
};

const realm = new Realm(REALM_CONFIG);

export const unmountAllListeners = () => {
  realm.removeAllListeners();
};

/**
 * realm instance, but not recommended to use in your code;
 * use "getReal()" instead
 */
export default realm;

/**
 * call this function when you need a realm connection
 * @returns {Realm}
 */
export function getRealm() {
  return new Realm(REALM_CONFIG);
}

// For messages
// takes in chatid and returns messages for that chat
export function getClass(chatid){
  return realm.objects("Message").filtered('chatId == $0',chatid).sorted("syncObject.createdAt", true);
}

export function getChat(){
  return realm.objects("Chat");
}

export function getActiveMember(){
  return realm.objects("Member").filtered('isActive == true');
}

export function updateLastViewed(chatid){
  const member = realm.objects("Member").filtered('chatId == $0 && isActive == true', chatid);
  member.forEach(chat =>{
      realm.write(() => {
      chat.lastTimeViewed = new Date();
    });
  })
}

