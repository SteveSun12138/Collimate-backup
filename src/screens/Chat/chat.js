import React, { useState, useCallback, useEffect } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { GiftedChat , Bubble, InputToolbar, Send, Composer} from 'react-native-gifted-chat'
import { directStoreMessage } from '../../services/data/firebase/directStore.js'
import {getRealm, getClass, updateLastViewed} from '../../services/data/realm/realm.js'
import {retrieveSignInUser} from '../../services/data/localStorage/localStorage.js';
import {getMemberCount} from '../../services/data/firebase/directGet';
import Sendicon from '../../assets/icons/send.svg';
import Back from '../../assets/icons/back.svg';
import More from '../../assets/icons/more.svg';
import { getBottomSpace } from 'react-native-iphone-x-helper'

function Chat(props) {
  const realm = getRealm();
  const [memberCount, setmemberCount] = useState(0);
  const [messages, setMessages] = useState([]);
  const [userInfo, setuserInfo] = useState({});
  // console.log("realm path:", realm.path);    // Find Realm Path for debug use

  let chatId = props.route.params.chatId.trim();
  getMemberCount(chatId).then(response =>{
    return setmemberCount(response)
  })
  let chatNumber = chatId.substr(0, chatId.indexOf('-')).substr(0, 3) + " " + chatId.substr(0, chatId.indexOf('-')).substr(3, chatId.length);
  let titleChat = chatNumber + " (" + memberCount + ")";
  function renderComposer(props){ 
    return <Composer{...props} textInputStyle={styles.messageInput} placeholder="Send a chat"/>
  }

  function renderInputToolbar(props){ 
    return(
      <InputToolbar 
        renderActions = {()=>null}
        renderComposer={() => renderComposer(props)} 
        renderSend={() => renderSend(props)}
        containerStyle={styles.InputToolbar}
      />
    )
  }

  function renderSend(props){
    return (
      <Send {...props} containerStyle={styles.sendContainer}>
        <Sendicon width={22.7} height={22.38} />
      </Send>
    );
  } 

  function renderBubble(props) { //changing the color of the bubble.
    var messageBelongsToCurrentUser = props.user._id == props.currentMessage.user._id;
    return (
      <View>
          {!messageBelongsToCurrentUser&&<Text style={styles.otherUsername}>{props.currentMessage.user.name}</Text>}
          {messageBelongsToCurrentUser&&<Text style={styles.myUsername}>{props.currentMessage.user.name}</Text>}
          <Bubble
          {...props}
          wrapperStyle={{
            right: {
              borderBottomRightRadius: 18,
              borderTopRightRadius: 18,
              borderBottomLeftRadius: 18,
              borderTopLeftRadius: 18,
              padding:1,
              backgroundColor: '#FFA756',
              marginRight: '4.8%', 
              marginLeft: '23.91%',
            },
            left:{
              borderBottomRightRadius: 18,
              borderTopRightRadius: 18,
              borderBottomLeftRadius: 18,
              borderTopLeftRadius: 18,
              padding:1,
              backgroundColor: '#FFFFFF',
              marginLeft: '4.8%',
              marginRight: '23.91%'
            }
          }}
          textStyle={{
            left: {
              fontFamily:'Poppins-Medium',
              color: '#6A6A6A',
              fontSize: 15,
              lineHeight: 22.5
            },
            right: {
              fontFamily:'Poppins-Medium',
              color: '#FFFFFF',
              fontSize: 15,
              lineHeight: 22.5
            }
          }}/>
      </View>
    );
  }

  function parseMessages(newMessages){
      let gcm = {
        _id: newMessages.id,
        text: newMessages.text,
        createdAt: newMessages.syncObject.createdAt,
        user: {
          name: newMessages.username,
          _id: newMessages.userId,
        }
      };
      setMessages(previousMessages => GiftedChat.append(previousMessages, gcm))
  }

  const moreOnPress = () => {
    props.navigation.navigate('MemberList', {
      chatId: chatId, 
      courseName: titleChat,
      chatNumber: chatNumber
    })
  }

  useEffect(() => {
    // get user
    let id;
    retrieveSignInUser().then(retrievedUser => {
      const userInfo = {
         name: retrievedUser.name,
          _id: retrievedUser.email,
        }
        setuserInfo(userInfo);
        id = retrievedUser.email;
        newMessages.addListener(onMessagesChange);
      }
    );
    //update member lastTimeViewed
    updateLastViewed(chatId);
    // load in previous messages
    const pre_messages = getClass(chatId);
    let giftedChatMessages = pre_messages.map((pre_messages) => {
      let gcm = {
        _id: pre_messages.id,
        text: pre_messages.text,
        createdAt: pre_messages.syncObject.createdAt,
        user: {
          name: pre_messages.username,
          _id: pre_messages.userId,
        }
      };
      return gcm;
    });
    setMessages(giftedChatMessages);

    // add listener to get real-time message
    const newMessages = realm.objects("Message").filtered('chatId == $0', chatId).sorted("syncObject.createdAt", true);
    function onMessagesChange(newChat, changes) {
      changes.insertions.forEach((index) => {
        const insertednewChat = newChat[index];
        if(insertednewChat.userId != id){
          parseMessages(insertednewChat);
        }
      });
    }

    // when unmounting
    return () => {
      newMessages.removeListener(onMessagesChange);
      updateLastViewed(chatId);
    };
  }, [])


  const onSend = useCallback((messages = []) => {
    // store message to firebase
    directStoreMessage(chatId, messages[0].user.name, messages[0].user._id, messages[0].text);
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  }, [])

  return (
    <SafeAreaView style={styles.safe_container}>
     <View style={{flex :1}}>
        <View style = {styles.navbar}>
            <TouchableOpacity  onPress={() => props.navigation.goBack()} style = {styles.back}>
                <Back/>
            </TouchableOpacity>
            <Text style = {styles.title}>{titleChat}</Text>
            <TouchableOpacity onPress={moreOnPress} style = {styles.more}>
                <More style = {styles.more}/>
            </TouchableOpacity>
        </View>
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={userInfo}
          renderBubble={renderBubble}
          renderAvatar={() => null}
          showAvatarForEveryMessage={true}       
          renderInputToolbar={renderInputToolbar}
          bottomOffset = {getBottomSpace()}
        />
      </View> 
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
    container:{
      flex:1
    },
    otherUsername:{
      marginLeft: '7.2%',
      textAlign:'left',
      fontSize: 13,
      color: '#C4C4C4',
      lineHeight: 19.5
    },
    myUsername:{
      marginRight: '7.2%',
      textAlign:'right',
      fontSize: 13,
      color: '#C4C4C4',
      lineHeight: 19.5
    },
    messageTime:{
      textAlign:'right',
      fontSize: 13,
      color: '#C4C4C4',
      lineHeight: 19.5
    },
    messageInput:{
      borderRadius: 25,
      marginLeft: '4.25%',
      marginRight: '9.90%',
      backgroundColor: '#fff',
      paddingLeft:"5%",
      paddingTop: '2.5%',
      paddingRight:'2%',
      paddingBottom:'1.5%',
      maxHeight: "100%"
    },
    navbar:{
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: '1.76%' ,
      marginBottom: '0.81%'
    },
    title: {
      fontFamily:'Poppins-Medium',
      marginLeft: 'auto',
      marginRight: 'auto',
      textAlign: 'center',
      fontWeight: '500', 
      fontSize: 19
    },
    back: {
      marginLeft:'1.93%'
    },
    more: {
      marginRight:'2.7%'
    },
    sendContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginRight: '5%',
    },
    InputToolbar:{
      backgroundColor: '#F3F3F3',
      borderTopWidth: 0
    },
    safe_container: {
      fontFamily: 'Poppins-Medium',
      height: '100%',
      display: 'flex',
      flex: 1
    }
});
export default Chat;