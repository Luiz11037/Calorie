import React, { useEffect, useState } from "react";
import { StatusBar, SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import principal_style from "./../styles/principal_style";
import { Stopwatch } from "react-native-stopwatch-timer";
import MapView, { Marker, Polyline } from 'react-native-maps';
import { requestForegroundPermissionsAsync, watchPositionAsync, LocationAccuracy, computeDistanceAsync } from "expo-location";
import Icon from 'react-native-vector-icons/FontAwesome';

export default Principal = ({ navigation }) => {

// MAPA INÍCIO =======================================================================

// Para a localização e tracking

const [currentPosition, setLocation] = useState(null);
const [coordinates, setCoordinates] = useState([]);

// Monitoração da mudança de posição

const watchLocation = async () => {
  try {
    const { status } = await requestForegroundPermissionsAsync();
    if (status === 'granted') {
      await watchPositionAsync(
        {
          accuracy: LocationAccuracy.BestForNavigation,
          timeInterval: 500,
          distanceInterval: 5,
        },
        (currentPosition) => {
          setCoordinates((prevCoordinates) => [...prevCoordinates, currentPosition.coords]);
          setLocation(currentPosition);
          console.log("=================================================================================================================== \n NOVA LOCALIZAÇÃO:\n \n", "Altitude: ", currentPosition.coords.altitude, "\n", "\n", "Longitude: ", currentPosition.coords.longitude, "\n", "=================================================================================================================== \n");
        },
        (error) => {
          console.error("Erro ao obter a posição:", error);
        }
      );
    }
  } catch (error) {
    console.error("Erro ao solicitar permissões de localização:", error);
  }
};

// Chamar a função

useEffect(() => {

  watchLocation();

}, [])

// TROCA ÍCONE INÍCIO =============================================================

// Para a troca do ícone

const [isPlaying, setIsPlaying] = useState(false)

// Troca do ícone de play e pause

const togglePlayPause = () => {
  setIsPlaying((prevIsPlaying) => !prevIsPlaying);
};

// CRONÔMETRO INÍCIO ==============================================================

// Para o cronômetro

const [isStopwatchStart, setIsStopwatchStart] = useState(false);
const [resetStopwatch, setResetStopwatch] = useState(false);

// Estilo do Stopwatch

const options = {
  container: {
    backgroundColor: 'transparent',
    padding: 5,
    borderRadius: 5,
  },
  text: {
    fontSize: 25,
    color: '#FFF',
    marginLeft: 7,
  }
};

// Liga e desliga do cronômetro

const handleStopwatchStart = () => {
  if (isStopwatchStart) {
    setIsStopwatchStart(false);
  } else {
    setIsStopwatchStart(true);
    setResetStopwatch(false);
  }
};

// Resetar o cronômetro

const handleStopwatchReset = () => {
  
  if (isPlaying)
  {
    setResetStopwatch(true);
    setIsStopwatchStart(false);
    setIsPlaying(false);
    setCoordinates([])
    setLocation(currentPosition)

  }
}

// PARA RETIRAR A BORDA SUPERIOR COM O NOME DA SCREEN =============================

useEffect(() => {
  navigation.setOptions({
    headerShown: false,
  });
}, [navigation]);

return (
    <SafeAreaView style={principal_style.principal_screen}>
      <View style={principal_style.map_area}>
        <View style={principal_style.container}>
          {currentPosition && currentPosition.coords && (
            <MapView
              style={principal_style.map}
              region={{
                latitude: currentPosition.coords.latitude,
                longitude: currentPosition.coords.longitude,
                latitudeDelta: 0.00009,
                longitudeDelta: 0.00009,
              }}
            >

              {coordinates && coordinates.length > 1 && 
                (
                  <Polyline
                    coordinates={coordinates}
                    strokeColor="#000" // cor da linha
                    strokeWidth={5} // largura da linha
                    
                  />
                )
              }


              <Marker
                coordinate={{
                  latitude: currentPosition.coords.latitude,
                  longitude: currentPosition.coords.longitude,
                }} />
            </MapView>
          )}
        </View>

        <View style={principal_style.buttonContainer}>
          <TouchableOpacity style={principal_style.testButton} onPress={() => {console.log("Test button pressed: ", "\n"); handleStopwatchReset();}}>
            <Text>Test</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={principal_style.hud_area}>
        <View style={[principal_style.infos_area, principal_style.info_area_border_right]}>
          <View style={principal_style.info_km_area_black}>
            <Stopwatch laps start={isStopwatchStart} reset={resetStopwatch} options={options} getTime={(timer) => (timer)} />
          </View>
        </View>

        <View style={principal_style.player_area}>
          <View style={principal_style.circle_player}>
            <TouchableOpacity style={principal_style.button} onPress={() => {handleStopwatchStart(); togglePlayPause(); }}>
              {isPlaying
                ? (<Icon name="pause" size={30} color="#3498db" style={principal_style.icon_pause} />)
                : (<Icon name="play" size={30} color="#3498db" style={principal_style.icon_play} />)}
            </TouchableOpacity>
          </View>
        </View>

        <View style={[principal_style.infos_area, principal_style.info_area_border_left]}>
          <View style={principal_style.info_km_area_black}>
            <Text style={principal_style.info_text}>
              {currentPosition && currentPosition.coords && currentPosition.coords.speed && isStopwatchStart || currentPosition && currentPosition.coords && currentPosition.coords.speed && currentPosition.coords.speed.toFixed(0) >= 1
                ? `${currentPosition.coords.speed.toFixed(0)} Km/h ±${currentPosition.coords.accuracy.toFixed(0)}m`
                : '0 Km/h'}
            </Text>
            <Text style={principal_style.info_text}>

            </Text>
          </View>
        </View>
      </View>

      <StatusBar style={'auto'} />
    </SafeAreaView>
  );
};