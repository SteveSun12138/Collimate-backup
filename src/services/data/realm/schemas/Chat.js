export default class Chat {
  static schema = {
    name: "Chat",
    properties: {
      chatId: "string",
      name: "string",
      quarter: "string",
      // instructor: "string",
      syncObject: "SyncObject"
    },
    primaryKey: "chatId"
  }

}
