import {Observable} from 'rxjs';
import {CardApiResponse} from '../types/CardApiResponse';

const getCardById = (id: string): Observable<CardApiResponse> => {
  const obs = new Observable<CardApiResponse>(subscriber => {
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

export default getCardById;
