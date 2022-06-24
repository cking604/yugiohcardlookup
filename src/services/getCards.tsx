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
        return res.json();
      })
      .then(data => {
        subscriber.next(data);
        subscriber.complete();
      })
      .catch(err => {
        subscriber.error(err);
      });
  });
  return obs;
};

export default getCards;
