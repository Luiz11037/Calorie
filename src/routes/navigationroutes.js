import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";
import Principal from '../screens/principal';

const Stack = createStackNavigator();

export default function Rotateste() 
{ //Adicionar uma função capaz de alterar a tela inicial dependendo se foi obtido ou não o acesso a localização
    return (
      <NavigationContainer>
        <Stack.Navigator>
          
          <Stack.Screen name="home" component={Home} />
          <Stack.Screen name="principal" component={Principal} />
          
        </Stack.Navigator>
      </NavigationContainer>
    );
}