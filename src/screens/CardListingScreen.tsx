import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {debounceTime} from 'rxjs';
import getCards from '../services/getCards';
import useSubject from '../services/useRxSubject';
import CardData from '../types/CardData';
import {StackList} from '../types/StackList';

/**
 *  LISTING SCREEN
 * @returns
 */
type CardListingScreenProp = NativeStackScreenProps<StackList, 'Listing'>;
const CardListingScreen = ({navigation}: CardListingScreenProp) => {
  const [search, setSearch] = useState('');
  const [cards, setCards] = useState<CardData[]>([]);
  const rxSubject = useSubject();

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#222' : '#F3F3F3',
  };

  useEffect(() => {
    const subscriber = rxSubject
      .pipe(debounceTime(1000))
      .subscribe(searchTerm => {
        setSearch(searchTerm);
      });
    return () => {
      subscriber.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const cardsObs = getCards(search);
    const subscriber = cardsObs.subscribe({
      next(data) {
        setCards(data.data);
      },
    });
    return () => {
      subscriber.unsubscribe();
    };
  }, [search]);

  const renderCardRow = ({item}: {item: Partial<CardData>}) => {
    let bgColour;
    const stats = [];
    if (item.type === 'Spell Card') {
      bgColour = '#4AB5A6';
      stats.push(<Text>{item.race}</Text>);
    } else if (item.type === 'Trap Card') {
      bgColour = '#BC5C8F';
      stats.push(<Text>{item.race}</Text>);
    } else {
      bgColour = '#C1885E';
      if (item.level) {
        stats.push(<Text>Level {item.level}</Text>);
      } else if (item.linkval) {
        stats.push(<Text>Link-{item.linkval}</Text>);
      }
      stats.push(
        <Text key={`attr-${item.id}`}>
          {item.hasOwnProperty('atk') && `ATK ${item.atk}`}
          {item.hasOwnProperty('atk') && item.hasOwnProperty('def') && ' / '}
          {item.hasOwnProperty('def') && `DEF ${item.def}`}
        </Text>,
      );
    }

    return (
      <TouchableOpacity
        style={{
          flex: 1,
          flexDirection: 'row',
          backgroundColor: bgColour,
          borderBottomWidth: 1,
        }}
        onPress={() => {
          item.id && navigation.push('Details', {id: item.id.toString()});
        }}>
        {item?.card_images?.length && item.card_images[0].image_url_small && (
          <View>
            <Image
              style={{width: 50, height: 50, margin: 8}}
              resizeMode={'contain'}
              source={{
                uri:
                  item.card_images[0].image_url_small ||
                  item.card_images[0].image_url,
              }}
            />
          </View>
        )}
        <View style={{flex: 1, flexDirection: 'column', alignSelf: 'center'}}>
          <Text style={{fontWeight: '600'}}>{item.name}</Text>
          <Text>{item.type}</Text>
        </View>

        <View
          style={{
            display: 'flex',
            alignSelf: 'center',
            alignItems: 'flex-end',
            marginRight: 8,
            marginLeft: 4,
          }}>
          {stats}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={{flexDirection: 'row', padding: 8, borderBottomWidth: 1}}>
        <TextInput
          style={{
            borderWidth: 1,
            flex: 1,
            marginHorizontal: 8,
            padding: 12,
            fontSize: 16,
          }}
          onChangeText={text => {
            rxSubject.next(text);
          }}
          placeholder="search"></TextInput>
      </View>
      {cards?.length ? (
        <FlatList data={cards} renderItem={renderCardRow} />
      ) : (
        <Text
          style={{
            fontSize: 16,
            paddingVertical: 24,
            alignSelf: 'center',
            flexDirection: 'column',
          }}>
          No cards found
        </Text>
      )}
    </View>
  );
};

export default CardListingScreen;
