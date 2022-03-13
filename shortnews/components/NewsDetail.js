import React, { useState } from 'react';
import moment from 'moment';
import {View, ScrollView, Text, Modal, Image, useWindowDimensions, TouchableOpacity, Alert} from 'react-native';
import RenderHtml, { useInternalRenderer } from 'react-native-render-html';
import styles from '../Stylesheets';
import ImageView from 'react-native-image-view';
import * as WebBrowser from 'expo-web-browser';
import storage from '../storage/Storage';


class NewsDetail extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            sources: []
        }
    }

    CustomImageRenderer(
        props
      ) {
        const { Renderer, rendererProps } = useInternalRenderer('img', props);
        const [isModalOpen, setIsModalOpen] = useState(false);
        const onPress = () => setIsModalOpen(true);
        const onModalClose = () => setIsModalOpen(false);
        const uri = rendererProps.source.uri;
        const thumbnailSource = {
          ...rendererProps.source,
          // You could change the uri here, for example to provide a thumbnail.
          uri: uri.replace('1200', '300').replace('800', '200')
        };
        return (
          <View style={{ alignItems: 'center' }}>
            <Renderer {...rendererProps} source={thumbnailSource} onPress={onPress} />
            <Modal visible={isModalOpen} onRequestClose={onModalClose}>
            <ImageView
                images={[
                    {
                        source: {
                            uri: uri,
                        },
                        width: 806,
                        height: 720,
                    },
                ]}
                isVisible={true}
                onClose={() => setIsModalOpen(false)}
                animationType="fade"
            />
            </Modal>
          </View>
        );
      }

    renderPostedAt(){
        return moment(this.props.item.posted_at).fromNow();
    }

    getWidth(){
        let { width } = useWindowDimensions();
        return width;
    }

    componentDidMount(){
        storage.load({key: 'sources', id: 'sources'}).then(ret => {
                this.setState({sources: ret})
        });
    }

    sourceImage(){
        let source = this.state.sources.filter(item => item.id == this.props.item.source);
        
        if(source){
            //return <Text>{this.props.item.source}</Text>
            try{
                return <Image source = {{uri: source[0].logo}} style={{ width: 60, height: 30, resizeMode: 'contain' }} />
            }catch{
                return <Text>{this.props.item.source}</Text>
            }
            
        }else{
            return <Text>{this.props.item.source}</Text>
        }
    }

    openLink = async () => {
        let result = await WebBrowser.openBrowserAsync(this.props.item.origin_url);
      }

    render(){
        
        return (
            <View style={{flex: 1}}>
                <View style={styles.newsDetailHeader}>
                    <Text style={styles.newsDetailTitle} numberOfLines={1}>{this.props.item.title}</Text>
                    <View style={styles.newsInfoContainer}>
                        <Text style={[styles.newsInfoText, 
                            {alignItems: 'flex-start', textAlign: 'left'}]}>{
                            this.renderPostedAt()}
                        </Text>
                        <View style={[styles.newsInfoText,  
                            {alignItems: 'flex-end', textAlign: 'right'}]}>
                                {this.sourceImage()}
                        </View>
                    </View>
                </View>
                
                <ScrollView style={styles.newsDetailContent}>
                    <RenderHtml
                        contentWidth={() => this.getWidth()}
                        source={{html: this.props.item.content}} 
                        renderersProps={{img: {enableExperimentalPercentWidth: true}}}
                        renderers={{
                            img: this.CustomImageRenderer
                          }}
                    />
                    <View style={styles.newsDetailUrl}>
                    <TouchableOpacity style={styles.newsDetailUrlButton} onPress={this.openLink}>
                        <Text>Siteye Git ➔</Text>
                    </TouchableOpacity>
                </View>
                </ScrollView>
                
            </View>
        )
    }
}

export default NewsDetail;