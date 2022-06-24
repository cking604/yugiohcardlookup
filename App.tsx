/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FlatList,
  Image,
  NativeSyntheticEvent,
  ProgressViewIOSBase,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextBase,
  TextInput,
  TextInputChangeEventData,
  TouchableHighlight,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {
  Observable,
  BehaviorSubject,
  debounce,
  debounceTime,
  fromEvent,
  interval,
  scan,
  last,
} from 'rxjs';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import data from './cardres.json';

interface CardData {
  id: number;
  name: string;
  type: string;
  desc: string;
  race: string;
  attribute: string;
  atk?: number;
  def?: number;
  level?: number;
  linkval?: number;
  card_images?: {image_url: string; image_url_small: string}[];
  card_sets?: {set_name: string}[];
  // [etc: string]:any;
}
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

// manual debounce
// const useDebounce = (value: string, delay: number) => {
//   const [latestValue, setLatestValue] = useState(value);
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setLatestValue(value);
//     }, delay);

//     return () => {
//       clearTimeout(handler);
//     };
//   }, [value, delay]);

//   return latestValue;
// };

const useSubject = () => {
  const [subj] = useState(new BehaviorSubject(''));
  return subj;
};

const getCardDetails = (id: string) => {
  const obs = new Observable(subscriber => {
    fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?&id=${id}`)
      .then(res => {
        console.log('response received');
        return res.json();
      })
      .then(data => {
        console.log('json converted');
        subscriber.next(data);
        subscriber.complete();
      });
  });
  return obs;
};

const getCards = (searchTerm?: string) => {
  const obs = new Observable<ApiResponse>(subscriber => {
    fetch(
      `https://db.ygoprodeck.com/api/v7/cardinfo.php?&fname=${
        searchTerm ?? ''
      }`,
    )
      .then(res => {
        console.log('response received');
        return res.json();
      })
      .then(data => {
        console.log('json converted');
        subscriber.next(data);
        subscriber.complete();
      })
      .catch(err => {
        console.log('fetch err');
        console.log(err);
        subscriber.error('sending err');
      });
  });
  return obs;
};

type ApiResponse = {
  data: CardData[];
};

/**
 *  LISTING SCREEN
 * @returns
 */
type CardListingScreenProp = NativeStackScreenProps<StackList, 'Listing'>;
const CardListingScreen = ({navigation}: CardListingScreenProp) => {
  const [search, setSearch] = useState('');
  const [cards, setCards] = useState<CardData[]>([]);
  // const searchDebounced = useDebounce(search, 1000);
  const rxSubject = useSubject();

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    const unsub = rxSubject.pipe(debounceTime(1000)).subscribe(searchTerm => {
      console.log('new search term');
      console.log(searchTerm);
      setSearch(searchTerm);
      // const searchRes = getCards(searchTerm);
    });
    return () => {
      unsub.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const cardsObs = getCards(search);
    const subscriber = cardsObs.subscribe({
      next(data) {
        console.log('obs received');
        console.log(data);
        setCards(data.data);
      },
      error(err) {
        console.log('error' + err);
      },
      complete() {
        console.log('done');
      },
    });
    return () => {
      subscriber.unsubscribe();
    };
  }, [search]);

  useEffect(() => {
    console.log('cards:');
    console.log(cards);
  }, [cards]);

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

/**
 * DETAILS SCREEN
 * @returns
 */
type CardDetailsScreenProp = NativeStackScreenProps<StackList, 'Details'>;
const CardDetailsScreen = ({route, navigation}: CardDetailsScreenProp) => {
  const [cardData, setCardData] = useState<CardData>();
  const {id} = route.params;
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    const infoObs = getCardDetails(id);
    infoObs.subscribe({
      next(data) {
        console.log(data);
        setCardData((data as any).data[0]);
      },
      error(err) {
        console.log('error' + err);
      },
      complete() {
        console.log('done');
      },
    });
  }, []);

  if (!cardData) {
    return <Text>Loading</Text>;
  }

  let bgColour;
  if (cardData.type === 'Spell Card') {
    bgColour = '#4AB5A6';
  } else if (cardData.type === 'Trap Card') {
    bgColour = '#BC5C8F';
  } else {
    bgColour = '#C1885E';
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {cardData ? (
        <ScrollView style={{padding: 8, backgroundColor: bgColour}}>
          <View style={{display: 'flex', flexDirection: 'column'}}>
            <Text
              style={{
                flex: 1,
                alignSelf: 'center',
                flexDirection: 'column',
                fontSize: 24,
                marginVertical: 8,
                fontWeight: '600',
              }}>
              {cardData.name}
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                flex: 1,
              }}>
              {cardData.level && (
                <Text style={{fontSize: 16, fontWeight: '600'}}>
                  Level {cardData.level}
                </Text>
              )}
              {cardData.linkval && (
                <Text style={{fontSize: 16, fontWeight: '600'}}>
                  Link-{cardData.linkval}
                </Text>
              )}
              {!cardData.level && !cardData.linkval && <View />}
              {cardData.attribute && (
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                  }}>
                  {cardData.attribute}
                </Text>
              )}
              {(cardData.type === 'Trap Card' ||
                cardData.type === 'Spell Card') && (
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                  }}>
                  {cardData.race} / {cardData.type}
                </Text>
              )}
            </View>
            {cardData?.card_images?.length && (
              <Image
                style={{
                  flex: 1,
                  alignSelf: 'center',
                  width: '80%',
                  marginVertical: 16,
                  height: 400,
                }}
                resizeMode={'contain'}
                source={{uri: cardData.card_images[0].image_url}}></Image>
            )}
            {!(
              cardData.type === 'Trap Card' || cardData.type === 'Spell Card'
            ) && (
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  paddingBottom: 8,
                }}>
                {cardData.race} / {cardData.type}
              </Text>
            )}
            <Text
              style={{
                flex: 1,
                flexDirection: 'row',
                borderWidth: 1,
                padding: 8,
              }}>
              {cardData.desc}
            </Text>
            {cardData.hasOwnProperty('atk') && (
              <Text
                style={{
                  paddingTop: 16,
                  flex: 1,
                  alignSelf: 'flex-end',
                  fontSize: 16,
                  fontWeight: '600',
                }}>
                {cardData.hasOwnProperty('atk') && `ATK ${cardData.atk}`}
                {cardData.hasOwnProperty('atk') &&
                  cardData.hasOwnProperty('def') &&
                  ' / '}
                {cardData.hasOwnProperty('def') && `DEF ${cardData.def}`}
              </Text>
            )}
            {cardData?.card_sets && (
              <View>
                <Text style={{fontSize: 16, paddingTop: 16, fontWeight: '600'}}>
                  Sets
                </Text>
                {cardData.card_sets.map(set => (
                  <Text style={{paddingLeft: 8}}>- {set.set_name}</Text>
                ))}
              </View>
            )}
          </View>
          <View style={{height: 100}} />
        </ScrollView>
      ) : (
        <Text>loading</Text>
      )}
    </SafeAreaView>
  );
};

/**
 * APP
 * @returns
 */

type StackList = {
  Listing: undefined;
  Details: {id: string};
};
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
