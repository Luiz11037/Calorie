import { StyleSheet } from "react-native";

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

    img: {
        flex: 1,
        height: 'auto',
        width: '100%',
    },

    area2: {
        flex: 1,
        justifyContent: 'space-between',
        height: 'auto',
        width: '100%',
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },

    button: {

        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '5%',
        borderBottomWidth:10,
        borderRadius: 10,

        backgroundColor: '#F92323',
    },

    
});

export default style_home;