import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/Home';
import SearchScreen from '../screens/Search/search';
import LoginScreen from '../screens/Login/login';
import { DrawerContent } from '../screens/Drawer/drawerContent';
import About from '../screens/About/about';
import Profile from '../screens/Profile/profile';
import Feedback from '../screens/Feedback/feedback';
import FeedbackSuccess from '../screens/Feedback/feedbackSuccess';
import Chat from '../screens/Chat/chat';
import MemberList from '../screens/Chat/memberList';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
function Home() {
  return (
    <Drawer.Navigator
      drawerStyle={{ width: '74.6%' }}
      drawerContent={props => <DrawerContent {...props} />}
      initialRouteName="HomeScreen"
      backBehavior="initialRoute">
      <Drawer.Screen name="HomeScreen" component={HomeScreen} />
      <Drawer.Screen name="About" component={About} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Feedback" component={Feedback} />
    </Drawer.Navigator>
  );
}

const Routes = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MemberList"
        component={MemberList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="FeedbackSuccess"
        component={FeedbackSuccess}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default Routes;
