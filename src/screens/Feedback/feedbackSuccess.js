import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Close from '../../assets/icons/close.svg';
import Heart from '../../assets/icons/heart.svg';

class FeedbackSuccess extends React.Component {
  onPress = () => {
    this.props.navigation.navigate('HomeScreen');
  };
  render() {
    return (
      <SafeAreaView>
        <View style={styles.heading}>
          <Text style={styles.title}>Feedback</Text>
          <TouchableOpacity
            style={styles.vector}
            onPress={this.onPress}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
            <Close />
          </TouchableOpacity>
        </View>
        <View style={styles.heart}>
          <Heart />
        </View>
        <View style={styles.textBox}>
          <Text style={styles.FBText}>Thanks for your Feedback.</Text>
          <Text style={styles.FBText}>Let's make progress together!</Text>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  heading: {
    display: 'flex',
    flexDirection: 'row',
  },
  title: {
    fontFamily: 'Poppins-Medium',
    marginLeft: '34%',
    top: '1.77%',
    fontWeight: '500',
    fontSize: 24,
    lineHeight: 36,
  },
  vector: {
    marginLeft: '20%',
    top: '4%',
    height: '30%',
  },
  heart: {
    marginTop: '43%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  textBox: {
    marginTop: '5%',
  },
  FBText: {
    fontSize: 18,
    lineHeight: 30,
    fontFamily: 'Poppins-Medium',
    alignSelf: 'center',
  },
});

export default FeedbackSuccess;
