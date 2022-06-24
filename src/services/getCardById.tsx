import {Observable} from 'rxjs';
import {CardApiResponse} from '../types/CardApiResponse';

const getCardById = (id: string): Observable<CardApiResponse> => {
  const obs = new Observable<CardApiResponse>(subscriber => {
    fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?&id=${id}`)
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

export default getCardById;
