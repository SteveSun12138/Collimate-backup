import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Platform,
  Keyboard,
  Dimensions,
} from 'react-native';
import { feedback } from '../../services/data/firebase/submitFeedback';
import Arrow from '../../assets/icons/blackArrow.svg';
import FeedbackSuccess from './feedbackSuccess';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { normalizeHeight } from '../../components/normalizeScreen';
import { normalizeFont } from '../../components/normalizeScreen';
import DeviceInfo from 'react-native-device-info';

class Feedback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      feedbackText: null,
      email: '',
      hasSubmitted: false,
    };
  }

  ifNotValid() {
    if (this.state.feedbackText === null && this.state.hasSubmitted === false){
      return false;
    }
    else if ( this.state.feedbackText === null && this.state.hasSubmitted === true){
      return true;
    }
    return !this.state.feedbackText.trim() && this.state.hasSubmitted === true;
  }

  errMessage() {
    if (this.ifNotValid()) {
      return (
        <Text style={styles.errText}>*Please fill in the description</Text>
      );
    }

    if (
      this.state.feedbackText === null ||
      (this.state.feedbackText.trim() && this.state.hasSubmitted === true)
    ) {
      this.state.hasSubmitted = false;
    }
  }

  onPress = () => {
    this.props.navigation.toggleDrawer();
  };

  dynamicStyle() {
    if (this.ifNotValid()) {
      return {
        width: getWidth(354),
        height: getHeight(191),
        fontSize: normalizeFont(16),
        borderWidth: 1,
        paddingLeft: 14,
        paddingTop: 14,
        textAlignVertical: 'top',
        backgroundColor: 'white',
        borderRadius: normalizeHeight(15),
        borderColor: '#ff0000',
        textAlign: 'left',
        fontFamily: 'Poppins-Regular',
      };
    } else
      return {
        width: getWidth(354),
        height: getHeight(191),
        fontSize: normalizeFont(16),
        paddingLeft: 14,
        paddingTop: 14,
        borderWidth: 0,
        backgroundColor: 'white',
        textAlignVertical: 'top',
        borderRadius: normalizeHeight(15),
        textAlign: 'left',
        fontFamily: 'Poppins-Regular',
      };
  }

  render() {
    return (
      <SafeAreaView>
        <View style={styles.heading}>
          <TouchableOpacity
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            style={styles.vector}
            onPress={this.onPress}>
            <Arrow />
          </TouchableOpacity>
          <Text style={styles.title}>Feedback</Text>
        </View>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container} onPress={Keyboard.dismiss}>
            <Text style={styles.feedbackDescribe}>
              Description*{' '}
              <Text style={styles.feedbackWarn}>(350 words maximum)</Text>
            </Text>
            <View style={styles.feedbackContainer}>
              <TextInput
                style={this.dynamicStyle()}
                multiline={true}
                onChangeText={feedbackText =>
                  this.setState({
                    feedbackText,
                  })
                }
                value={this.state.feedbackText}
                maxLength={2850} //in character
                placeholderStyle={styles.textBox}
              />
              {this.errMessage()}
            </View>
          </View>

          <View styles={styles.container} onPress={Keyboard.dismiss}>
            <Text style={styles.feedbackDescribe}>
              Email <Text style={styles.feedbackWarn}>(optional)</Text>
            </Text>
            <View style={styles.feedbackContainer}>
              <TextInput
                style={styles.inputEmail}
                autoCompleteType="email"
                autoCapitalize="none"
                textContentType="emailAddress"
                keyboardType="email-address"
                onChangeText={email => this.setState({ email })}
                value={this.state.email}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.submitButton}>
          <TouchableOpacity
            onPress={() => {
              this.setState({ hasSubmitted: true });
              if (this.state.feedbackText === null) {
                //console.log('feedbackText not changed');
              } else {
                if (this.state.feedbackText.trim()) {
                  feedback(this.state.feedbackText, this.state.email); // submit feedback to firebase
                  this.props.navigation.navigate(
                    'FeedbackSuccess',
                    FeedbackSuccess,
                  );
                  this.setState({ feedbackText: null });
                  this.setState({ hasSubmitted: false });
                } else {
                  //console.log('Invalid Input');
                }
              }
            }}
            style={styles.appButtonContainer}>
            <Text style={styles.appButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

export function getPercent(num) {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
    Dimensions.get('window');

  //based on Tongzhou's code and iPhone 12
  const scalePercent = SCREEN_HEIGHT / 844; // get scale based on iPhone 12
  let percent = scalePercent * num;
  return percent.toString() + '%';
}

export function getPercentWidth(num) {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
    Dimensions.get('window');

  let scalePercent = SCREEN_WIDTH / 390;
  if (scalePercent > 1) scalePercent = 1;
  let percent = scalePercent * num;
  return percent.toString() + '%';
}

export function getWidth(num) {
  let { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

  let screenWidthFactor = SCREEN_WIDTH / 390;
  if (screenWidthFactor > 1.2) screenWidthFactor = 1.2;
  return num * screenWidthFactor;
}

export function getHeight(num) {
  let { height: SCREEN_HEIGHT } = Dimensions.get('window');
  if (DeviceInfo.getBrand() === 'google') SCREEN_HEIGHT += 100;
  const screenHeightFactor = SCREEN_HEIGHT / 844;
  return num * screenHeightFactor;
}

const styles = StyleSheet.create({
  inputFeedback: {
    width: getWidth(354),
    height: getHeight(191),
    borderWidth: 0,
    backgroundColor: 'white',
    borderRadius: normalizeHeight(15),
    alignItems: 'center',
    textAlign: 'left',
    fontFamily: 'Poppins-Regular',
  },
  inputEmail: {
    width: getWidth(354),
    height: 50,
    paddingLeft: 10,
    borderWidth: 0,
    backgroundColor: 'white',
    borderRadius: getHeight(15),
    alignItems: 'center',
    textAlign: 'left',
    fontSize: normalizeFont(14),
    fontFamily: 'Poppins-Regular',
  },
  container: {
    marginTop: '8%',
    marginBottom: '10%',
  },
  feedbackDescribe: {
    marginLeft: getPercent(6),
    marginBottom: '-2%',
    fontFamily: 'Poppins-Medium',
    fontSize: normalizeFont(16),
    lineHeight: 25.5,
  },
  textBox: {
    fontFamily: 'Poppins-Medium',
    paddingLeft: '5%',
  },
  feedbackWarn: {
    fontFamily: 'Poppins-Medium',
    fontSize: normalizeFont(13),
    lineHeight: 21,
  },
  feedbackContainer: {
    marginTop: '3%',
    alignItems: 'center',
  },
  submitButton: {
    marginTop: getPercent(48),
  },
  errText: {
    fontFamily: 'Poppins-Regular',
    fontSize: normalizeFont(10),
    lineHeight: 15,
    color: '#FF0000',
    marginLeft: '-50%',
    marginTop: '1%',
  },
  appButtonContainer: {
    width: 244,
    height: 47,
    backgroundColor: '#FD993C',
    borderRadius: 30,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appButtonText: {
    fontSize: normalizeFont(24),
    color: '#fff',
    lineHeight: 36,
    fontFamily: 'Poppins-Bold',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  vector: {
    marginLeft: '7.24%',
    top: '1.87%',
    height: 21,
  },
  title: {
    fontFamily: 'Poppins-Medium',
    marginLeft: '26.21%',
    top: '1.77%',
    fontWeight: '500',
    fontSize: normalizeFont(24),
    lineHeight: 36,
  },
});

export default Feedback;
