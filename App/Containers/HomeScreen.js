import React, { Component } from 'react';
import {
  View,
  ScrollView,
  ImageBackground,
  Image
} from 'react-native';
import firebaseApp from '../Config/FirebaseConfig';
import Styles from './Styles/LoginScreenStyles';
import Metrics from '../Themes/Metrics';
import RoundedButton from '../Components/RoundedButton';

const background = require('../Images/background.png');
const intStudioIcon = require('../Images/intStudioIcon.png');

export default class HomeScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      topLogo: { width: Metrics.screenWidth },
    };
  }
  keyboardDidShowListener = {}
  keyboardDidHideListener = {}
  keyboardDidShow = (e) => {
    // Animation types easeInEaseOut/linear/spring
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    let newSize = Metrics.screenHeight - e.endCoordinates.height
    this.setState({
      visibleHeight: newSize,
      topLogo: { width: 100, height: 70 }
    })
  }

  keyboardDidHide = (e) => {
    // Animation types easeInEaseOut/linear/spring
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    this.setState({
      visibleHeight: Metrics.screenHeight,
      topLogo: {width: Metrics.screenWidth}
    })
  }
  handlePressLogout = () =>{
    const { navigate } = this.props.navigation;
    firebaseApp.auth().signOut().then(()=>{
      this.isAttempting = false
      navigate('login');
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorMessage);
    });
  }
  handlePressListQuest = () => {
    const { navigate } = this.props.navigation;
    navigate('questionsScreen');
    //.catch(function(error) {
      // Handle Errors here.
      //var errorCode = error.code;
      //var errorMessage = error.message;
      //alert(errorMessage);
    //});
  }



  render() {
    return (
      <ImageBackground source={background} style={[Styles.backgroundImage]}>
        <ScrollView
          contentContainerStyle={{ justifyContent: 'space-around' }}
          style={[Styles.container]}
          keyboardShouldPersistTaps='always'
        >
        <View style={Styles.logoWrapper}>
          <Image source={intStudioIcon} style={[Styles.topLogo, this.state.topLogo]} />
          </View>
          <View>
            <View>
                <RoundedButton style={Styles.loginButton} onPress={this.handlePressListQuest}>
                  Interview Question List
                </RoundedButton>
                <RoundedButton style={Styles.loginButton} onPress={this.handlePressLogout}>
                  Logout
                </RoundedButton>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    )
  }
}
