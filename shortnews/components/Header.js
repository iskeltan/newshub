
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from '../Stylesheets';
import Ionicons from 'react-native-vector-icons/Ionicons';

class Header extends React.Component{

    render(){
        return (
        <View style={styles.header}>
            <View style={styles.headerLogo}>
                <Text style={styles.hedaerLogoNormal}>{'>'}news</Text><Text style={styles.headerLogoBold}>hub</Text>
                <View style={styles.headerSettings}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("Settings")}>
                        <Ionicons name="ios-settings-outline" size={24} color={'#1A1C1A'} />
                    </TouchableOpacity>
                </View>
            </View>
      </View>
        )
    }
}


export default Header;