// This method is persistent, unencrypted storage
// ONLY TEMPORARY solution
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * store current user to local storage
 * @param name
 * @param email
 * @returns {Promise<*>}
 */
export async function storeSignInUser(name, email) {
  try {
    return await AsyncStorage.setItem("localUser", JSON.stringify({
      name, email
    }));
  } catch (error) {
    console.log(error);
  }
}

/**
 * retrieve user information in case you need
 * @returns {Promise<*>}
 */
export async function retrieveSignInUser() {
  try {
    const value = await AsyncStorage.getItem("localUser");
    if (value === null) {
      return undefined;
    } else {
      return JSON.parse(value);
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * remove user information when user logs out
 * @returns {Promise<void>}
 */
export async function removeSignInUser() {
  try {
    await AsyncStorage.removeItem("localUser")
  } catch(error) {
    console.log(error);
  }
}
