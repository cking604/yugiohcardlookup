import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import CardData from '../../types/CardData';

type CardRowProps = {
  item: Partial<CardData>;
  onTouch: (itemId: string) => void;
};
const CardRow = ({item, onTouch}: CardRowProps) => {
  let bgColour;
  const stats = [];
  if (item.type === 'Spell Card') {
    bgColour = '#4AB5A6';
    stats.push(<Text key={`race-${item.id}`}>{item.race}</Text>);
  } else if (item.type === 'Trap Card') {
    bgColour = '#BC5C8F';
    stats.push(<Text key={`race-${item.id}`}>{item.race}</Text>);
  } else {
    bgColour = '#C1885E';
    if (item.level) {
      stats.push(<Text key={`lvl-${item.id}`}>Level {item.level}</Text>);
    } else if (item.linkval) {
      stats.push(<Text key={`link-${item.id}`}>Link-{item.linkval}</Text>);
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
        item.id && onTouch(item.id.toString());
        // item.id && navigation.push('Details', {id: item.id.toString()});
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

export default CardRow;
