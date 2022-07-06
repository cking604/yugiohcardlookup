import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {useEffect} from 'react';
import {FlatList, Text, TextInput, View} from 'react-native';
import {debounceTime} from 'rxjs';
import getCards from '../../services/getCards';
import useSubject from '../../services/useRxSubject';
import CardData from '../../types/CardData';
import CardRow from '../card-row';
import {StackList} from '../../types/StackList';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const CardListing = () => {
  const [search, setSearch] = useState('');
  const [cards, setCards] = useState<CardData[]>([]);
  const rxSubject = useSubject();
  const navigation = useNavigation<NativeStackNavigationProp<StackList>>();

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

  return (
    <View>
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
          placeholder="search"
        />
      </View>
      {cards?.length ? (
        <FlatList
          data={cards}
          renderItem={({item}: {item: Partial<CardData>}) => (
            <CardRow
              item={item}
              onTouch={(itemId: string) => {
                itemId &&
                  navigation.navigate('Details', {id: itemId.toString()});
              }}
            />
          )}
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
    </View>
  );
};
export default CardListing;
