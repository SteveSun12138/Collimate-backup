/*
   * Usage: submit feedback data created by user directly to Firestore
   * Remainder: notice that Feedback data will not store in either realm or localStorage
   * Feedback Structure:
        string description:      store user massage
        string email:            store user input email, could be blank
        timestamp submittedAt:   store submission time
*/

import firestore from '@react-native-firebase/firestore';

export function feedback(description, email) {
  let db = firestore();
  const submittedTime = firestore.Timestamp.fromDate(new Date());
  db.collection('Feedback')
    .add({
      description: description,
      email: email,
      submittedAt: submittedTime,
    })
    // .then(docRef => {
    //   //console.log('Document written with ID: ', docRef.id);
    // })
    .catch(error => {
      console.error('Error adding document: ', error);
    });
}

