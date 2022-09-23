// User is an object schema

export default class User {
  static schema = {
    name: "User",
    properties: {
      name: "string",
      email: "string",
      syncObject: "SyncObject"
    },
    primaryKey: "email"
  }
}
