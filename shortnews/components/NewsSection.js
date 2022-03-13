import React from 'react';
import moment from 'moment';
import {View, Text, Image} from 'react-native';
import styles from '../Stylesheets';
import DoubleClick from 'react-native-double-tap';
import storage from '../storage/Storage';

class NewsSection extends React.Component{
    constructor(props){
        super(props)
        moment.locale('tr');

        this.state = {
            viewStyle: styles.newsSection,
            isSaved: false,
            sources: []
        }
    }
    doubleTap = () =>{
        this.setState({viewStyle: styles.savedNewsSection});
        if(!this.state.isSaved){
            storage.save({
                key: 'savedNews', // Note: Do not use underscore("_") in key!
                id: this.props.item.slug, // Note: Do not use underscore("_") in id!
                data: this.props.item
              });
        }else{
            this.setState({viewStyle: styles.newsSection, isSaved: false});
            storage.remove({key: 'savedNews', id: this.props.item.slug});
        }
        
    }

    componentDidMount(){
        storage.load({key: 'sources', id: 'sources'}).then(ret => {
            this.setState({sources: ret});
        });

        //alert("selam: "+this.state.sources);

        storage.load({key: 'savedNews', id: this.props.item.slug}).then(ret => {
            this.setState({viewStyle: styles.savedNewsSection, isSaved: true});
        }).catch(e => {});
    }

    renderPostedAt(){
        return moment(this.props.item.posted_at).fromNow();
    }
    
    sourceImage(){
        let source = this.state.sources.filter(item => item.id == this.props.item.source);
    
        if(source){
            //return <Text>{this.props.item.source}</Text>
            try{
                return <Image source = {{uri: source[0].logo}} style={{ width: 60, height: 30, resizeMode: 'contain' }} />
            }catch{
                return <Text>{this.props.item.source} 1</Text>
            }
            
        }else{
            return <Text>{this.props.item.source}</Text>
        }
    }

    render(){
        
        return (
            <View style={this.state.viewStyle} onPress={this.handleDoubleTap}>
                <DoubleClick singleTap={this.props.onPress} doubleTap={this.doubleTap}>
                    <Text style={styles.newsText}>{this.props.item.title}</Text>

                    <View style={styles.newsInfoContainer}>
                        <Text 
                        style={[styles.newsInfoText, 
                        {alignItems: 'flex-start', textAlign: 'left'}]}>
                            {this.renderPostedAt()}
                        </Text>
                        <View style={[styles.newsInfoText, 
                            {alignItems: 'flex-end', textAlign: 'right'}]}>
                                {this.sourceImage()}
                        </View>
                    </View>
                </DoubleClick>
            </View>
        );
    };
};

export default NewsSection;