import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, SafeAreaView, Linking } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import type { User } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { createUser} from '../../services/data/realm/objects/UserObject';
import { storeSignInUser, retrieveSignInUser, removeSignInUser} from '../../services/data/localStorage/localStorage.js';
import { getRealm, unmountAllListeners, getActiveMember} from '../../services/data/realm/realm.js';
import { initSubscribers , removeSubscribers} from '../../services/data/firebase/observer.js';
import { downloadPrevInfo} from '../../services/data/firebase/fetcher.js'
import { isUserExists } from '../../services/data/firebase/fetcher.js'
import { directStoreUser, storeLastTimeViewed } from '../../services/data/firebase/directStore.js';
import { normalizeFont, normalizeHeightLogin } from '../../components/normalizeScreen';
import { getNames } from '../../services/data/firebase/directGet'
import GoogleIcon from '../../assets/icons/googleIcon.svg';


type ErrorWithCode = Error & { code?: string };

type State = {
  error: ?ErrorWithCode,
  userInfo: ?User,
};

function firebaseStore(name,email){
  const realm = getRealm();
  //suppose to be firebase => realm for messages
  isUserExists(email, function (condition){
    if (condition) {//if exist, download it
      downloadPrevInfo(email);
      getNames(email).then(response =>{
        storeSignInUser(response,email);
      })
      initSubscribers(email);
    }else{// if not, create it and push to firebase
      createUser(name,email);
      directStoreUser(name,email);
      storeSignInUser(name,email);
      initSubscribers(email);
    }
  })

}

export async function signOut(){
  try{ //deleting realm and local storage
    const realm = getRealm();
    getActiveMember().forEach((each)=>
      storeLastTimeViewed(each.id, each.lastTimeViewed)
    )
    unmountAllListeners();
    removeSubscribers();
    realm.write(() => {
    realm.deleteAll();
    });
    removeSignInUser();
    await GoogleSignin.signOut();//google signout
    }catch(error){
  }
}


let wrongEmail = 0; //for conditional renderring

class GoogleSigninSampleApp extends Component<{}, State> {

  homePage = () => { //go to home screen
    this.props.navigation.navigate('Home');
  }

  state = {//error is from google signin, keeping it here
    userInfo: null,
    error: null,
  };

  async componentDidMount() {//configs
    this._configureGoogleSignIn();
  }

  _configureGoogleSignIn() {
      GoogleSignin.configure({ //config for android devices
      // webClientId: '72676850123-fpunbnmdvurp5gljsorksq4e5ka1tvi7.apps.googleusercontent.com',
      webClientId: '334604307333-7386hiubh012cpptibaqhfji17k6jr2l.apps.googleusercontent.com',
      
    });
  }

  render() {
    //if the user exist in retrievesigninuser, just sign in
    retrieveSignInUser().then(retrievedUser=>{if(retrievedUser){this.homePage();}});

    let { userInfo } = this.state;

    const body = this.renderSignInButton();
    if (userInfo){
      // changed the place of filtering the user email to here
      if(!userInfo.user.email.includes("@ucdavis.edu")){ //filtering the edu emails
        wrongEmail = 1;
        this._signOut();
      }else{
        //firebase auth
        wrongEmail = 0
        const credential = auth.GoogleAuthProvider.credential(
          userInfo.idToken,
        );
        auth().signInWithCredential(credential);

        //realm/firebase stuff
        firebaseStore(userInfo.user.name,userInfo.user.email);
        this.homePage(); //goto next page after signed in
      }
    }
    if (wrongEmail == 0){
      return (//normal view
        <SafeAreaView style={styles.container}>
          <Text style={styles.Header}>Welcome!</Text>
          <Text style={styles.Header2}>Login with school email to chat with your classmates</Text>
          {body}
          <Text style={styles.noerrormsg}>*Collomate is for UC Davis account exclusively</Text>
          <Text style={styles.bottomnote}>By registering or logging in, you agree to the</Text>
          <TouchableOpacity activeOpacity={1} onPress={() => Linking.openURL('http://www.collimate.me')}>
            <Text style={styles.agreement}>Privacy Policy</Text>
          </TouchableOpacity>
        </SafeAreaView>

      );
    }
    else{
      return (//red text
        <SafeAreaView style={styles.container}>
          <Text style={styles.Header}>Welcome!</Text>
          <Text style={styles.Header2}>Login with school email to chat with your classmates</Text>
          {body}
          <Text style={styles.errormsg}>*Collomate is for UC Davis account exclusively</Text>
          <Text style={styles.bottomnote}>By registering or logging in, you agree to the</Text>
          <TouchableOpacity activeOpacity={1} onPress={() => Linking.openURL('http://www.collimate.me')}>
            <Text style={styles.agreement}>Privacy Policy</Text>
          </TouchableOpacity>
        </SafeAreaView>
      );
    }
  }

  renderSignInButton() {
    return (
      <SafeAreaView style = {{flex:1}}>
        <TouchableOpacity
            onPress={this._signIn}
            style={styles.button}>
            <GoogleIcon width = {19} height = {19} style={styles.buttonicon}/>
            <Text style={styles.buttonText}>Continue with Google</Text>
          </TouchableOpacity>
      </SafeAreaView>
    );
  }

  _signIn = async () => {//provided by google
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({ userInfo, error: null });
    } catch (error) {
      console.log(error);
    }
  };

  _signOut = async () => { //sign out
    try {
      signOut();
      this.setState({ userInfo: null, error: null });
    } catch (error) {
      this.setState({
        error,
      });
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#FFFFFF',
  },
  //welcome
  Header:{
    color: '#FD993C',
    fontFamily: 'Poppins-Bold',
    fontSize: normalizeFont(41),
    lineHeight: normalizeHeightLogin(61),
    marginLeft: '7.24%',
    top: '2.3%',
  },
  //login with ...
  Header2:{
    color: '#000000',
    fontFamily: 'Poppins-Bold',
    fontSize: normalizeFont(26),
    lineHeight: normalizeHeightLogin(38),
    marginLeft: '7.24%',
    marginRight: '4.8%',
    top: '3.34%',
  },
  //button
  button:{
    position:'absolute',
    top: normalizeHeightLogin(150),
    width:"80%",
    height: normalizeHeightLogin(47),
    borderColor: '#FD993C',
    borderWidth: 1,
    borderRadius: 30,
    alignSelf:'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  //google icon
  buttonicon:{
    alignSelf:'center',
    marginRight: '5%',
  },
  //continue with ...
  buttonText:{
    color:"#6A6A6A",
    fontFamily: 'Poppins-Medium',
    fontStyle: 'normal',
    fontWeight: "600",
    alignSelf:'center',
    fontSize: normalizeFont(16),
  },
  //collimate is for ...
  noerrormsg:{
    color: '#AFAFAF',
    position: 'absolute',
    fontFamily: 'Poppins-Medium', 
    fontSize: normalizeFont(10),
    lineHeight: normalizeHeightLogin(15),
    alignSelf:'center',
    display: 'flex',
    top: normalizeHeightLogin(380),
  },
  //red version
  errormsg:{
    color: '#FF0000',
    position: 'absolute',
    fontFamily: 'Poppins-Medium',
    fontSize: normalizeFont(10),
    lineHeight: normalizeHeightLogin(15),
    alignSelf:'center',
    display: 'flex',
    top: normalizeHeightLogin(380),
  },
  //by regis...
  bottomnote:{
    color: '#000000',
    opacity: 0.3,
    fontFamily: 'Poppins-Medium', 
    fontSize: normalizeFont(10),
    lineHeight: normalizeHeightLogin(15),
    textAlign:'center',
    marginBottom: '2.2%',
    display: 'flex',
  },
  //privacy policy
  agreement:{
    color: '#549FF7',
    fontFamily: 'Poppins-Medium',
    fontSize: normalizeFont(12),
    lineHeight: 18,
    textAlign:'center',
    marginBottom: "3.5%",
    textDecorationLine:'underline',
    display: 'flex',
  },
});

export default GoogleSigninSampleApp;
