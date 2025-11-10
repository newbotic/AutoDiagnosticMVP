import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'react-native';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import DiagnosticScreen from './src/screens/DiagnosticScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <PaperProvider>
      <StatusBar 
        backgroundColor="#2196F3" 
        barStyle="light-content" 
      />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#2196F3',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            contentStyle: {
              backgroundColor: '#f5f5f5',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ 
              title: 'AutoDiagnostic MVP',
              headerShown: true,
            }}
          />
          <Stack.Screen 
            name="Diagnostic" 
            component={DiagnosticScreen}
            options={{ 
              title: 'Diagnostic Completu',
              headerShown: true,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
