import firestore from '@react-native-firebase/firestore';
import { downloadMember } from "../realm/objects/MemberObject";
import { downloadUser } from "../realm/objects/UserObject";
import { downloadChat } from "../realm/objects/ChatObject";
import { downloadMessage } from "../realm/objects/MessageObject";

/**
 * implement a search algorithm
 * @param searchQuery
 * @returns {Promise<void>}
 */
export const searchChat = async (searchQuery, currentQuarter) => {
  var courseList = [];
  let toUpper = searchQuery.toUpperCase().trim();
  
  // need to handle this after delete white space
  if (toUpper.length < 3){
    // need to return empty
    return new Promise((resolve, reject)=>{
        reject(courseList)
    })
  }

  var courseArray = toUpper;
  var courseName = toUpper;
  var courseNumber = toUpper;
  //split the search query into name and number
  if (toUpper.search(" ") > 0) {
    courseArray = toUpper.split(/\s+/);
    if (courseArray.length != 2) {
      return;
    }
    courseName = toUpper.split(/\s+/)[0];
    courseNumber = toUpper.split(/\s+/)[1];
    
  } else {
    courseName = courseArray.substring(0, 3);
    courseNumber = courseArray.substring(3, courseArray.length);
  }
  
  // add 0 if needed, need to judge if alpha suffix
  if ((/[a-zA-Z]/).test(courseNumber[courseNumber.length - 1]) ) {
    if (courseNumber.length == 2) {
      courseNumber = '00' + courseNumber;
    } else if (courseNumber.length == 3) {
      courseNumber = '0' + courseNumber;
    }
  } else {
    if (courseNumber.length == 1) {
      courseNumber = '00' + courseNumber;
    } else if (courseNumber.length == 2) {
      courseNumber = '0' + courseNumber;
    }
  }
  

  // follow search format
  var finalQuery = courseName + courseNumber;
  var chatCollection = "Chat-" + currentQuarter
  let term = currentQuarter.substr(0, currentQuarter.length - 4);
  var courseChats = await firestore()
    .collection(chatCollection)
    .where('chatId', '>=', finalQuery).where('chatId', '<=', finalQuery + '~')
    .get();

  for(const doc of courseChats.docs){
    var string = doc.data().name.trim();
    string = string.split(" ");
    var courseID = new Array();
    courseID.push(string[0]);
    courseID.push(" ");
    courseID.push(string[1]);
    var courseTitle = new Array();
    for(var i = 2; i < string.length; i++){
        courseTitle.push(string[i]);
        if(i != string.length){
          courseTitle.push(" ");
        }
    }
    courseList.push({
      "chatID": doc.data().chatId,
      "courseID": courseID,
      "term": term,
      "title": courseTitle,
      "charID": doc.id,
    });
  }
  
  //todo: refresh the member status after search and join a class
  return new Promise((resolve, reject)=>{
    if (courseList.length !== 0) {
      resolve(courseList)
    } else {
      reject(courseList)
    }
  })
}

export const isUserExists = async (email, callback) => {
  await firestore().collection("User")
    .where('email', '==', email)
    .get()
    .then(querySnapshot => {
      callback(!querySnapshot.empty);
    })
}

/**
 * used when signed in !back!,
 * @param email
 * @returns {Promise<void>}
 */
export const downloadPrevInfo = async (email) => {
  
  const user = await firestore()
    .collection('User')
    .doc(email)
    .get();
  
  downloadUser(user.data());
  
  const members = await firestore()
    .collection('Member')
    .where('userId', '==', email)
    .get();


  const chatIds = [];
  for(const member of members.docs) {
    
    downloadMember(member.data());
    chatIds.push(member.data().chatId)
  }

  // get chats of members only active
  const membersActive = await firestore()
    .collection('Member')
    .where('userId', '==', email).where('isActive', '==', true)
    .get();
    
  const chatIdsActive = [];
  for(const memberActive of membersActive.docs) {
    downloadMember(memberActive.data());
    chatIdsActive.push(memberActive.data().chatId)
  }

  const chats = [];
  for (const chatId of chatIdsActive) {
    let chatCollection = "Chat-" + chatId.substr(chatId.indexOf('-') + 1, chatId.length);
    const chat = await firestore()
      .collection(chatCollection)
      .doc(chatId)
      .get();
    chats.push(chat);
  }
  
  // load all stuff into the db
  chats.forEach(chat => downloadChat(chat.data()));

  // firebase -> realm  download pervious messages
  const messages = [];
  for (const chatId of chatIdsActive) {
    const message = await firestore()
      .collection("Message")
      .where('chatId', '==', chatId)
      .get();
    messages.push(message);
  }

  messages.forEach(message => {
    message.docs.forEach((messageObject) =>{
      downloadMessage(messageObject.data())
    })
  });
}

// download chat previous message called when join a group chat
export const downloadPrevMessage = async (chatId, latestDate) => {
  const message = await firestore()
    .collection("Message")
    .where('chatId', '==', chatId)
    .where("createdAt", "<", latestDate)
    .get();

  message.docs.forEach((messageObject) =>{
    downloadMessage(messageObject.data())
  })
}