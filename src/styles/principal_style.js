// principal_style.js

import { StyleSheet, Dimensions } from "react-native";

const widthDimension = Dimensions.get('window').width;
const borderRadius = widthDimension * 0.15;
const borderWidth = widthDimension * 0.015;

const principal_style = StyleSheet.create({
  principal_screen: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',

  },
  map: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    width: '50%',
    height: '10%',
    position: 'absolute',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  testButton: {
    
    width: '100%',
    height: '100%',
    padding: 10,
    borderTopWidth: 5,
    borderTopColor: 'black',
    borderBottomEndRadius: borderRadius * 2,
    borderBottomStartRadius: borderRadius * 2,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#F92323',
  },

  map_area: {
    flex: 6,
    width: '100%',
    alignItems: 'center',
  },

  hud_area: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    borderTopWidth: borderWidth + 2,
    borderTopLeftRadius: borderRadius / 8,
    borderTopRightRadius: borderRadius / 8,
    borderColor: '#F92323',
    borderStyle: 'dotted',
    backgroundColor: 'white',
  },

  infos_area: {
    flex: 3,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2%',
    backgroundColor: '#F92323',
  },

  info_km_area_black: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: "column",
    backgroundColor: 'black',
    borderRadius: borderRadius,
  },

  info_text: {
    fontSize: borderRadius / 2.9,
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
    backgroundColor: 'transparent',
  },

  icon_play: {
    color: 'white',
    fontSize: borderRadius / 1.3,
    left: '4%',
  },
  icon_pause: {
    color: 'white',
    fontSize: borderRadius / 1.3,
  },
});

export default principal_style;
