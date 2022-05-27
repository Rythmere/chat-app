import React from 'react';
import {View, Platform, KeyboardAvoidingView} from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';


//Firestore database
const Firebase = require('firebase');
require('firebase/firestore');

//Firestore sdk
const firebaseConfig = {
    apiKey: "AIzaSyDLsdGnU_vvx158F6CsfljD5A-ylDjrVsw",
    authDomain: "chat-app-9a749.firebaseapp.com",
    projectId: "chat-app-9a749",
    storageBucket: "chat-app-9a749.appspot.com",
    messagingSenderId: "1034546258449",
    appId: "1:1034546258449:web:59f9ea0f230f9f6d0d07b0",
    measurementId: "G-9PPTV20NL4"
  };

export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            uid: 0,
            messages: [],
            user: {
                _id: '',
                name: '',
                avatar: '',
            }
        }

        // initializes firestore
    if (!Firebase.apps.length) {
        Firebase.initializeApp(firebaseConfig);
    }
    };

    componentDidMount() {
        const name = this.props.route.params.name;
        //references messages collection
        this.referenceMessages = Firebase.firestore().collection('messages');
        //authenticates user giving them a uid and sets user and uid states
        this.authUnsubscribe = Firebase.auth().onAuthStateChanged((user) => {
            if(!user) {
                Firebase.auth().signInAnonymously();
            }
            this.setState({
                uid: user.uid,
                user: {
                    _id: user.uid,
                    name: name,
                    avatar: 'https://placeimg.com/140/140/any'
                }
            });
            this.unsubscribe = this.referenceMessages.orderBy("createdAt", "desc").onSnapshot(this.onCollectionUpdate);
            
        });
    }

    //stops listeners for authentication and messages collection
    componentWillUnmount() {
        this.authUnsubscribe();
        this.unsubscribe();
    }

    //updates message state when there is a change to the database
    onCollectionUpdate = (querySnapshot) => {
        const message = [];
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          message.push({
            _id: data._id,
            text: data.text || '',
            createdAt: data.createdAt.toDate(),
            user: data.user
          });
        });
        this.setState({
          messages: message,
        });
      };
      //add messages to firebase database
      addMessages() {
          const message = this.state.messages[0];
          this.referenceMessages.add({
              uid: this.state.uid,
              _id: message._id,
              text: message.text,
              createdAt: message.createdAt,
              user: message.user
          });
      }

      //sets message state so they are displayed and sends them to firebase
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages)
        }), () => {
            this.addMessages();
        });
        
    }

    //Sets message bubbles color
    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: 'violet'
                    },
                    left: {
                        backgroundColor: 'lightblue'
                    }
                }}
                />
        )
    }
    render() {
        /*take color and name state from start screen*/ 
        let {color, name} = this.props.route.params;
        /*set navigator title to user entered name */
        this.props.navigation.setOptions({ title: name });
        return (
            
            <View style={{flex: 1, backgroundColor: color}}>
                <GiftedChat
                renderBubble={this.renderBubble.bind(this)}
                messages={this.state.messages}
                onSend={messages => this.onSend(messages)}
                user={{
                    _id: this.state.user._id,
                    name: name,
                    avatar: this.state.user.avatar
                }}
                />
                { Platform.OS === 'android' ? <KeyboardAvoidingView behaviour='height'/> : null }
            </View>
            
        )
    }
}