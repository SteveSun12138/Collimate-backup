import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PixelRatio,
  Platform,
} from 'react-native';
import { getRealm } from '../../services/data/realm/realm';
import { normalizeFont } from '../../components/normalizeScreen';
import {
  getHeight,
  getPercent,
  getWidth
} from '../Feedback/feedback';

const ListItem = ({ item }) => {
  const [temp, setTemp] = useState(0);
  const realm = getRealm();
  function addCountListener(id) {
    let lastTimeView = realm
      .objects('Member')
      .filtered('chatId == $0', id)[0].lastTimeViewed;

    let userName = realm.objects('User')[0].email;
    realm
      .objects('Message')
      .filtered('chatId == $0 && syncObject.createdAt > $1 && userId != $2', id, lastTimeView, userName)
      .addListener(collection => {
        if (collection.length !== 0) setTemp(collection.length);
        else setTemp(0);
      });
  }
  useEffect(() => {
    if (realm.isInTransaction === false && realm.empty === false) {
      addCountListener(item.chatId);
    }
  });

  if (temp !== 0) {
    return (
      <View style={styles.item}>
        <Text style={styles.cID}>{item.courseName}</Text>
        <Text style={styles.cTerm}>{item.quarter}</Text>
        <Text style={styles.cTitle}>{item.description}</Text>
        <View style={styles.circle}>
          <Text style={styles.bubbleText}>{temp}</Text>
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.item}>
        <Text style={styles.cID}>{item.courseName}</Text>
        <Text style={styles.cTerm}>{item.quarter}</Text>
        <Text style={styles.cTitle} numberOfLines={1}>
          {item.description}
        </Text>
      </View>
    );
  }
};
function getTop(num) {
  if (Platform.OS === 'ios') {
    return getHeight(num);
  } else {
    return 0.5 * getHeight(num);
  }
}

const styles = StyleSheet.create({
  background: {
    margin: '2.6%',
    backgroundColor: '#F3F3F3',
  },

  item: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginLeft: '5%',
    marginRight: '7%',
    marginTop: 16 / PixelRatio.get(),
    height: 78,
    width: '88%',
  },

  cID: {
    position: 'absolute',
    marginRight: '55%',
    marginLeft: '6.61%',
    top: '29.87%',
    fontSize: getWidth(20),
    fontFamily: 'Poppins-Medium',
  },

  circle: {
    marginLeft: '93%',
    marginTop: getPercent(-3),
    width: getWidth(33),
    height: getWidth(33),
    backgroundColor: '#FD993C',
    borderRadius: getWidth(33) / 2,
  },

  bubbleText: {
    fontSize: 17,
    fontFamily: 'Poppins-Medium',
    color: 'white',
    justifyContent: 'center',
    textAlign: 'center',
    paddingLeft: getWidth(0.2),
    paddingTop: getTop(5),
  },

  cTerm: {
    position: 'absolute',
    left: '42%',
    top: '16.88%',
    bottom: '46.75%',
    fontSize: 17,
    fontFamily: 'Poppins-Regular',
  },
  cTitle: {
    position: 'absolute',
    left: '42%',
    right: '4%',
    top: '54.11%',
    bottom: '17.51%',
    fontSize: normalizeFont(16),
    fontFamily: 'Poppins-Light',
  },
});

export default ListItem;
