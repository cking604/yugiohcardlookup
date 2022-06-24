import {Observable} from 'rxjs';
import CardData from '../types/CardData';

type CardApiResponse = {
  data: CardData[];
};

const getCards = (searchTerm?: string): Observable<CardApiResponse> => {
  const obs = new Observable<CardApiResponse>(subscriber => {
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

export default getCards;
