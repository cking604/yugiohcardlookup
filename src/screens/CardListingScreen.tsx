import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {StatusBar, View} from 'react-native';
import CardListing from '../components/card-listing';
import getBackgroundStyle from '../services/getBackgroundStyle';
import {StackList} from '../types/StackList';

/**
 * Card Listing Screen
 * @returns
 */
type CardListingScreenProp = NativeStackScreenProps<StackList, 'Listing'>;

const CardListingScreen = (prop: CardListingScreenProp) => {
  const style = getBackgroundStyle();
  return (
    <View style={style.container}>
      <StatusBar barStyle={style.container.bar} />
      <CardListing />
    </View>
  );
};

export default CardListingScreen;
