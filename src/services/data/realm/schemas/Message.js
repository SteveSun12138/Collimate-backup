export default class Message {
  static schema = {
    name: "Message",
    properties: {
      id: "string",
      chatId: "string",
      username: "string",
      userId: "string",
      text: "string",
      syncObject: "SyncObject"
    },
    primaryKey: "id"
  }
}
