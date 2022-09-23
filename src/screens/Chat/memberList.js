import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Alert, SafeAreaView} from 'react-native';
import { leaveMemberOnFirebase } from '../../services/data/firebase/groupChat';
import { retrieveSignInUser } from '../../services/data/localStorage/localStorage.js';
import { updateMember } from '../../services/data/realm/objects/MemberObject';
import { deleteChat } from '../../services/data/realm/objects/ChatObject';
import { getMemberlist } from '../../services/data/firebase/directGet';
import Leave from "../../assets/icons/leave.svg";
import Back from "../../assets/icons/back.svg"
import HomeScreen from '../Home';
import { deleteMessage } from '../../services/data/realm/objects/MessageObject';

export default class MemberList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOnDefaultToggleSwitch: false,
      displayCourse: false,
      errorMessage: '',
      memberList: null,
      buttonState: 'Join',
      badSearch: false,
    };
    this.errorWor = '';
  }
  showAlert = () =>{
    Alert.alert(
      "Leave Group?",
      "Are you sure you want to leave " + this.props.route.params.chatNumber + "?",
      [
        {
          text: "Cancel",
          style: 'cancel',
        },
        {
          text: "Leave",
          onPress: () => { 
            //delete the chat in firebase, member realm, and chat realm
            retrieveSignInUser().then(retrievedUser => {
              leaveMemberOnFirebase(retrievedUser.email, this.props.route.params.chatId);
            });
            updateMember(this.props.route.params.chatId);
            deleteChat(this.props.route.params.chatId);
            deleteMessage(this.props.route.params.chatId)
            this.props.navigation.navigate('HomeScreen', HomeScreen);
        }
        }
      ]
    )
  }

  onPressButton = ({ navigation: { goBack } }) => {
    return () => goBack()
  }

  componentDidMount() {
    getMemberlist(this.props.route.params.chatId).then(response => {
      this.setState({
        memberLists: response
      });
    })
  }


  render = () => {
    return (
      <SafeAreaView style={styles.safe_container}>
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => this.props.navigation.goBack()}
        >
          <Back/>
        </TouchableOpacity>
        <Text style={styles.headerAttributes}>
          {this.props.route.params.courseName}
        </Text>
        <TouchableOpacity onPress={this.showAlert}>
          <View style={styles.leaveFrame}>
            <View style={{marginLeft: '0.5%'}}>
              <Text>
              <Leave/>
              </Text>
            </View>
            <View style={{marginLeft: '3%', marginTop: '-0.75%'}}>
              <Text style={styles.item}>
                Leave Group
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.listContainer}>
          <View style={{marginLeft: '-0.5%'}}>
            <Text style={styles.textAttributes}>Members</Text>
          </View>
          <View style={{marginLeft: '-1%', marginTop: '2.1%', flex: 1}}>
            <FlatList
              style={styles.flatlist}
              data= {(this.state.memberLists)}
              renderItem={({item}) => <Text style={styles.item}>{item.name}</Text>}
            />
          </View>
        </View>
      </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F3F3',
  },
  leaveGroupIcon: {
    marginLeft: '10%',
    marginTop: '2%'
  },
  muteNotificationFrame: {
    flexDirection: 'row',
    marginTop: '5%',
    marginLeft: '10%'
  },
  leaveFrame: {
    flexDirection: 'row',
    marginTop: '5.5%',
    marginLeft: '10%',
  },
  headerFrameAndroid: {
    flexDirection: 'row',
    marginTop: '1%',
  },
  headerFrameIOS: {
    flexDirection: 'row',
    marginTop: '10%',
  },
  headerAttributes: {
    fontFamily: 'Poppins-Medium',
    fontSize: 19,
    textAlign: 'center',
    marginTop: '2.67%' ,
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#000000'
  },
  item: {
    color: '#000000',
    margin: '1.5%',
    fontFamily: 'Poppins-Medium',
    fontSize: 17
  },
  listContainer: {
    flex: 1,
    marginTop: '5.5%',
    marginLeft: '10%',
    marginBottom: '3%',
  },
  textAttributes: {
    margin: '0.9%',
    fontFamily: 'Poppins-Medium',
    color: '#6A6A6A',
    fontSize: 13
  },
  button: {
    position: 'absolute',
    marginLeft:'1.93%',
    marginTop: '1.76%' ,
    marginBottom: '0.81%'
  },
  flatlist: {
    height: '100%',
  },
  safe_container: {
    height: '100%',
    display: 'flex',
    flex: 1
  }
});
