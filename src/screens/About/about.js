import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  Linking,
} from 'react-native';
import StyledText from 'react-native-styled-text';
import Arrow from '../../assets/icons/blackArrow.svg';
import Fb from '../../assets/icons/fb.svg';
import Ins from '../../assets/icons/ins.svg';

class About extends React.Component {
  state = {
    name: '',
  };

  changeName = newName => {
    this.setState({
      name: newName,
    });
  };

  onPress = () => {
    this.props.navigation.toggleDrawer();
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.heading}>
          <View style={styles.vector}>
            <TouchableOpacity 
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              onPress={this.onPress}>
              <Arrow />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>About</Text>
          <View></View>
        </View>

        <View>
          <StyledText textStyles={textStyles} style={styles.textarea}>
            {
              '<nm>Collimate was created by UC Davis students to make it easier for UC Davis students to find classmates and build connections.\n \nCollimate will </nm><hl>automatically create</hl><nm> group chats for all UC Davis undergraduate courses each quarter.\n \n<nm>Follow</nm><hl> #collimatechat</hl><nm> on Instagram and Facebook to learn more.</nm>'
            }
          </StyledText>
        </View>

        <View style={styles.end0}>
          <Fb />
          <Ins style={styles.ins} />
          <Circle />
          <Text style={styles.at}>@collimatechat</Text>
        </View>
        <TouchableOpacity style={styles.end}>
          <Text
            style={styles.underline}
            onPress={() => Linking.openURL('http://www.collimate.me')}>
            Privacy Policy
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const textStyles = StyleSheet.create({
  nm: { //normal
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    lineHeight: 22.5,
  },
  hl: {
    //highlight
    fontFamily: 'Poppins-Bold',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 24,
    color: '#FE8F28',
  },
});

const Circle = () => {
  return <View style={styles.circle} />;
};

const styles = StyleSheet.create({
  container: {
    fontFamily: 'Poppins-Thin',
    backgroundColor: '#F3F3F3',
    height: '100%',
    display: 'flex',
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
    marginLeft: '31.52%',
    top: '1.77%',
    fontWeight: '500',
    fontSize: 24,
    lineHeight: 36,
  },
  textarea: {
    width: '85.5%',
    marginLeft: '7.2%',
    top: '9.1%',
  },
  end0: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    marginLeft: '31%',
    bottom: '8.84%',
  },
  ins: {
    marginLeft: '2.1%',
  },
  circle: {
    marginTop: '2.5%',
    marginLeft: '2.4%',
    display: 'flex',
    justifyContent: 'center',
    width: 4.67,
    height: 4.67,
    borderRadius: 4.67 / 2,
    backgroundColor: '#FD993C',
  },
  at: {
    fontFamily: 'Poppins-Regular',
    bottom: '1.9%',
    marginLeft: '2.4%',
    color: '#FE8F28',
  },
  end: {
    position: 'absolute',
    marginLeft: '38%',
    bottom: '5.2%',
  },
  underline: {
    fontFamily: 'Poppins-Regular',
    textDecorationLine: 'underline',
    fontSize: 12,
    lineHeight: 18,
  },
});

export default About;
