import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItem,
  useIsDrawerOpen,
} from '@react-navigation/drawer';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { retrieveSignInUser } from '../../services/data/localStorage/localStorage';
import { signOut } from '../Login/login';

export function DrawerContent(props) {
  const [userName, setUserName] = useState('Adam Smith');
  const wasDrawerOpen = useIsDrawerOpen();
  if (wasDrawerOpen) {
    const currentScreen = props.navigation.getState().index;
    if (currentScreen !== 0) {
      // magic number 0 stands for HomeScreen
      props.navigation.navigate('HomeScreen');
      props.navigation.toggleDrawer();
      // feedback();
    }
  }

  function getNameFromLocalStorage() {
    retrieveSignInUser().then(retrivedUser => {
      if (retrivedUser.name !== 'Adam Smith') setUserName(retrivedUser.name);
    });
  }

  useEffect(() => {
    // Pass in a callback function!
    getNameFromLocalStorage();
  });
  return (
    <SafeAreaView style={styles.drawerContainer}>
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('Profile');
        }}>
        <Text style={styles.name}>{userName}</Text>
      </TouchableOpacity>
      <View>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('Profile');
          }}>
          <Text style={styles.nextScreen}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('Feedback');
          }}>
          <Text style={styles.nextScreen}>Feedback</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('About');
          }}>
          <Text style={styles.nextScreen}>About</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            Alert.alert('Log out?', 'Are you sure you want to log out?', [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Log out',
                onPress: () => {
                  signOut();
                  props.navigation.navigate('Login');
                },
              },
            ]);
          }}>
          <Text style={styles.nextScreenLogOut}>Log out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  name: {
    fontFamily: 'Poppins-Medium',
    fontSize: 26,
    lineHeight: 39,
    marginLeft: '10.6%',
    marginTop: '7%',
  },
  nextScreen: {
    fontFamily: 'Poppins-Medium',
    fontSize: 19,
    lineHeight: 28.5,
    marginLeft: '10.6%',
    marginTop: '11%',
    marginBottom: '-2%',
  },
  nextScreenLogOut: {
    fontFamily: 'Poppins-Medium',
    fontSize: 19,
    lineHeight: 28.5,
    marginLeft: '10.6%',
    marginTop: '11%',
  },
});
