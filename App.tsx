import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Toaster } from 'sonner-native';
import HomeScreen from "./screens/HomeScreen"
import SalesScreen from "./screens/SalesScreen"
import BillScreen from "./screens/BillScreen"
import InventoryScreen from "./screens/InventoryScreen"
import SalesListScreen from "./screens/SalesListScreen"
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider } from './context/AppContext';

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Dashboard'
        }}
      />
      <Stack.Screen 
        name="Sales" 
        component={SalesScreen}
        options={{
          title: 'New Sale'
        }}
      />
      <Stack.Screen 
        name="SalesList" 
        component={SalesListScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="Bill" 
        component={BillScreen}
        options={{
          title: 'Generate Bill'
        }}
      />
      <Stack.Screen 
        name="Inventory" 
        component={InventoryScreen}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <AppProvider>
          <Toaster />
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
