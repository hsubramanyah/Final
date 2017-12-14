import React, { PropTypes } from 'react'
import {
  Alert,
  View,
  ScrollView,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  ListView
} from 'react-native'
import QuesListStyles from './Styles/QuesListStyles'
import firebaseApp from '../Config/FirebaseConfig'
import ListQuestions from '../Components/ListQuestions'

const background = require('../Images/background.png');


class QuestionsScreen extends React.Component {

  constructor(props) {
    super(props);
    this.allQuestions = firebaseApp.database().ref('/questions');
    this.userQuestions =
    firebaseApp.database().ref(`users/${firebaseApp.auth().currentUser.uid}/questions`);

    const dataSourceUserQues = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    const dataSourcePurchaseQues = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });



    question1 = firebaseApp.database().ref('/questions/question1');

    question1.once('value', (dataSnapshot) => {
      ques1 = {
      text: dataSnapshot.child('text').val(),
      response: false,
      feedback: false

    }
    this.questions = [{
      question1: ques1
    }]

    console.log('log40 ', this.questions);
    });
//console.log('log43 ',ques1);
    //test
    this.state = {
      dataSourceUserQues: dataSourceUserQues,
      dataSourcePurchaseQues: dataSourcePurchaseQues
      //question1 : this.ques1
    };
    console.log('test ', this.state);
  }

  componentDidMount() {
  // start listening for firebase updates
    this.listenForTasks(this.userQuestions, this.allQuestions);
  }

  containsKey(array, key) {
    var i;
    for (i = 0; i < array.length; i++) {
      if (array[i]._key === key) {
        return true;
      }
    }
    return false;
  }

  listenForTasks(userQuestions, allQuestions) {
    const unlockedQuestions = [];
    userQuestions.once('value', (dataSnapshot) => {
      dataSnapshot.forEach((child) => {
        unlockedQuestions.push({
          text: child.val().text,
          _key: child.key,
          responseUrl: child.val().responseUrl
        });
      });

      this.setState({
        dataSourceUserQues: this.state.dataSourceUserQues.cloneWithRows(unlockedQuestions),
        unlockedQuestions: unlockedQuestions
        });
    });
    const lockedQuestions = [];
    allQuestions.once('value', (dataSnapshot) => {
      dataSnapshot.forEach((child) => {
        if (!this.containsKey(unlockedQuestions, child.key)) {
          lockedQuestions.push({
            text: child.val().text,
            price: child.val().price,
            _key: child.key
          });
        }
      });
//console.log(lockedQuestions);
    this.setState({
      dataSourcePurchaseQues: this.state.dataSourceUserQues.cloneWithRows(lockedQuestions),
      lockedQuestions: lockedQuestions
    });
    });
  }


  renderFreeItem(task) {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('singleQuesFunctionsScreen',
        { text: `${task.text}`,
          _key: `${task._key}`,
          responseUrl: `${task.responseUrl}`
        })}
      >

        <ListQuestions task={task} />
      </TouchableOpacity>
    );
  }

  renderLockedItem(task) {
    console.log(this.state);
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('purchaseScreen',
        { text:`${task.text}`,
          _key: `${task._key}`,
          price: `${task.price}`,
          lockedQuestions: this.state.lockedQuestions
        })}
      >
        < ListQuestions task={task} />
      </TouchableOpacity>
    );
  }

  handlePressSingleQues = () =>{
    const { navigate } = this.props.navigation;
    navigate('singleQuesFunctionsScreen');
  }


  render() {
    //const { email } = this.state;
    //const textInputStyle =  Styles.textInput;
    return (
      <ImageBackground source={background} style={[QuesListStyles.backgroundImage]}>
        <View style={QuesListStyles.container}>
        <ScrollView
          contentContainerStyle={{ justifyContent: 'center' }}
          style={[QuesListStyles.container,
            { height: this.state.visibleHeight,
            paddingBottom: 50}] }
          keyboardShouldPersistTaps='always'
        >
          <ListView
              dataSource={this.state.dataSourceUserQues}
              enableEmptySections={true}
              renderRow={this.renderFreeItem.bind(this)}
              style={QuesListStyles.listView}
          />
          <ListView
              dataSource={this.state.dataSourcePurchaseQues}
              enableEmptySections={true}
              renderRow={this.renderLockedItem.bind(this)}
              style={QuesListStyles.listView}
          />
          <Text style={{ paddingTop: 100, backgroundColor: 'transparent' }} />
        </ScrollView>
        </View>
      </ImageBackground>
    )
  }

}

export default QuestionsScreen;
