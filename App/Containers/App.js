import React, {Component} from 'react';
//import { StyleSheet, View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';

import SplashScreen from './SplashScreen';
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
import ForgotPassScreen from './ForgotPassScreen';
import SignUpScreen from './SignUpScreen';
import QuestionsScreen from './QuestionsScreen';
import SingleQuesFunctionsScreen from './SingleQuesFunctionsScreen';
import PurchaseScreen from './PurchaseScreen';

const App = StackNavigator({
  splash:{
      screen: SplashScreen,
      navigationOptions:{
        headerStyle:{ position: 'absolute', backgroundColor: 'transparent', borderBottomWidth: 0, zIndex: 100, top: 0, left: 0, right: 0 },
        headerVisible: false,
        headerLeft: null,
      }
  },
  login:{
      screen: LoginScreen,
      navigationOptions:{
        headerStyle:{ position: 'absolute', backgroundColor: 'transparent', borderBottomWidth: 0, zIndex: 100, top: 0, left: 0, right: 0 },
        headerVisible: false,
        headerLeft: null,
        title: ''
      }
  },
  home:{
      screen: HomeScreen,
      navigationOptions:{
        headerStyle:{ position: 'absolute', backgroundColor: 'transparent', zIndex: 100, top: 0, left: 0, right: 0 },
        headerVisible: false,
        title: 'Home',
        headerLeft: null,
      }
  },
  signUp:{
      screen: SignUpScreen,
      navigationOptions:{
        headerStyle:{ position: 'absolute', backgroundColor: 'transparent', zIndex: 100, top: 0, left: 0, right: 0 },
        title:'Sign Up'
      }
  },
  forgotPass:{
      screen: ForgotPassScreen,
      navigationOptions:{
        headerStyle:{ position: 'absolute', backgroundColor: 'transparent', zIndex: 100, top: 0, left: 0, right: 0 },
        title:'Reset Password'
      }
  },


  questionsScreen:{
      screen: QuestionsScreen,
      navigationOptions:{
        headerStyle:{ position: 'absolute', backgroundColor: '#3cc1e7', zIndex: 100, top: 0, left: 0, right: 0 },
        headerVisible: false,
        title:'Questions'
      }
  },
  singleQuesFunctionsScreen:{
      screen: SingleQuesFunctionsScreen,
      navigationOptions:{
        headerStyle:{ position: 'absolute', backgroundColor: '#3cc1e7', zIndex: 100, top: 0, left: 0, right: 0 },
        headerVisible: false,
        title:'Record Video'
      }
  },
  purchaseScreen: {
      screen: PurchaseScreen,
      navigationOptions: {
        headerStyle: { position: 'absolute',
        backgroundColor: '#3cc1e7',
        //backgroundColor: 'transparent',
        zIndex: 100,
        top: 0,
        left: 0,
        right: 0
      },
        headerVisible: false,
        title: 'Purchase Questions'
      }
  }
},{ mode: 'modal' })

export default App
