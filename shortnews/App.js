import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {View, StatusBar} from 'react-native';
import styles from './Stylesheets';
import Home from './components/Home';
import Header from './components/Header';
import NewsDetail from './components/NewsDetail';
import Search from './components/Search';
import Settings from './components/Settings';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import Saved from './components/Saved';
import storage from './storage/Storage';
import * as cSettings from './CoreSettings';
import * as Notifications from "expo-notifications";
import * as Device from 'expo-device';


function HomeScreen({navigation}) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Home navigation={navigation}/>
    </View>
  );
}

function DetailScreen({route, navigation}) {
  return (
    <View style={styles.container}>
      <NewsDetail navigation={navigation} route={route} item={route.params.item} />
    </View>
  )
}

function SearchScreen({route, navigation}) {
  return (
    <View style={styles.container}>
      <Search navigation={navigation} />
    </View>
  )
}


function SavedScreen({route, navigation}) {
  return (
    <View style={styles.container}>
      <Saved navigation={navigation} />
    </View>
  )

}

function SettingsScreen({route, navigation}) {
  return (
    <View style={styles.container}>
        <Settings navigation={navigation} />
    </View>
  )
}

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStackScreen(){
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  )
}

requestPermissionsAsync = async () => {
  return await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
      allowAnnouncements: true,
    },
  });
}

export async function requestPermissionsAsync() {
  const result = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
      allowAnnouncements: true,
    },
  });

  return result;
}

function App() {

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  const [data, setdata] = useState("");
  const [pushToken, setPushToken] = useState("");
  useEffect(() => {
    const alertForPermission = () => {
      Notifications.getPermissionsAsync()
        .then((statusobj) => {
          if (statusobj.status !== "granted") {
            requestPermissionsAsync();
          }

          return statusobj;
        })
        .then((statusObj) => {
          if (statusObj.status != "granted") {
            throw new Error("Permission not granted");
          }
        })
        .then(() => {
          console.log("Getting Token");
          return Notifications.getExpoPushTokenAsync();
        })
        .then((response) => {
          let token = response.data;
          setPushToken(token);
          console.log(token);
        })
        .catch((err) => {
          console.log(err);
          return null;
        });
    };
    alertForPermission();
  }, []);

  // ikinci

  useEffect(() => {
    const backgroundsubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        let data = response.notification.request.content.data.MyData;
        setdata(data);
      });

    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log(notification);
      }
    );

    return () => {
      subscription.remove();
      backgroundsubscription.remove();
    };
  }, []);
  

  useEffect(() => {
    let settingsLoaded = false;
    
    let request = axios.create({
      baseURL: cSettings.BASE_URL
    })

      request.get(cSettings.SETTINGS_ENDPOINT).then((resp) => {
        storage.save({
            key: 'sources',
            id: 'sources',
            data: resp.data.sources,
            expires: 24 * 60 * 60 * 1000
        })
    
        storage.save({
            key: 'categories',
            id: 'categories',
            data: resp.data.categories,
            expires: 24 * 60 * 60 * 1000
        })
        settingsLoaded = true;
    })
    if(pushToken){
      console.log("pushtoken var");
      request.post(cSettings.REGISTER_DEVICE_ENDPOINT, {
        push_token: pushToken,
        device_brand: Device.brand,
        manufacturer: Device.manufacturer,
        model_name: Device.modelName,
        model_id: Device.modelId,
        os_name: Device.osName,
        os_version: Device.osVersion
      }).then((resp) => {
        console.log(resp.data);
      }).catch((err) => {
        console.log(err);
      });
    }else{
      console.log("pushtoken yok");
    }

    return settingsLoaded;
  }, [pushToken]);

  let [fontsLoaded] = useFonts({
    'Charter-Bold': require('./assets/fonts/Charter-Bold.ttf'),
    'Charter-Roman': require('./assets/fonts/Charter-Roman.ttf'),
    'Charter': require('./assets/fonts/Charter-Roman.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading 
      //startAsync={() => fetchSettings()}
      //onFinish={() => setIsLoading(true)}
      //onError={console.warn}
    />;
  }
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route, navigation}) => ({
          headerShown: true,
          tabBarActiveTintColor: '#1A1C1A',
          tabBarShowLabel: false,
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            if(route.name =='Home' || route.name == 'HomeStack'){
              iconName = focused ? 'ios-home' : 'ios-home-outline';
            }else if(route.name=='Search'){
              iconName = focused ? 'ios-search' : 'ios-search-outline';
            }else if (route.name == 'Saved'){
              iconName = focused ? 'ios-bookmark' : 'ios-bookmark-outline';
            }
            return <Ionicons name={iconName} size={size} color={'#1A1C1A'} />;
          },
          header: () => <Header routeName={route.name} navigation={navigation} />
          
        })}
      >
      <Tab.Screen name="HomeStack" component={HomeStackScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Saved" component={SavedScreen} />
    </Tab.Navigator>
    </NavigationContainer>
  )
}


export default App;
