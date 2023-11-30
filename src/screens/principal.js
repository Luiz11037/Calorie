import React, { useEffect, useState } from "react";
import { StatusBar, SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import principal_style from "./../styles/principal_style";
import { Stopwatch } from "react-native-stopwatch-timer";
import MapView, {Marker} from 'react-native-maps';
import { requestForegroundPermissionsAsync, getCurrentPositionAsync, watchPositionAsync, LocationAccuracy} from "expo-location";
import Icon from 'react-native-vector-icons/FontAwesome';

const Principal = ({navigation}) => {
  const [isStopwatchStart, setIsStopwatchStart] = useState(false);
  const [resetStopwatch, setResetStopwatch] = useState(false);
  const [currentPosition, setLocation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Estilo do cronômetro e mapa
  const options = {
    container: {
      backgroundColor: 'trasparent',
      padding: 5,
      borderRadius: 5,
    },
    text: {
      fontSize: 25,
      color: '#FFF',
      marginLeft: 7,
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    map: {
      width: '100%',
      height: '100%',
    },
  });

  // Função para ativar e desativar o cronômetro
  const handleStopwatchStart = () => {
    if (isStopwatchStart) {
      setIsStopwatchStart(false);
    } else {
      setIsStopwatchStart(true);
      setResetStopwatch(false);
    }
  };

  //Função para pedir permissão da localização
  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();
    console.log("Permissões concedidas:", granted);

    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      console.log("LOCALIZAÇÃO:", currentPosition);
      
      if (currentPosition && currentPosition.coords) {
        const latitude = currentPosition.coords.latitude;
        const longitude = currentPosition.coords.longitude;
        setLocation(currentPosition);
        console.log("Localização atual:", currentPosition);
      } else {
        console.error("Erro: Objeto de localização inválido");
      }
    }
  }

  // Troca imagem do player

  const togglePlayPause = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  
  useEffect(() => {
    const watchLocation = async () => {
      const { status } = await requestForegroundPermissionsAsync();
      if (status === 'granted') {
        watchPositionAsync({
          accuracy: LocationAccuracy.Highest,
          timeInterval: 1000,
          distanceInterval: 1,
        }, (response) => {
          console.log("NOVA LOCALIZAÇÃO: ", response);
          setLocation(response)
        });
      } else {
        requestLocationPermissions();
        console.log("Por favor, permita o acesso a localização");
      }
    };
  
  watchLocation()
  }, []);

  return (
    <SafeAreaView style={principal_style.principal_screen}>
      <View style={principal_style.map_area}>
        <View style={styles.container}>
        {currentPosition && currentPosition.coords && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: currentPosition.coords.latitude,
                longitude: currentPosition.coords.longitude,
                latitudeDelta: 0.0009,
                longitudeDelta: 0.0009,
              }}
              >

                <Marker
                coordinate={{
                  latitude: currentPosition.coords.latitude,
                  longitude: currentPosition.coords.longitude,
                }}
                />

              </MapView>
          )}
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
            <TouchableOpacity style={principal_style.button} onPress={() => { handleStopwatchStart(); togglePlayPause();}}>
            {isPlaying
            // A interrogação( ? ) significa que se a condição à esquerta(antes) dela for verdadeira, acontecerá o que está a sua direita(depois). Os dois pontos( : ) é o resultado para caso a condição retorne falso.
            ? (<Icon name="pause" size={30} color="#3498db" style={principal_style.icon_pause} />) 
            : (<Icon name="play" size={30} color="#3498db" style={principal_style.icon_play}/>)}
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
          
            <Text style={principal_style.info_text}>00Km</Text>
          </View>
        </View>
      </View>

      <StatusBar style={'auto'} />
    </SafeAreaView>
  );
};

export default Principal;