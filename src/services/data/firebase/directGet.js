import firestore from '@react-native-firebase/firestore';


export const getNames = async (em) => {
    var name
    let UserName = await firestore()
    .collection('User')
    .where('email', '==', em)
    .get()
    
    for(const doc of UserName.docs){
      name = doc.data().name;
    }
    return new Promise((resolve, reject)=>{
      if (name !== null) {
        resolve(name)
      } else {
        reject(name)
      }
    })

}



export const getMemberlist = async (id) => {
    var nameList = []
    let Memberlists = await firestore()
    .collection('Member')
    .where('chatId', '==', id)
    .get()
  
    var names = new Array();
    for(const doc of Memberlists.docs){
      var email = doc.data().userId.trim();
      let MemberNames = await firestore()
      .collection('User')
      .where('email', '==', email)
      .get()

      for(const doc of MemberNames.docs){
        nameList.push({
            "name": doc.data().name,
        });
      }
    }

  return new Promise((resolve, reject)=>{
    if (nameList.length !== 0) {
      resolve(nameList)
    } else {
      reject(nameList)
    }
  })

}
//get member count for a class
export const getMemberCount = async (id) => {
  let Memberlists = await firestore()
  .collection('Member')
  .where('chatId', '==', id)
  .get()
  
  
  return new Promise((resolve, reject)=>{
    if (Memberlists.docs.length !== 0) {
      resolve(Memberlists.docs.length)
    } else {
      reject(Memberlists.docs.length)
    }
  })
}

//get current quarter for search
export const getCurrentQuarter = async () => {
  let currentQuarter  = await firestore()
  .collection('Current')
  .doc("current")
  .get()
  
  return new Promise((resolve, reject)=>{
    if (currentQuarter.length !== 0) {
      resolve(currentQuarter.data().quarter)
    } else {
      reject(currentQuarter.data().quarter)
    }
  })
}

