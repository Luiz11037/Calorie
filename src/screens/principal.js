import React, { useEffect, useState } from "react";
import { StatusBar, SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import principal_style from "./../styles/principal_style";
import { Stopwatch } from "react-native-stopwatch-timer";
import MapView, { Marker, Polyline } from 'react-native-maps';
import { requestForegroundPermissionsAsync, getCurrentPositionAsync, watchPositionAsync, LocationAccuracy } from "expo-location";
import Icon from 'react-native-vector-icons/FontAwesome';

const Principal = ({ navigation }) => {
  const [isStopwatchStart, setIsStopwatchStart] = useState(false);
  const [resetStopwatch, setResetStopwatch] = useState(false);
  const [currentPosition, setLocation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [polylineCoordinates, setPolylineCoordinates] = useState([]);
  const [watchingPosition, setWatchingPosition] = useState(false);

  // Estilo do cronômetro e mapa
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

  // Função para pedir permissão da localização
  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();
    console.log("Permissões concedidas:", granted);

    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      console.log("LOCALIZAÇÃO NOVA:", currentPosition);

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

  // Função para calcular a distância entre duas coordenadas geográficas
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Raio da Terra em quilômetros
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

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
    let isMounted = true; // Flag para garantir que o componente está montado

    const watchLocation = async () => {
      const { status } = await requestForegroundPermissionsAsync();
      if (status === 'granted') {
        if (isMounted && !watchingPosition) {
          setWatchingPosition(true);

          watchPositionAsync(
            {
              accuracy: LocationAccuracy.Highest,
              timeInterval: 1000,
              distanceInterval: 5,
            },
            (response) => {
              console.log("NOVA LOCALIZAÇÃO: ", response);

              setLocation(response);

              if (response && response.coords) {
                const newCoordinates = [
                  ...polylineCoordinates,
                  {
                    latitude: response.coords.latitude,
                    longitude: response.coords.longitude,
                  },
                ];

                // Verifica se o comprimento mudou antes de atualizar o estado
                if (newCoordinates.length !== polylineCoordinates.length) {
                  setPolylineCoordinates(newCoordinates);
                }
              }
            }
          );
        }
      } else {
        requestLocationPermissions();
        console.log("Por favor, permita o acesso à localização");
      }
    };

    watchLocation();

    return () => {
      isMounted = false;
    };
  }, [polylineCoordinates.length, watchingPosition]);


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
              <Polyline
                coordinates={polylineCoordinates}
                strokeColor={"#000"}
                strokeWidth={1}
                lineDashPattern={[1]}
              />

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
            <TouchableOpacity style={principal_style.button} onPress={() => { handleStopwatchStart(); togglePlayPause(); }}>
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
              {polylineCoordinates.length > 1
              ? `${polylineCoordinates.reduce((totalDistance, coords, index, array) => {
                if (index < array.length - 1) 
                  {
                    const nextCoords = array[index + 1];
                    const distance = calculateDistance(coords.latitude, coords.longitude, nextCoords.latitude, nextCoords.longitude);
                    return totalDistance + distance;
                  }
                  return totalDistance;
                    }, 0).toFixed(2)} Km`
                    : '00 Km'}
            </Text>
          </View>
        </View>
      </View>

      <StatusBar style={'auto'} />
    </SafeAreaView>
  );
};

export default Principal;
