import React from 'react';
import {View, Platform, KeyboardAvoidingView} from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

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
            },
            isOnline: ''
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
        //Checks if user is online
        NetInfo.fetch().then(connection => {
            if (connection.isConnected) {
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
                    },
                    isOnline: connection.isConnected
                });
                //creates listener for messages collection. Updating meassages whenever a new message is added to the database
                this.unsubscribe = this.referenceMessages.orderBy("createdAt", "desc").onSnapshot(this.onCollectionUpdate);
                this.saveUid();
                });
            } else {
                this.getMessages();
                this.setState({
                    isOnline: connection.isConnected})
            }
        });
    }

    //stops listeners for authentication and messages collection
    componentWillUnmount() {
        NetInfo.fetch().then(connection => {
            if (connection.isConnected) {
                this.authUnsubscribe();
                this.unsubscribe();
            }
        });
    }

    //Gets saves messages and uid to set user _id to separate messages recieved and sent
    async getMessages() {
        let messages = '';
        let uid = '';
        const name = this.props.route.params.name;
        try {
            messages = await AsyncStorage.getItem('messages') || [];
            uid = await AsyncStorage.getItem('uid');
            this.setState({
                messages: JSON.parse(messages),
                uid: JSON.parse(uid),
                user: {
                    _id: JSON.parse(uid),
                    name: name,
                    avatar: 'https://placeimg.com/140/140/any'
                }
            });
        } catch (error) {
            console.log(error.message);
        }
    };

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

      //Deletes messages from users device
      async deleteMessages() {
          try {
              await AsyncStorage.removeItem('messages');
              this.setState({
                  messages: []
              })
          } catch (error) {
              console.log(error.message);
          }
      }

      // saves messages to device
      async saveMessages() {
          try {
              await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
          } catch (error) {
              console.log(error.message);
          }
      }

      //saves user id to device
      async saveUid() {
          try {
              await AsyncStorage.setItem('uid', JSON.stringify(this.state.uid))
          } catch (error) {
              console.log(error.message);
          }
      }

      //sets message state so they are displayed and sends them to firebase
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages)
        }), () => {
            this.addMessages();
            this.saveMessages();
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

    //Makes input box dissapeare if user is offline
    renderInputToolbar(props) {
        if (this.state.isOnline == false) {
        } else {
          return(
            <InputToolbar
            {...props}
            />
          );
        }
      }
    render() {
        /*take color and name state from start screen*/ 
        let {color, name} = this.props.route.params;
        /*set navigator title to user entered name */
        this.props.navigation.setOptions({ title: name });
        return (
            
            <View style={{flex: 1, backgroundColor: color}}>
                <GiftedChat
                renderInputToolbar={this.renderInputToolbar.bind(this)}
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