import React from 'react';
import {View, Text, Button} from 'react-native';
import styles from '../Stylesheets';
import storage from '../storage/Storage';
import { FlatList } from 'react-native-gesture-handler';
import NewsSection from '../components/NewsSection';


class Saved extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            data: []
        }
    }

    renderItem = (item) => {
        return <NewsSection 
            onPress={() => this.onPressItem(item)} 
            item={item}
        />;
    }

    onPressItem = (item) => {
        this.props.navigation.navigate("Detail", {
            item: item
        });
    }

    onScreenFocus = () => {
        //storage.remove('savedNews');
        storage.getAllDataForKey('savedNews').then(savedNews => {
            this.setState({data: savedNews});
          });
    }
   
    componentDidMount() {
        this.props.navigation.addListener('focus', this.onScreenFocus)
        storage.getAllDataForKey('savedNews').then(savedNews => {
            this.setState({data: savedNews});
          });
    }

    render(){
        return (
            <View style={styles.homeContainer}>
                
                <FlatList 
                    data={this.state.data}
                    renderItem={({item}) => this.renderItem(item)}
                    keyExtractor={(item, index) => index}
                />
            </View>
        )
    }
}

export default Saved;