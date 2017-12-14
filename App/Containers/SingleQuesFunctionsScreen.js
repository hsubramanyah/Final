import React, { Component } from 'react';
import {
  Alert,
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  PixelRatio,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
  Linking,
  ActivityIndicator
} from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay';
import Colors from '../Themes/Colors'
import firebaseApp from '../Config/FirebaseConfig'
import Styles from './Styles/LoginScreenStyles'
import Icon from 'react-native-vector-icons/FontAwesome';
import Metrics from '../Themes/Metrics'
import RoundedButton from '../Components/RoundedButton'
import ImagePicker from 'react-native-image-picker';
import AWSConfig from '../Config/AWS';
import { RNS3 } from 'react-native-aws3';

const AWS = require('aws-sdk');


const background = require("../Images/background.png")
const intStudioIcon = require("../Images/intStudioIcon.png");

export default class HomeScreen extends Component {
  keyboardDidShowListener = {}
  keyboardDidHideListener = {}

  constructor(props) {
    super(props)
    //alert('cons')
    //this.createFoldersInAWS();
    //this.pitchesRef = firebaseApp.database().ref().child('/pitches');
    const { params } = this.props.navigation.state;
    /*console.log(params);
    const user = firebaseApp.auth().currentUser;

    const question = firebaseApp.database().ref().child(
      'users/' + user.uid + '/questions/' + params._key + '/');

     question.on('value', (dataSnapshot) => {
        console.log(dataSnapshot);
        //alert(dataSnapshot.child('responseUrl').val());
      this.setState({
        responseUrl: dataSnapshot.child('responseUrl').val()
      });


      console.log('log40 ', dataSnapshot.child('responseUrl').val());
    });*/
      AWS.config.region = AWSConfig.region;
      AWS.config.accessKeyId = AWSConfig.accessKey;
      AWS.config.secretAccessKey = AWSConfig.secretKey;


      const s3Client = new AWS.S3();
      const params1 = { Bucket: AWSConfig.bucket,
                        Prefix: `${user.email}/${params._key}/feedback/`,
                       };

      s3Client.listObjectsV2(params1, (err, data) => {
        if (err) {
          console.log('Error listing the folder: ', err);
      } else {
        console.log(data.Contents);
        if (data.Contents.length > 1) {
          var url = encodeURI('https://s3.amazonaws.com/' + AWSConfig.bucket + '/' +data.Contents[1].Key)
          this.setState({ feedback: url })
        }
        //data.contents.forEach()
      }
  });

  //alert(params.responseUrl)
    this.state = {
      topLogo: { width: Metrics.screenWidth },
      avatarSource: null,
      videoSource: null,
      feedback: null,
      responseUrl: params.responseUrl,
      uploading: true,
      initialPosition: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0
      },
      error: null
    }
  }


  /*watchId: ?number=null
  // componentDidMount() {
  //
  // }*/

  componentDidMount() {
    const { params } = this.props.navigation.state;
    console.log(params);
    const user = firebaseApp.auth().currentUser;
    const question = firebaseApp.database().ref().child(
      'users/' + user.uid + '/questions/' + params._key + '/');

     question.on('value', (dataSnapshot) => {
        console.log(dataSnapshot);
        //alert(dataSnapshot.child('responseUrl').val());
      this.setState({
        responseUrl: dataSnapshot.child('responseUrl').val(),
        uploading: false
      });
  });

}

  /*componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  keyboardDidShow = (e) => {
    // Animation types easeInEaseOut/linear/spring
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    let newSize = Metrics.screenHeight - e.endCoordinates.height
    this.setState({
      visibleHeight: newSize,
      topLogo: {width: 100, height: 70}
    })
  }

  keyboardDidHide = (e) => {
    // Animation types easeInEaseOut/linear/spring
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    this.setState({
      visibleHeight: Metrics.screenHeight,
      topLogo: {width: Metrics.screenWidth}
    })
  }*/

  createFoldersInAWS=() => {
    const { params } = this.props.navigation.state;
    const user = firebaseApp.auth().currentUser;
    const question = firebaseApp.database().ref().child(
      'users/' + user.uid + '/questions/' + params._key + '/');
    console.log(this.props.navigation.state);
    const file = {
      // `uri` can also be a file system path (i.e. file://)
      //uri: '/Users/macpc/Downloads/sample_iTunes.mov',
      uri: this.state.videoSource,
      name: `${params._key}_response.mov`,
      type: 'video/quicktime'
    }

    const options = {
      keyPrefix: `${user.email}/${params._key}/response/`,
      bucket: AWSConfig.bucket,

      successActionStatus: 201,
      acl: 'public-read',
      region: AWSConfig.region,
      accessKey: AWSConfig.accessKey,
      secretKey: AWSConfig.secretKey
    }
    //const question = firebaseApp.database().ref().child('users/' + user.uid + '/questions/' + params._key + '/');

    RNS3.put(file, options).then(response => {
      if (response.status !== 201) {
        console.log('Fail!!!!!', response.body);
        //throw new Error('Failed to upload image to S3');
      }else{

console.log(response.body);
question.update({ response: true,
responseUrl: response.body.postResponse.location});
}
Alert.alert("Your Response has been uploaded successfully!");
    });

    AWS.config.region = AWSConfig.region;
    AWS.config.accessKeyId = AWSConfig.accessKey;
    AWS.config.secretAccessKey = AWSConfig.secretKey;

    const s3Client = new AWS.S3();
    const params1 = { Bucket: AWSConfig.bucket,
                      Key: `${user.email}/${params._key}/feedback/`,
                      ACL: 'public-read',
                      Body: 'body' };

    s3Client.upload(params1, (err, data) => {
      if (err) {
        console.log('Error creating the folder: ', err);
    } else {
      console.log('Successfully created a folder on S3');
    }
});
  }

  handlePressLogout = () =>{
    const { navigate } = this.props.navigation;
    firebaseApp.auth().signOut().then(() => {
      this.isAttempting = false
      navigate('login');
    }).catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorMessage);
    });
  }

  /*handlePressGetDirections = () => {
    //const { navigate } = this.props.navigation;
    //navigate('pitchesScreen');
    const { params } = this.props.navigation.state;
    //const { latitude, longitude } = this.state;
    const data = {
      source: {
         latitude: parseFloat(this.state.initialPosition.latitude),
         longitude: parseFloat(this.state.initialPosition.longitude)
         //latitude: parseFloat(latitude),
         //longitude: parseFloat(longitude)
         //latitude: 41.840389,
         //longitude: -87.616390
      },
      destination: {
        latitude: parseFloat(params.latitude),
        longitude: parseFloat(params.longitude)
        //latitude: 41.867573,
        //longitude: -87.614038
      },
      params: [
        {
          key: "dirflg",
          value: "d"
        }
      ]
  }
    getDirections(data);
  }*/
  handlePressUploadResponse = () => {
    const { params } = this.props.navigation.state;
    this.setState({ uploading: true })
    //const { navigate } = this.props.navigation;
    //navigate('addPitch');
    //<Text>{`${params.title} \n`}</Text>
    /*var a = params.title;
    var b = params.address;
    var c = params.surface;
    var d = params.lights;
    var e = params.size;*/
    this.createFoldersInAWS();

  }

  /*selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source = { uri: response.uri };


        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source
        });
      }
    });
  }*/

  selectVideoTapped() {
    const options = {
      title: 'Video Picker',
      takePhotoButtonTitle: 'Take Video...',
      mediaType: 'video',
      videoQuality: 'medium'
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled video picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        this.setState({
          videoSource: response.uri
      });

}
    });
  }
handleDownloadFeedback = () => {

  if (this.state.feedback === null ) {
    alert('No Feedback Available');
  } else {
    //alert('Test');
    //alert(`path ${RNFS.DocumentDirectoryPath}`)
    /*RNFS.downloadFile({
        fromUrl: this.state.feedback,
        toFile: `${RNFS.DocumentDirectoryPath}/react-native.png`,
      }).promise.then((r) => {
        alert('File Successfully Downloaded');
        this.setState({ isDone: true })
      });*/
      Linking.canOpenURL(this.state.feedback).then(supported => {
  if (!supported) {
    console.log('Can\'t handle url: ' + this.state.feedback);
  } else {
    return Linking.openURL(this.state.feedback);
  }
}).catch(err => console.error('An error occurred', err));
  }
}

handleDownloadResponse = () => {
  Linking.canOpenURL(this.state.responseUrl).then(supported => {
    if (!supported) {
      console.log('Can\'t handle url: ' + this.state.feedback);
    } else {
      return Linking.openURL(this.state.responseUrl);
    }
  }).catch(err => console.error('An error occurred', err));
}


renderResponseButton =() => {
  const { params } = this.props.navigation.state;
  console.log(params);
  const user = firebaseApp.auth().currentUser;

  const question = firebaseApp.database().ref().child(
    'users/' + user.uid + '/questions/' + params._key + '/');
    /*let responseUrl = null;
    question.once('value', (dataSnapshot) => {

      responseUrl = dataSnapshot.child('responseUrl').val();*/
      //alert(this.state.responseUrl );
      if (this.state.responseUrl !== 'a') {
        return (
          <RoundedButton style={Styles.loginButton} onPress={this.handleDownloadResponse}>
            View Uploaded Response
          </RoundedButton>
        );
      } else if (this.state.videoSource === null) {
        return (
          <TouchableOpacity style={styles.button} onPress={this.selectVideoTapped.bind(this)}>

              <Text style={styles.buttonText}>RECORD / SELECT VIDEO</Text>

          </TouchableOpacity>
        );
      } else {
        return (
          <View>
          <TouchableOpacity style={styles.button} onPress={this.selectVideoTapped.bind(this)}>

            <Text style={styles.buttonText}>RESELECT VIDEO</Text>

            </TouchableOpacity>

            <RoundedButton style={Styles.loginButton} onPress={this.handlePressUploadResponse}>
              Upload Response
            </RoundedButton>
            </View>
          );
      }


}

  render() {
    if (this.state.uploading) {
      return (

          <ImageBackground source={background} style={[Styles.backgroundImage]}>
            <ScrollView
              contentContainerStyle={{ justifyContent: 'center' }}
              style={[Styles.container]} keyboardShouldPersistTaps='always'
            >
            <View style={Styles.logoWrapper}>
              <Image source={intStudioIcon} style={[Styles.topLogo, this.state.topLogo]} />
            </View>
            <ActivityIndicator
          style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1

          }}
        size={'large'}
          />
        </ScrollView>
      </ImageBackground>

    );
    }
    return (
      <ImageBackground source={background} style={[Styles.backgroundImage]}>
        <ScrollView
          contentContainerStyle={{ justifyContent: 'center' }}
          style={[Styles.container]} keyboardShouldPersistTaps='always'
        >
        <View style={Styles.logoWrapper}>
          <Image source={intStudioIcon} style={[Styles.topLogo, this.state.topLogo]} />
          </View>
          <View>
            <View>
                {
                  this.renderResponseButton()
                }
                <RoundedButton style={Styles.loginButton} onPress={this.handleDownloadFeedback}>
                  View Feedback
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

const styles = StyleSheet.create({

button: {
  height: 45,
  borderRadius: 5,
  marginHorizontal: Metrics.section,
  marginVertical: Metrics.baseMargin,
  backgroundColor: Colors.fire,
  justifyContent: 'center'
},
buttonText: {
  color: Colors.snow,
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: 14,
  marginVertical: Metrics.baseMargin
}
});
