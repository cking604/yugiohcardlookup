import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {StatusBar, View} from 'react-native';
import CardDetails from '../components/card-details';
import getBackgroundStyle from '../services/getBackgroundStyle';
import {StackList} from '../types/StackList';

/**
 * DETAILS SCREEN
 * @returns
 */
type CardDetailsScreenProp = NativeStackScreenProps<StackList, 'Details'>;
const CardDetailsScreen = ({route, navigation}: CardDetailsScreenProp) => {
  const {id} = route.params;
  const style = getBackgroundStyle();

  return (
    <View style={style.container}>
      <StatusBar barStyle={style.container.bar} />
      <CardDetails cardId={id} />
    </View>
  );
};

export default CardDetailsScreen;
