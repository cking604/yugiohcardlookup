import React, {useEffect, useState} from 'react';
import {Image, ScrollView, Text, View} from 'react-native';
import getCardById from '../../services/getCardById';
import {CardApiResponse} from '../../types/CardApiResponse';
import CardData from '../../types/CardData';

type CardDetailsProps = {
  cardId: string;
};
const CardDetails = ({cardId}: CardDetailsProps) => {
  const [cardData, setCardData] = useState<CardData>();

  useEffect(() => {
    const infoObs = getCardById(cardId);
    infoObs.subscribe({
      next(data) {
        setCardData((data as CardApiResponse).data[0]);
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
        {!(cardData.type === 'Trap Card' || cardData.type === 'Spell Card') && (
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
            {cardData.card_sets.map((set, index) => (
              <Text key={'set-' + index} style={{paddingLeft: 8}}>
                - {set.set_name}
              </Text>
            ))}
          </View>
        )}
      </View>
      <View style={{height: 100}} />
    </ScrollView>
  );
};

export default CardDetails;
