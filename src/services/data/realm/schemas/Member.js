export default class Member {
  static schema = {
    name: "Member",
    properties: {
      id: "string",
      chatId: "string",
      userId: "string",
      isActive: "bool",
      lastTimeViewed: "date",
      syncObject: "SyncObject"
    },
    primaryKey: "id"
  }
}
