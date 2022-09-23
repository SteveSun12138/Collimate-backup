// sync object is an object schema

export default class SyncObject {
  static schema = {
    name: "SyncObject",
    embedded: true,
    properties: {
      createdAt: "date",
      updatedAt: "date"
    },
  };

  static create() {
    return {
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}
