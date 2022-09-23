import React from 'react';
import {
  FlatList, Keyboard,
  Platform, SafeAreaView, StyleSheet, Text, TextInput,
  TouchableOpacity, TouchableWithoutFeedback, View
} from 'react-native';
import Arrow from '../../assets/icons/arrow.svg';
import Search from '../../assets/icons/searchGrey.svg';
import { getCurrentQuarter } from '../../services/data/firebase/directGet';
import { searchChat } from '../../services/data/firebase/fetcher.js';
import HomeScreen from '../Home';
import ListItem from './searchTable.js';

const DismissKeyBoard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

class SearchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchKey: '',
      displayCourse: false,
      errorMessage: '',
      CourseList: null,
      buttonState: 'Join',
      badSearch: false,
      currentQuarter: '',
    };
    this.errorWor = '';
  }

  componentDidMount() {
    getCurrentQuarter().then(response => {
      // console.log(response);       // Check current quarter for debug purpose
      this.setState({
        currentQuarter: response,
      });
    });
  }

  onPress = () => {
    this.setState({
      displayCourse: true,
    });
  };

  onClick = () => {
    this.props.navigation.navigate('Home', HomeScreen);
  };

  errorWord = () => {
    this.setState({
      errorMessage: 'No results found for cs',
      badSearch: true,
    });
  };

  joinButton = () => {
    this.setState({
      buttonState: 'In',
    });
  };

  handleKeyDown = async () => {
    var text = this.state.searchKey;
    var courseList = [];
    try {
      courseList = await searchChat(text, this.state.currentQuarter);
      this.setState({
        CourseList: courseList,
        badSearch: false,
        //displayCourse: true,
      });
    } catch (err) {
      this.setState({
        errorMessage: 'No results found for "' + text + '"',
        badSearch: true,
      });
    }
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 20,
          width: '100%',
          backgroundColor: '#F3F3F3',
        }}
      />
    );
  };

  renderBottomView() {
    // show course list
    if (!this.state.badSearch) {
      return (
        <FlatList
          style={styles.flatlist}
          keyboardDismissMode="on-drag" //for ios
          onScrollBeginDrag={Keyboard.dismiss} //for android
          data={this.state.CourseList}
          keyExtractor={item => item.courseID}
          contentContainerStyle={{ paddingTop: 30, paddingBottom: 80 }}
          renderItem={({ item }) => {
            return <ListItem item={item} />;
          }}
          ItemSeparatorComponent={this.renderSeparator}
        />
      );
    } else if (this.state.badSearch) {
      return (
        <SafeAreaView>
          <DismissKeyBoard>
            <Text style={styles.errorWord}>{this.state.errorMessage}</Text>
          </DismissKeyBoard>
        </SafeAreaView>
      );
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.top}>
          <View style={styles.vector}>
            <TouchableOpacity
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              onPress={this.onClick}>
              <Arrow />
            </TouchableOpacity>
          </View>
          <View style={styles.sBar}>
            <TouchableOpacity onPress={this.onPress} style={styles.button}>
              <Search />
            </TouchableOpacity>
            <TextInput
              style={styles.searchInput}
              returnKeyType="search"
              autoCorrect={false}
              autoCapitalize={'none'}
              onChangeText={text => this.setState({ searchKey: text })}
              onSubmitEditing={this.handleKeyDown}
              placeholder="e.g ECN001"
            />
          </View>
        </View>
        {this.renderBottomView()}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    fontFamily: 'Poppins-Medium',
    backgroundColor: '#F3F3F3',
    display: 'flex',
  },
  seperator: {
    backgroundColor: '#F3F3F3',
    padding: 2,
  },
  top: {
    width: '100%',
    height: 67,
    left: 0,
    top: 0,
  },
  vector: {
    position: 'absolute',
    marginLeft: '7.24%',
    marginRight: '90.2%',
    top: '35.07%',
  },
  sBar: {
    position: 'absolute',
    width: '76%',
    height: '62.7%',
    left: '16.4%',
    top: '19.4%',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
  },
  searchInput: {
    fontFamily: 'Poppins-Medium',
    position: 'absolute',
    width: '76%',
    height: Platform.OS === 'ios' ? '100%' : '113%',
    marginLeft: '17.09%',
    fontSize: 16,
  },
  button: {
    position: 'absolute',
    marginLeft: '7%',
    marginRight: '87%',
    top: '28.6%',
    bottom: '12.48%',
    color: '#F3F3F3',
  },
  errorWord: {
    fontFamily: 'Poppins-Medium',
    position: 'absolute',
    width: '100%',
    display: 'flex',
    textAlign: 'center',
    marginTop: '11.82%',
    fontSize: 16,
    lineHeight: 30,
  },
  flatlist: {
    height: '100%',
  },
});

export default SearchScreen;
