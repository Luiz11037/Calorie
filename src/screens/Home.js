import React, { useEffect } from "react";
import { SafeAreaView, View, Image, TouchableOpacity, Text} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { requestForegroundPermissionsAsync} from "expo-location";
import style_home from "../styles/home_style";
import { useState } from "react";

const Home = () => {
  const navigator = useNavigation();

  const permission = async () => {
    const { status } = await requestForegroundPermissionsAsync();
    if (status === 'granted')
    {
      navigator.push("principal");
      console.log("OK: ", status);
    }
    else 
    {
      console.log("Erro: ",status);
    }
  };

  useEffect(() => {
    navigator.setOptions({
      headerShown: false,
    });
  }, [navigator]);

  return (
    <SafeAreaView style={style_home.home_screen}>
      <View style={style_home.area1}>
        <View style={style_home.area2}>
        <Image
            style={style_home.img}
            source={require('../images/undraw_bike.png')}
          />
          <TouchableOpacity
            style={style_home.button}
            onPress={permission}
          >
            <Text>Permitir acesso a localização</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;
