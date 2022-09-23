import React, { useState, useReducer } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import {
  joinChatFireBase,
  loadChatToRealm,
} from '../../services/data/firebase/groupChat';
import { retrieveSignInUser } from '../../services/data/localStorage/localStorage.js';
import {
  joinChatRealm,
  countMember,
  checkIfJoined,
} from '../../services/data/realm/objects/MemberObject.js';
import { useNavigation } from '@react-navigation/native';
import { downloadPrevMessage } from '../../services/data/firebase/fetcher';

const ListItem = ({ item }) => {
  const [buttonText, changeText] = useState('Join');
  const [isPress, setIsPress] = useState(false);

  //to disable touchableopacity of join in button after click join
  const [depend, setDisable] = useState(false);

  const navigation = useNavigation();

  //to force rerender after user click join button
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  const handleClick = () => {
    forceUpdate();
  };

  const joinThisChat = () => {
    retrieveSignInUser().then(retrievedUser => {
      setIsPress(true);
      setDisable(true);
      changeText('In');
      //add or update member object on firebase
      joinChatFireBase(retrievedUser.email, item.chatID);
      //load new chat to realm
      loadChatToRealm(item.chatID);
      //deal with member object on realm
      joinChatRealm(retrievedUser.email, item.chatID);
      //download previous messages
      downloadPrevMessage(item.chatID, new Date());
      //force rerender
      handleClick();
    });
  };

  const tooMuchGroupAlert = () => {
    let joinedNum = countMember() + 1;
    if (joinedNum <= 10) {
      joinAlert();
    } else {
      Alert.alert('You can only join at most ten group chats', '', [
        {
          text: 'OK',
        },
      ]);
    }
  };

  const joinAlert = () => {
    Alert.alert('Are you sure you want to join this class?', '', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      { text: 'Yes', onPress: () => joinThisChat() },
    ]);
  };

  //render different search item based on course chat joined or not
  const checkJoined = () => {
    //check if this course chat has been joined before
    let join = checkIfJoined(item.chatID);
    if (join) {
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Chat', { chatId: item.chatID });
          }}>
          <View style={styles.item}>
            <Text style={styles.cID}>{item.courseID}</Text>
            <Text style={styles.cTerm}>{item.term}</Text>
            <Text style={styles.cTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <View style={styles.joinIn}>
              <TouchableOpacity
                style={(styles.btn, { justifyContent: 'center' })}
                disabled={true}
                onPress={() => {
                  tooMuchGroupAlert();
                }}>
                <Text style={[{ color: '#C4C4C4' }, styles.in]}>In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={styles.item}>
          <Text style={styles.cID}>{item.courseID}</Text>
          <Text style={styles.cTerm}>{item.term}</Text>
          <Text style={styles.cTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.joinIn}>
            <TouchableOpacity
              style={(styles.btn, { justifyContent: 'center' })}
              disabled={depend}
              onPress={() => {
                tooMuchGroupAlert();
              }}>
              <Text
                style={[
                  { color: isPress ? '#C4C4C4' : '#FD993C' },
                  styles.join,
                ]}>
                {buttonText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  return <View>{checkJoined()}</View>;
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginLeft: 20,
    height: 66.7,
    width: '90.58%',
  },
  cID: {
    position: 'absolute',
    marginRight: '68.8%',
    marginLeft: '3.467%',
    top: '35%',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cTerm: {
    position: 'absolute',
    left: '32.4%',
    right: '34.7%',
    top: '16.88%',
    bottom: '46.75%',
    fontSize: 17,
    fontFamily: 'Poppins-Regular',
  },
  cTitle: {
    position: 'absolute',
    left: '32.4%',
    right: '23.4%',
    top: '54.11%',
    bottom: '17.51%',
    fontSize: 14,
    fontFamily: 'Poppins-Light',
    color: '#6A6A6A',
  },
  joinIn: {
    left: '81.33%',
    top: '22.48%',
    bottom: '20.24%',
    textAlign: 'center',
    justifyContent: 'center',
    width: '16.13%',
  },
  join: {
    fontFamily: 'Poppins-Medium',
    justifyContent: 'center',
    fontSize: 24,
    lineHeight: 36,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  in: {
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    fontSize: 24,
    lineHeight: 36,
    fontWeight: 'bold',
  },
});

export default ListItem;
