/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {ReactNode} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import CardDetailsScreen from './src/screens/CardDetailsScreen';
import CardListingScreen from './src/screens/CardListingScreen';

/**
 * APP
 * @returns
 */
const App: () => ReactNode = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Listing" component={CardListingScreen} />
        <Stack.Screen name="Details" component={CardDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
