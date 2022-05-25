import React from 'react';
import {View, Text} from 'react-native';

export default class Chat extends React.Component {
    render() {
        /*take color and name state from start screen*/ 
        let {color, name} = this.props.route.params;
        /*set naviator title to user entered name */
        this.props.navigation.setOptions({ title: name });
        return (
            
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: color}}>
                <Text>Hello Chat</Text>
            </View>
        )
    }
}