import {NavigationContainer} from '@react-navigation/native';
import {TransitionPresets, createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {DatabaseProvider} from './src/contexts/DatabaseContext';
import Home from './src/screens/Home';
import WordDetail from './src/screens/WordDetail';
import {Word} from './src/types';

export type RootStackParamList = {
    Home: undefined;
    WordDetail: {word: Word};
};

const Stack = createStackNavigator<RootStackParamList>();

function App(): JSX.Element {
    return (
        <SafeAreaProvider>
            <DatabaseProvider>
                <NavigationContainer>
                    <Stack.Navigator>
                        <Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
                        <Stack.Screen
                            name="WordDetail"
                            component={WordDetail}
                            options={{
                                headerShown: false,
                                ...TransitionPresets.SlideFromRightIOS,
                            }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </DatabaseProvider>
        </SafeAreaProvider>
    );
}

export default App;
