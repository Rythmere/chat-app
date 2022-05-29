import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import 'firebase/firestore';
import firebase from 'firebase';

export default class CustomActions extends React.Component {

    //converts image into blob and uploads it to firebase
    imageUpload = async (uri) => {
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            resolve(xhr.response);
          };
          xhr.onerror = function (e) {
            console.log(e);
            reject(new TypeError('Network request failed'));
          };
          xhr.responseType = 'blob';
          xhr.open('GET', uri, true);
          xhr.send(null);
        });
    
        const imageNameBefore = uri.split("/");
        const imageName = imageNameBefore[imageNameBefore.length - 1];
        
        //creates storage reference to firebase 
        const ref = firebase.storage().ref().child(`images/${imageName}`);
        const snapshot = await ref.put(blob);
    
        blob.close();
    
        return await snapshot.ref.getDownloadURL();
      }

      //Ask user user for permission to access media library then allow them to choose a image that will be sent
      pickImage = async () => {
        const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
        if(status === 'granted') {
           let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'Images'
          }).catch(error => console.log(error));
        
        if(!result.cancelled) {
          const imageURL = await this.imageUpload(result.uri);
          this.props.onSend({ image: imageURL});
      }
      }
    }
    
    //Asks user for camera permission then allo them to take a photo to send
      takePhoto = async () => {
        const {status } = await Permissions.askAsync(Permissions.CAMERA)
        if(status === 'granted') {
          let result = await ImagePicker.launchCameraAsync({
            mediaTypes: 'Images'
          }).catch(error => console.log(error));
        
        if(!result.cancelled) {
            const imageURL = await this.imageUpload(result.uri);
            this.props.onSend({ image: imageURL});
        }
      }
      }
    
      //Asks user for location permission then sends there location 
      getLocation = async () => {
        const { status } = await Permissions.askAsync(Permissions.LOCATION_FOREGROUND);
        if(status === 'granted') {
        let result = await Location.getCurrentPositionAsync({});
    
          if(result) {
            console.log(result);
            this.props.onSend({
                location: {
                latitude: result.coords.latitude,
                longitude: result.coords.longitude,
                }
                
                
            })
          }
        }
      }

    //creates action menu options and runs function to perform the action
    onActionPress = () => {
        const options = ['Choose from Library', 'Take Photo', 'Send your Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        this.context.actionSheet().showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        console.log('user wants to pick image');
                        return this.pickImage();
                    case 1:
                        console.log('user want to take photo');
                        return this.takePhoto();
                    case 2:
                        console.log('user wants their location');
                        return this.getLocation();
                }
            }
        );
    };
    render() {
        return (
            <TouchableOpacity
                accessible={true}
                accessibilityLabel="More options"
                accessibilityHint="Opens menu to send a photo or your location"
                accessibilityRole="button" 
                style={styles.container} 
                onPress={this.onActionPress}>
                <View style={[styles.wrapper, this.props.wrapperStyle]}>
                    <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

CustomActions.contextTypes = {
    actionSheet: PropTypes.func,
   };

const styles = StyleSheet.create({
    container: {
      width: 26,
      height: 26,
      marginLeft: 10,
      marginBottom: 10,
    },
    wrapper: {
      borderRadius: 13,
      borderColor: '#b2b2b2',
      borderWidth: 2,
      flex: 1,
    },
    iconText: {
      color: '#b2b2b2',
      fontWeight: 'bold',
      fontSize: 16,
      backgroundColor: 'transparent',
      textAlign: 'center',
    },
   });