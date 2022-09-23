import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
  Alert
} from 'react-native';
import Arrow from '../../assets/icons/blackArrow.svg';
import { storeSignInUser, retrieveSignInUser } from '../../services/data/localStorage/localStorage';
import { storeUserName } from '../../services/data/firebase/directStore'
import { updateUserName } from '../../services/data/realm/objects/UserObject';


class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyboardHide: 0,
      tempName: '',
      name: '',
      keyboardState: 'closed',
    };
    this.errorWor = '';
  }

  onPress = () => {
    this.props.navigation.toggleDrawer();
  };

  //get name initial value from local storage
  setDefaultName = () => {
    retrieveSignInUser().then(retrievedUser => {
      this.setState({
        tempName: retrievedUser.name,
        name: retrievedUser.name
      });
    });
  };

  //set default value
  componentDidMount() {
    this.setDefaultName();
  }

  //add keyboard listener
  componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    this.setState({
        keyboardState: 'opened'
    });
  }

  _keyboardDidHide = () => {
    this.setState({
        keyboardState: 'closed'
    });
  }

  //dismiss keyboard and change name when click empty view area
  hideKeyboard = () => {
    //only change name when user click to dismiss keyboard
    if (this.state.keyboardState == 'opened') {
      this.handleKeyDown();
    }
    Keyboard.dismiss();
  }

  //handle onchangetext
  txtHandler = (enteredName) => {
    this.setState({
      name: enteredName
    });
  };

  handleKeyDown = () => {
    var text = this.state.name;
    if(text.length == 0) {
      //handle empty name or invalid name
      this.setState({
        name: this.state.tempName
      });
      Alert.alert(
        "Invalid Username",
        "User name cannot be empty",
        [
          {
            text: "OK",
          },
        ]
      );
    } else if (text[0] == ' '){
      //handle empty name or invalid name
      this.setState({
        name: this.state.tempName
      });
      Alert.alert(
        "Invalid Username",
        "Username cannot start with spaces",
        [
          {
            text: "OK",
          },
        ]
      );
    } else {
      //change name in firestore and local storage
      this.setState({
        tempName: text,
        name: text
      });
      retrieveSignInUser().then(retrievedUser => {
        // update local storage
        storeSignInUser(text, retrievedUser.email);
        // update firebase
        storeUserName(text, retrievedUser.email);
        // update realm
        updateUserName(text, retrievedUser.email);
      });
    }
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.hideKeyboard} disabled={this.state.depend}>
        <SafeAreaView style={styles.container}>
          <View style={styles.heading}>
            <TouchableOpacity 
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              style={styles.vector} 
              onPress={this.onPress}>
              <Arrow />
            </TouchableOpacity>
            <Text style={styles.title}>My Profile</Text>
          </View>
          <View style = {styles.nameSpace}>
          <Text style={styles.name}>Name: </Text>
          <TextInput
            style = {styles.nameFill}
            autoCorrect = {false}
            autoCapitalize = {"none"}
            onChangeText = {this.txtHandler}
            returnKeyType = "done"
            defaultValue = {this.state.tempName}
            onSubmitEditing = {this.handleKeyDown}
            value = {this.state.name}
            >
          </TextInput>
          </View>
          <Text style={styles.end}>
            Please use your real name for identification purpose
          </Text>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    fontFamily: 'Poppins-Medium',
    backgroundColor: '#F3F3F3',
    display: 'flex',
    height: '100%',
  },
  heading: {
    display: 'flex',
    flexDirection: 'row',
  },
  vector: {
    marginLeft: '7.24%',
    top: '3.65%',
    height: 21,
  },
  title: {
    fontFamily: 'Poppins-Medium',
    marginLeft: '26.21%',
    top: '1.77%',
    fontWeight: '500',
    fontSize: 24,
    lineHeight: 36,
  },
  nameSpace: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
    top: "39.54%",
  },
  name: {
    fontFamily: 'Poppins-Regular',
    position: 'absolute',
    fontWeight: '300',
    fontSize: 20,
    lineHeight: 30,
    marginLeft: '20.5%',
    bottom: Platform.OS === 'ios' ? '64.05%' : 14,
    color: '#6A6A6A',
  },
  nameFill: {
    fontFamily: 'Poppins-Regular',
    position: 'absolute',
    marginLeft: '39.6%',
    bottom: '63.78%',
    width: '25%',
    fontWeight: '300',
    fontSize: 24,
    lineHeight: 36
  },
  end: {
    position: 'absolute',
    width: '67.87%',
    height: 50,
    marginLeft: '20.5%',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 24,
    color: '#FD993C',
    marginTop: Platform.OS === 'ios' ? '64.26%' : '50%',
  },
});

export default Profile;
