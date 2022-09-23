import { getRealm } from "../realm";
import SyncObject from "../schemas/SyncObject";

const realm = getRealm();
export function createUser(name, email) {
  realm.write(() => {
    realm.create("User", {
      name,
      email,
      syncObject: SyncObject.create()
    });
  })
}

export function downloadUser(data) {
  const { email, name, updatedAt, createdAt } = data;
  const existingUser = realm.objectForPrimaryKey("User", email);
  if (existingUser == undefined) {
    realm.write(() => {
      realm.create("User", {
        email,
        name,
        syncObject: {
          updatedAt: updatedAt.toDate(),
          createdAt: createdAt.toDate()
        }
      });
    })
  } 
}

// update username in realm
export function updateUserName(name, email) {
  //find member object in realm,
  let obj = realm.objects("User").filtered('email == $0', email);
  realm.write(() => {
    obj[0].name = name;
    obj[0].syncObject.updatedAt = new Date();
  });
}