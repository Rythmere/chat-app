import React from "react";
import { StyleSheet, View, Text, Button, TextInput, ImageBackground, TouchableOpacity} from 'react-native';
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import BackGroundImage from '../assets/BackgroundImage.png';

const BGcolors = {
    black: "#090C08",
    purple: "#474056",
    gray: "#8A95A5",
    green: "#B9C6AE",
  };

export default class Start extends React.Component {
    constructor(props) {
        super(props);
        this.state = { name: '', color: ''};
    }
    /*Sets color state when called */
    changeBgColor = (newColor) => {
        this.setState({ color: newColor });
      };

render() {
    return (
        
        <View style={styles.container}>
             {/* Sets start screen background to background image from assets folder */}
            <ImageBackground source={BackGroundImage} resizeMode='cover' style={styles.image}>
            <View style={styles.titleContainer}>          
            <Text style={styles.title}>Chat App</Text>
            </View>   
            {/* Creates box app elements are contained in */}
            <View style={styles.box}>
            <TextInput
                style={styles.Username}
                onChangeText={(name) => this.setState({name})}
                value={this.state.name}
                placeholder='Enter username'
            />
            <Text style={styles.text}>Choose Background Color</Text>
            <View style={styles.colorContainer}>
                {/* Creates selectable icons that update color state */}
                <TouchableOpacity
                style={[{ backgroundColor: BGcolors.black }, styles.colorbutton]}
                onPress={() => this.changeBgColor(BGcolors.black)} />
                <TouchableOpacity
                style={[{ backgroundColor: BGcolors.purple }, styles.colorbutton]}
                onPress={() => this.changeBgColor(BGcolors.purple)} />
                <TouchableOpacity
                style={[{ backgroundColor: BGcolors.gray }, styles.colorbutton]}
                onPress={() => this.changeBgColor(BGcolors.gray)} />
                <TouchableOpacity
                style={[{ backgroundColor: BGcolors.green }, styles.colorbutton]}
                onPress={() => this.changeBgColor(BGcolors.green)} />
            </View>
            {/* Navigates to chat when pressed, passing name and color state to chat view */}
            <Pressable
                style={styles.button}
                onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, color: this.state.color})}
            >
                <Text style={styles.buttonText}>Start Chatting</Text>
            </Pressable>
            </View>
            </ImageBackground>
        </View>
    )
}
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    image: {
        flex: 1,
        justifyContents: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 45,
        fontWeight: '600',
        color: '#ffffff'
    },
    titleContainer: {
        width: '88%',
        height: '50%',
        alignItems: 'center',
        paddingTop: '10%'
    },
    box: {
        width: '88%',
        height: '44%',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-around',
        
    },
    Username: {
        width: '88%',
        height: '20%',
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
        borderColor: 'gray',
        borderWidth: 1,
        alignItems: 'center'
    },
    text: {
        color: '#757083',
        fontSize: 16,
        fontWeight: '300',
    },
    
    colorContainer: {
        width: '88%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    
    colorbutton: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },

    button: {
        width: '88%',
        height: '20%',
        backgroundColor: '#757083',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    }
});
