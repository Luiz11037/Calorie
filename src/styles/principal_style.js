import { StyleSheet, Dimensions } from "react-native";

//Adquirindo a largura e altura da tela, para criarmos bordas responsivas
const widthDimension = Dimensions.get('window').width;
const heitghDimension = Dimensions.get('window').height;

//Criando a constante(variável) borderRadius para utilizá-la como valor nas bordas.
const borderRadius = widthDimension * 0.15;
//Criando a constante(variável) borderRadius para utilizá-la como valor nas bordas.
const borderWidth = widthDimension * 0.015


//Criando o estilo da screen "principal"
const principal_style = StyleSheet.create({

    
    principal_screen: {
        flex: 1,
        justifyContent: 'center',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    map_area: {                 //Irmão de hud
        flex: 6,
        width: '100%',
        alignItems: 'center',
    },

//////////////// Área do HUD ////////////////


    hud_area: {
        flex: 1,            //Irmão de map_area
        width: 'auto',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row',

        borderTopWidth: borderWidth + 2,
        borderTopLeftRadius: borderRadius/8,
        borderTopRightRadius: borderRadius/8,

        borderColor: '#F92323' ,
        borderStyle: 'dotted',

        backgroundColor: 'white',
    },

//////////////// Área das info (00:00 & 00Km) ////////////////

    infos_area: {
        flex: 3,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2%',

        backgroundColor: '#F92323',
        //F92323
    },


    info_km_area_black: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "column",
        
        backgroundColor: 'black',

        borderRadius: borderRadius,

        //borderBottomWidth: borderWidth,
        //borderBottomColor: 'white',
    },

    info_text:{     //Gambiarra alert!!!
        fontSize: borderRadius/2.9,
        fontWeight: '300',
        color: '#FFF',
    },

    info_area_border_right: {
        borderTopRightRadius: borderRadius,
        borderBottomRightRadius: borderRadius,

    },

    info_area_border_left: {
        borderTopLeftRadius: borderRadius,
        borderBottomLeftRadius: borderRadius,

    },

//////////////// Área do player ////////////////

    player_area: {
        flex: 3,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',

        marginHorizontal: '2.5%',

    },

    circle_player: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '6%',

        borderBottomWidth: borderWidth,
        borderRadius: borderRadius,

        backgroundColor: '#F92323',
    },

    button: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent'
    },

    icon_play: {
        color: 'white',
        fontSize: borderRadius/1.3,
        left: '4%',
    },
    icon_pause: {
        color: 'white',
        fontSize: borderRadius/1.3,
    },
});

export default principal_style;