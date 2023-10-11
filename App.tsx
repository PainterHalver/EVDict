import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DatabaseProvider } from './src/contexts/DatabaseContext';
import Home from './src/screens/Home';
import WordDetail from './src/screens/WordDetail';

export type RootStackParamList = {
  Home: undefined;
  WordDetail: { word: string };
};

const Stack = createStackNavigator<RootStackParamList>();

function App(): JSX.Element {
  return (
    <SafeAreaProvider>
      <DatabaseProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="WordDetail"
              component={WordDetail}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </DatabaseProvider>
    </SafeAreaProvider>
  );
}

export default App;