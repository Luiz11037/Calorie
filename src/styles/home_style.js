import { StyleSheet, Dimensions } from "react-native";

const widthDimension = Dimensions.get('window').width;
const borderRadius = widthDimension * 0.15;
const borderWidth = widthDimension * 0.015;

const style_home = StyleSheet.create({
    
    home_screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },

    area1: {
        flex: 1,
        height: 'auto',
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: 'green',

    },

    bike_area: {
        flex: 1,
        height: '100%',
        width: '100%',
        backgroundColor: 'green',
    },

    area2: {
        flex: 1,
        justifyContent: 'space-between',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: '#fff',
    },

    img: {
        resizeMode: 'contain',
        flex: 1,
        width: '100%',
    },


    button: {
        flex: 1,
        height: '10%',
        width: '80%',
        bottom: '12%',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: borderWidth,
        borderRadius: borderRadius,

        backgroundColor: '#F92323',
    },

    info_text: {
        fontSize: borderRadius / 3.6,
        fontWeight: '400',
        color: '#FFF',
      },

    
});

export default style_home;