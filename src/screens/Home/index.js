import React, { useEffect, useState } from 'react';
import ListItem from './searchTableHome.js';
import Search from '../../assets/icons/search.svg';
import MenuButton from '../../assets/icons/Vector.svg';
import SearchScreen from '../Search/search';
import { getRealm } from '../../services/data/realm/realm';
import { retrieveSignInUser } from '../../services/data/localStorage/localStorage';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, Platform } from 'react-native';
import { initSubscribers } from '../../services/data/firebase/observer.js';

function Home(props) {
  const [CourseList, setCourseList] = useState([]);
  const [displayCourse, setDisplayCourse] = useState(false);

  const realm = getRealm();
  useEffect(() => {
    retrieveSignInUser().then(retrievedUser => {
      initSubscribers(retrievedUser.email);
    });
    const classes = realm.objects('Chat');
    const massage = realm.objects('Message');
    const member = realm.objects('Member');
    // set state to the initial value of your realm objects
    classes.addListener(collection => {
      // update state of classes to the updated value
      getContent(classes);
    });

    if (realm.isInTransaction === false) {
      member.addListener(collection => {
        getContent(classes);
      });
      massage.addListener(collection => {
        getContent(classes);
      });
      // check if timeViewedChanges
    }

    // cleanup function
    return () => {
      const classes = realm.objects('Chat');
      classes.removeAllListeners();
      const massages = realm.objects('Message');
      massages.removeAllListeners();
      const member = realm.objects('Member');
      member.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    if (CourseList.length === 0) {
      setDisplayCourse(false);
    } else {
      setDisplayCourse(true);
    }
  });

  const onPress = () => {
    props.navigation.navigate('Search', SearchScreen);
  };

  function getContent(chat) {
    let parsechat = chat.map(e => {
      // use chatId to get latest count
      let courseName;
      let description;
      let courseFull = e.name.trim();
      let chatId = e.chatId.trim();
      // set up courseName and title
      courseName = courseFull.substr(
        0,
        courseFull.indexOf(' ', courseFull.indexOf(' ') + 1),
      ); // get course name
      description = courseFull.substr(
        courseFull.indexOf(' ', courseFull.indexOf(' ') + 1) + 1,
      ); // get description
      let quarter = e.quarter;

      let classChat = {
        courseName: courseName,
        quarter: quarter,
        description: description,
        chatId: chatId,
      };
      return classChat;
    });
    setCourseList(parsechat);
  }

  function renderSeparator() {
    return (
      <View
        style={{
          // scrolling view, all the component should not defined with %
          height: 16,
          width: '100%',
          backgroundColor: '#F3F3F3',
        }}
      />
    );
  }

  if (displayCourse) {
    return (
      <SafeAreaView style={styles.background}>
        <View style={styles.header}>
          <View>
            <TouchableOpacity
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              onPress={() => {
                props.navigation.openDrawer();
              }}>
              <MenuButton />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerText}>Chats</Text>
          <TouchableOpacity
            // use hitSlop to increase touchable area
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            onPress={onPress}>
            <Search />
          </TouchableOpacity>
        </View>
        <View>
          <FlatList
            style={styles.flatlist}
            data={CourseList}
            keyExtractor={item => item.courseID}
            contentContainerStyle={{ paddingTop: 30, paddingBottom: 70 }}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate('Chat', { chatId: item.chatId });
                  }}>
                  <ListItem item={item} />
                </TouchableOpacity>
              );
            }}
            ItemSeparatorComponent={renderSeparator}
          />
        </View>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.background}>
        <View style={styles.header}>
          <View>
            <TouchableOpacity
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              onPress={() => {
                props.navigation.openDrawer();
              }}>
              <MenuButton />
            </TouchableOpacity>
          </View>

          <Text style={styles.headerText}>Chats</Text>
          <TouchableOpacity
            // use hitSlop to increase touchable area
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            onPress={onPress}>
            <Search />
          </TouchableOpacity>
        </View>
        <View style={styles.sloganContainer}>
          <Text style={styles.slogan}>Start by searching a class!</Text>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    height: '100%',
    backgroundColor: '#F3F3F3',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  headerText: {
    fontFamily: 'Poppins-Medium',
    fontStyle: 'normal',
    fontSize: 24,
    lineHeight: 36,
    color: 'black',
  },
  sloganContainer: {
    flex: 0.2,
    top: Platform.OS === 'ios' ? '65%' : '45%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  slogan: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    lineHeight: 33,
    color: '#FD993C',
  },
  searchTb: {
    marginTop: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  flatlist: {
    height: '100%',
  }
});

export default Home;
