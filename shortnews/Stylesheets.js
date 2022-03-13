import { StyleSheet, Dimensions, PixelRatio, Platform } from 'react-native';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



// based on iphone 11's scale
const scale = windowWidth / 375;

export function normalize(size) {
  const newSize = size * scale 
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  }
}

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5'
  },
  homeContainer: {
    flex: 1
  },
  newsDetailContainer: {
    flex: 1
  },
  header: {
    backgroundColor: '#fff',
    width: windowWidth,
    height: windowHeight*0.09,
    borderBottomWidth: 1,
    alignContent: 'flex-end'
  },
  headerLogo: {
    flex: 1,
    borderWidth: 1,
    paddingTop: normalize(windowHeight*0.04),
    paddingLeft: normalize(windowWidth*0.01),
    fontFamily: 'Charter',
    fontSize: normalize(24),
    flexDirection: 'row'
  },
  hedaerLogoNormal: {
    fontFamily: 'Charter',
    fontSize: normalize(24)
  },
  headerLogoBold: {
    fontFamily: 'Charter-Bold',
    fontSize: normalize(24)
  },
  headerSettings: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: normalize(windowWidth*0.01),
  },
  newsSection: {
    flexDirection:'column', 
    flex: 10,
    flexWrap:'wrap',
    backgroundColor: '#fff',
    fontSize: normalize(14),
    padding: normalize(windowHeight*0.019),
    paddingBottom: normalize(windowHeight*0.007),
    borderBottomWidth: 1,
    borderBottomColor: '#B7B7B7',
    marginTop: normalize(windowHeight*0.0030),
    marginBottom: normalize(windowHeight*0.0030)
  },

  savedNewsSection: {

    flexDirection:'column', 
    flex: 10,
    flexWrap:'wrap',
    backgroundColor: '#B7B7B7',
    fontSize: normalize(14),
    padding: normalize(windowHeight*0.019),
    paddingBottom: normalize(windowHeight*0.007),
    //height: normalize(windowHeight*0.11),
    borderBottomWidth: 1,
    borderBottomColor: '#B7B7B7',
    marginTop: normalize(windowHeight*0.0030),
    marginBottom: normalize(windowHeight*0.0030)
  },

  newsSectionImage: {
    flex: 0.5,
    flexDirection: 'column',
    width: normalize(windowWidth*0.20), 
    height: normalize(windowHeight*0.10),
    marginRight: 2,
    flex: 1,
    resizeMode: 'contain'

  },
  newsText: {
    width: normalize(windowWidth*0.8),
    fontFamily: 'Charter-Roman',
    marginLeft: normalize(windowWidth*0.009),
    fontSize: normalize(14),
    flex: 1, 
    flexDirection: 'column', 
    paddingBottom: 3,
    flexWrap: 'wrap'
  },
  newsInfoContainer: {
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: normalize(10)
  },
  newsInfoText: {
    flex: 3, 
    color: '#303030', 
    fontSize: normalize(11)
  },

  newsDetailHeader: {
    //flex: 0.22, 
    height: normalize(windowHeight*0.08),
    backgroundColor: 'white', 
    margin: normalize(5), 
    borderRadius: normalize(5), 
    padding: normalize(5),
    //flexWrap: 'wrap',
    //borderWidth: 1
  },
  newsDetailContent: {
    backgroundColor: 'white', 
    margin: normalize(5), 
    borderRadius: normalize(5), 
    padding: normalize(5)
  },
  newsDetailTitle: {
    //flex: 0.15,
    fontSize: normalize(22)
  },
  newsDetailUrl: {
    flex: 0.05, 
    alignItems: 'flex-end',
  },
  newsDetailUrlButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    borderRadius: 5, 
    width: normalize(windowWidth*0.21),
    paddingTop: normalize(windowHeight*0.01),
    paddingBottom: normalize(windowHeight*0.01),
    paddingLeft: normalize(windowWidth* 0.015),
    paddingRight: normalize(windowWidth* 0.015),
    marginTop: normalize(windowHeight*0.01),
    marginBottom: normalize(windowHeight*0.01),
    //marginLeft: normalize(windowWidth* 0.015),
    marginRight: normalize(windowWidth* 0.015)
  },

  settingsSelectBox: {
    backgroundColor: 'white', 
    padding: 10, 
    marginBottom: 10
  },
  settingsLightStyle: {
    backgroundColor: 'white'
  },
  settingsDarkStyle: {
    backgroundColor: 'black'
  },
  settingsLightText: {
    color: 'white'
  },
  settingsDarkText: {
    color: 'black'
  }
});