import React, { useEffect, useState } from "react";
import { StatusBar, SafeAreaView, View, Text, TouchableOpacity, Image } from "react-native";
import principal_style from "./../styles/principal_style";
import { Stopwatch, Timer } from "react-native-stopwatch-timer";
import MapView, { Marker, Polyline } from 'react-native-maps';
import { requestForegroundPermissionsAsync, watchPositionAsync, LocationAccuracy } from "expo-location";
import Icon from 'react-native-vector-icons/FontAwesome';
import * as SQLite from 'expo-sqlite';

export default Principal = ({ navigation }) => {

/* useEffect(() => {
  const db = SQLite.openDatabase('historico_do_usuario');
  db.transaction(
    (tx) => {
      // Use a cláusula DELETE para apagar todos os dados da tabela
      tx.executeSql('DELETE FROM historico;', [], (_, result) => {
        console.log('Dados apagados com sucesso! Resultado: ', result);
        }
      )
    }
  );
}) */
  
// TROCA ÍCONE INÍCIO =============================================================

// Para a troca do ícone

const [isPlaying, setIsPlaying] = useState(false)

// Troca do ícone de play e pause

const togglePlayPause = () => {
  setIsPlaying((prevIsPlaying) => !prevIsPlaying);
};


// MAPA INÍCIO =======================================================================

// Para a localização e tracking
const [distance, setDistance] = useState(-20); // Ao iniciar já soma um valor a distância, setando ela para -20 "resolve" esse defeito
const [currentPosition, setLocation] = useState(null);
const [coordinates, setCoordinates] = useState([]);
const [finalDistance, setFinalDistance] = useState(0);
const [finalTime, setFinalTime] = useState("00:00:00");

// Monitoração da mudança de posição

const watchLocation = async () => {
  try {
    const { status } = await requestForegroundPermissionsAsync();
    if (status === 'granted') {
      await watchPositionAsync(
        {
          accuracy: LocationAccuracy.BestForNavigation,
          distanceInterval: 20,
                              },
        (currentPosition) => {
          setCoordinates((prevCoordinates) => [...prevCoordinates, currentPosition.coords]);
          setDistance((prevDistance) => prevDistance + 20);
            console.log('Numero atual = ', distance)
          setLocation(currentPosition);
          console.log("=================================================================================================================== \n NOVA LOCALIZAÇÃO:\n \n", "Altitude: ", currentPosition.coords.altitude, "\n", "\n", "Longitude: ", currentPosition.coords.longitude, "\n","Margem de erro: ", currentPosition.coords.accuracy.toFixed(0), "\n", "\n", "=================================================================================================================== \n");
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
}, []);

// CRONÔMETRO INÍCIO ==============================================================

// Para o cronômetro

const [Time, setTime] = useState(0);
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

// BANCO DE DADOS ================================================================

const db = SQLite.openDatabase('historico_do_usuario');

useEffect(() => {

  db.transaction(
    tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS historico (id INTEGER PRIMARY KEY AUTOINCREMENT, Distância FLOAT, Tempo TEXT);',
        [],
        (_, result) => {
          console.log('Tabela criada com sucesso! Resultado: ', result);
        },
        (_, error) => {
          console.log('Erro ao criar tabela:', error);
        }
      );
    },
    error => console.log('Erro na transação:', error),
    () => console.log('Transação concluída com sucesso.')
  );
}, []);


// Resetar o cronômetro

const FinishButton = () => {
  // Inserir no banco de dados
  try {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'INSERT INTO historico (distancia, Tempo) VALUES (?, ?);',
          [distance, Time],
          (_, result) => {
            console.log('Dados inseridos com sucesso! Resultado: ', result);
          },
          (_, error) => {
            console.log('Erro ao inserir dados:', error);
          }
        );
      },
      (error) => console.log('Erro na transação:', error),
      () => {
        console.log('Transação concluída com sucesso.');
      }
    );
  } catch (error) {
    console.error('Erro ao salvar dados no banco de dados:', error);
  }

  setFinalTime(Time);
  setFinalDistance(distance)

  console.log('Tempo decorrido:', finalTime, '----------');
  console.log('Distância percorrida:', finalDistance, '----------');

  // Resetar outros valores se não estiver reproduzindo
  if (!isPlaying) {
    setDistance(0);
    setResetStopwatch(true);
    setIsStopwatchStart(false);
    setIsPlaying(false);
    setCoordinates([]);
    setLocation(currentPosition);
    setInfoTabVisible(!infoTabVisible);
  }
};



// PARA RETIRAR A BORDA SUPERIOR COM O NOME DA SCREEN =============================

useEffect(() => {
  navigation.setOptions({
    headerShown: false,
  });
}, [navigation]);


// ABA DE INFORMAÇÕES =============================================================


const Finish_Button = () => {
  return (
    <View style={principal_style.buttonContainer}>
      <TouchableOpacity style={principal_style.testButton} onPress={() => FinishButton()}>
        <Text style={principal_style.info_text}>Finalizar</Text>
      </TouchableOpacity>
    </View>
  );
};

const [infoTabVisible, setInfoTabVisible] = useState(false);
const [HistoricTabVisible, setHistoricTabVisible] = useState(false);

const InfoTab = () => {
  return (
    <View style={principal_style.result_container}>
      <View style ={principal_style.finalinfoview}>
        <Text style ={principal_style.finalinfoview_text}> Distância: {(finalDistance/1000).toFixed(2)}</Text>
        <Text style ={principal_style.finalinfoview_text}> Tempo: {finalTime} </Text>
      </View>
      <View style={principal_style.button_options}>
        <TouchableOpacity style={principal_style.back_button} onPress={() => setInfoTabVisible(!infoTabVisible)}>
          <Text style={principal_style.info_text}>Voltar</Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={principal_style.back_button}
          onPress={() => {setHistoricTabVisible(!HistoricTabVisible); setInfoTabVisible(!infoTabVisible);
          }}
        >
            <Text style={principal_style.info_text}>Historico</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const HistoricTab = () => {
  const [historicoData, setHistoricoData] = useState([]);

  const fetchHistoricoData = async () => {
    try {
      const db = SQLite.openDatabase('historico_do_usuario');
      const result = await new Promise((resolve, reject) => {
        db.transaction(
          tx => {
            tx.executeSql(
              'SELECT * FROM historico;',
              [],
              (_, resultSet) => resolve(resultSet.rows._array),
              (_, error) => reject(error)
            );
          },
          error => reject(error)
        );
      });
      return result;
    } catch (error) {
      console.error('Erro ao obter dados do histórico:', error);
      throw error;
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const fetchAndPrintHistoricoData = async () => {
    try {
      const data = await fetchHistoricoData();
      setHistoricoData(data);
      setIsLoading(false);
      console.log('Dados do histórico:', data);
    } catch (error) {
      console.error('Erro ao obter dados do histórico:', error);
      setIsLoading(false);
    }
  };

  return (
    <View style={principal_style.result_container}>
      <TouchableOpacity
        style={principal_style.back_button}
        onPress={fetchAndPrintHistoricoData}
      >
        <Text>Imprimir Dados do Histórico</Text>
      </TouchableOpacity>

      {/* Exibir os dados no componente */}
      {historicoData.map(item => (
        <Text key={item.id}>{`Distância: ${(item.distancia / 1000).toFixed(2)} km, Tempo: ${item.Tempo}`}</Text>
      ))}

      {/* ... (outros componentes ou lógica) */}
    </View>
  );
};


const Blur = () => {
  return (
    <View style={principal_style.principal_screen_blur}></View>
  );
};


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
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
            >

              {isPlaying && coordinates && coordinates.length >  1 && (
                <Polyline
                  coordinates={coordinates}
                  strokeColor="#000" // cor da linha
                  strokeWidth={10} // largura da linha
                />
              )}

              <Marker
                coordinate={{
                  latitude: currentPosition.coords.latitude,
                  longitude: currentPosition.coords.longitude,
                }}
              >
                <Image
                  source={require('./../images/bike.png')}
                  style={{ width: 60, height: 60, }}
                />
              </Marker>

            </MapView>
          )}
        </View>

        {!isPlaying && <Finish_Button />}        

      </View>
      
      { (infoTabVisible || HistoricTabVisible) && <Blur />}
      {infoTabVisible && <InfoTab />}
      {HistoricTabVisible && <HistoricTab />}
      
      
      

      <View style={principal_style.hud_area}>
        <View style={[principal_style.infos_area, principal_style.info_area_border_right]}>
          <View style={principal_style.info_km_area_black}>
            <Stopwatch
              laps
              start={isStopwatchStart}
              reset={resetStopwatch}
              options={options}
              getTime={(time) => setTime(time)}
            />
          </View>
        </View>

        <View style={principal_style.player_area}>
          <View style={principal_style.circle_player}>
            <TouchableOpacity style={principal_style.button} onPress={() => {handleStopwatchStart(); togglePlayPause(); }}>
              {isPlaying
                ? (<Icon name="pause" size={30} color="#3498db" style={principal_style.icon_pause} />)
                : (<Icon name="play" size={30} color="#3498db" style={principal_style.icon_play} />)
              }
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
              {(distance/1000).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      <StatusBar style={'auto'} />
    </SafeAreaView>
  );
};