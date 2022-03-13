import axios from 'axios';
import React from 'react';
import {Text, View, FlatList, ActivityIndicator, Button} from 'react-native';
import storage from '../storage/Storage';
import styles from '../Stylesheets';
import NewsSection from './NewsSection';
import * as cSettings from '../CoreSettings';
import * as Notifications from 'expo-notifications';


class Home extends React.Component{

    constructor(){
        super();
        this.state = {
            isInit: true,
            isFetching: false,
            page: 1,
            data: [],
            selectedSources: [],
            selectedCategories: [],
            
            baseUrl: cSettings.BASE_URL
        }
    }

    onScreenFocus = () => {

        storage.load({key: 'selectedCategories', 
        id: 'selectedCategories'}).then(ret => {
            this.setState({selectedCategories: ret});
        });

        storage.load({key: 'selectedSources', 
            id: 'selectedSources'}).then(ret => {
                this.setState({selectedSources: ret}, () => {
                    this.getNews();
                })
            });
    }


    componentDidMount(){
        this.props.navigation.addListener('focus', this.onScreenFocus);
        this.setState({isInit: false});
    }

    getNews = async () => {
        var urlParams = new URLSearchParams(); 
        
        this.state.selectedSources.forEach((item) => {
            urlParams.append('source', item.id)
        });

        this.state.selectedCategories.forEach((item) => {
            urlParams.append('category', item.id);
        });

        urlParams.append('page', this.state.page);

        let request = axios.create({
            baseURL: this.state.baseUrl,
            params: urlParams
        });

        request.get(url=cSettings.SEARCH_ENDPOINT).then((resp) => {
            let data = this.state.data.concat(resp.data.results)
            let uniqueData = [...new Set(data)];
            //uniqueData.sort((a, b) => 0.5 - Math.random());
            this.setState({data: uniqueData});
        });
        
    }

    renderItem = (item) => {
        return <NewsSection 
            onPress={() => this.onPressItem(item)} 
            item={item}
        />;
        
    }

    getMore = async () => {
        this.setState({isFetching: true});
        this.getNews();
        this.setState({page: this.state.page + 1});
        this.setState({isFetching: false});
    }

    footerIndicator = () => {
        return (
            <View style={{paddingVertical: 20}}>
                <ActivityIndicator animating size='large' />
            </View>
        )
    }

    headerIndicator = () => {
        return (
            <View style={{paddingVertical: 20}}>
                <Text>Yenile</Text>
            </View>
        )
    }

    onPressItem = (item) => {
        this.props.navigation.navigate("Detail", {
            item: item
        });
    }

    onRefresh  = async () => {

        this.setState({data: []});
        this.setState({page: 1}, () => {
            this.getNews();
        });
        
    }

    render(){

        return (
        <View style={styles.homeContainer}>
            <FlatList
                data={this.state.data}
                renderItem={({item}) => this.renderItem(item)}
                keyExtractor={(item, index) => index}
                onMomentumScrollEnd={this.getMore}
                onEndReachedThreshold={0}
                ListFooterComponent={this.footerIndicator}
                //ListHeaderComponent={this.headerIndicator}
                onRefresh={this.onRefresh}
                refreshing={this.state.isFetching}
                //ListEmptyComponent={<Text>bitti</Text>}
            />
            
        </View>
        )
    }
}

export default Home;