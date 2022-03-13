import axios from 'axios';
import React from 'react';
import {View, FlatList, Text, Image, TouchableOpacity} from 'react-native';
import { Searchbar } from 'react-native-paper';
import NewsSection from './NewsSection';
import * as cSettings from '../CoreSettings';


class Search extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            keyword: null,
            data: [],
            baseUrl: cSettings.BASE_URL,
            page: 1
        }
    }

    onChangeSearch = async (query) => {

        var urlParams = new URLSearchParams(); 

        urlParams.append('title__contains', query);

        let request = axios.create({
            baseURL: this.state.baseUrl,
            params: urlParams
        });

        request.get(url=cSettings.SEARCH_ENDPOINT).then((resp) => {
            this.setState({data: resp.data.results});
        });
        
    }

    onPressItem = (item) => {
        this.props.navigation.navigate("Detail", {
            item: item
        });
    }

    renderItem = (item) => {
        return <NewsSection 
            onPress={() => this.onPressItem(item)} 
            item={item}
        />;
        
    }

    render(){
        return (
            <View>
                <Searchbar
                    placeholder={cSettings.SEARCH_PLACEHOLDER}
                    onChangeText={(query) => this.onChangeSearch(query)}
                    value={this.state.keyword}
                    style={{marginTop: 5, marginBottom: 5}}
                />
                <FlatList
                data={this.state.data}
                renderItem={({item}) => this.renderItem(item)}
                keyExtractor={(item, index) => index}
            />
            </View>
        )
    }
}

export default Search;
  