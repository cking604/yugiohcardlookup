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
import {SafeAreaView} from 'react-native-safe-area-context';
import {debounceTime} from 'rxjs';
import getCards from '../services/getCards';
import useSubject from '../services/useRxSubject';
import CardData from '../types/CardData';
import {StackList} from '../types/StackList';

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});
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
    const unsub = rxSubject.pipe(debounceTime(1000)).subscribe(searchTerm => {
      setSearch(searchTerm);
    });
    return () => {
      unsub.unsubscribe();
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

  const searchInput = () => {
    return (
      <TextInput
        style={{borderWidth: 1, flex: 1, marginLeft: 8, paddingLeft: 8}}
        onChangeText={text => {
          rxSubject.next(text);
          // setSearch(text);
        }}
        placeholder="search"></TextInput>
    );
  };

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
        <Text>
          {item.hasOwnProperty('atk') && `ATK ${item.atk}`}
          {item.hasOwnProperty('atk') && item.hasOwnProperty('def') && ' / '}
          {item.hasOwnProperty('def') && `DEF ${item.def}`}
        </Text>,
      );
    }

    return (
      <TouchableOpacity
        key={`card-${item.id}`}
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
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={{flexDirection: 'row', padding: 8, borderBottomWidth: 1}}>
        <View style={{width: 50, height: 50, backgroundColor: 'black'}} />
        {searchInput()}
      </View>
      {cards?.length ? (
        <FlatList
          data={cards}
          renderItem={renderCardRow}
          keyExtractor={item => {
            return item.id.toString();
          }}
        />
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
    </SafeAreaView>
  );
};

export default CardListingScreen;
