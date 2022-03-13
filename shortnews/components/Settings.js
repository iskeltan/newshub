import React from 'react';
import {View} from 'react-native';
import styles from '../Stylesheets';
import storage from '../storage/Storage';
import SelectBox from 'react-native-multi-selectbox';
import * as cSettings from '../CoreSettings';

class Settings extends React.Component {
    
    constructor(props){
        super(props)

        storage.load({key: 'sources', id: 'sources'}).then(ret => {
            this.setState({allSources: ret});
        });

        storage.load({key: 'categories', id: 'categories'}).then(ret => {
            this.setState({allCategories: ret});
        });
        
        this.state = {
            selectedSources: [],
            selectedCategories: [],
            allSources: [],
            allCategories: []
        }
    }

    selectedSources(){
        return this.state.selectedSources;
    }

    selectedCategories(){
        return this.state.selectedCategories;
    }

    componentDidMount(){

        storage.load({key: 'selectedSources', id: 'selectedSources'}).then(ret => {
            this.setState({selectedSources: ret});
        });
    }

    onMultiChangeSources = (item) => {
        if(item){
            let changedSources = this.state.selectedSources.concat([item]);
            this.setState({selectedSources: changedSources});
            storage.save({
                key: 'selectedSources',
                id: 'selectedSources',
                data: changedSources
            })
        }
        
    }

    onMultiChangeCategories = (item) => {
        if(item){
            let changedCategories = this.state.selectedCategories.concat([item]);
            this.setState({selectedCategories: changedCategories});
            storage.save({
                key: 'selectedCategories',
                id: 'selectedCategories',
                data: changedCategories
            })
        }
    }

    onDeleteSources = (item) => {
        if(item){
            let filtered = this.state.selectedSources.filter(data => data.id != item.id);
            this.setState({selectedSources: filtered})
            storage.save({
                key: 'selectedSources',
                id: 'selectedSources',
                data: filtered
            })
        }
    }

    onDeleteCategories = (item) => {
        if(item){
            let filtered = this.state.selectedCategories.filter(data => data.id != item.id);
            this.setState({selectedCategories: filtered});
            storage.save({
                key: 'selectedCategories',
                id: 'selectedCategories',
                data: filtered
            })

        }
    }

    render(){
        return (
            <View>
                <View style={styles.settingsSelectBox}>
                    <SelectBox
                        label={cSettings.SELECT_SOURCE_TEXT}
                        inputPlaceholder={cSettings.SELECT_SOURCE_PLACEHOLDER}
                        options={this.state.allSources}
                        selectedValues={this.selectedSources()}
                        onMultiSelect={(item) => this.onMultiChangeSources(item)}
                        onTapClose={(item) => this.onDeleteSources(item)}
                        containerStyle={styles.settingsLightStyle}
                        //inputFilterContainerStyle={{backgroundColor: 'black'}}
                        //inputFilterStyle={{backgroundColor: 'red'}}
                        optionsLabelStyle={styles.settingsDarkText} 
                        optionContainerStyle={styles.settingsLightStyle}
                        multiOptionContainerStyle={styles.settingsDarkStyle}
                        multiOptionsLabelStyle={styles.settingsLightText}
                        arrowIconColor="black"
                        searchIconColor="black"
                        toggleIconColor="black"
                        isMulti
                    />
                </View>
                <View style={styles.settingsSelectBox}>
                    <SelectBox
                        label={cSettings.SELECT_CATEGORY_TEXT}
                        inputPlaceholder={cSettings.SELECT_CATEGORY_PLACEHOLDER}
                        options={this.state.allCategories}
                        selectedValues={this.selectedCategories()}
                        onMultiSelect={(item) => this.onMultiChangeCategories(item)}
                        onTapClose={(item) => this.onDeleteCategories(item)}
                        containerStyle={styles.settingsLightStyle}
                        //inputFilterContainerStyle={{backgroundColor: 'black'}}
                        //inputFilterStyle={{backgroundColor: 'red'}}
                        optionsLabelStyle={styles.settingsDarkText} 
                        optionContainerStyle={styles.settingsLightStyle}
                        multiOptionContainerStyle={styles.settingsDarkStyle}
                        multiOptionsLabelStyle={styles.settingsLightText}
                        arrowIconColor="black"
                        searchIconColor="black"
                        toggleIconColor="black"
                        isMulti
                    />
                </View>
                
            </View>
        )
    }
}

export default Settings;