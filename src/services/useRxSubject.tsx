import {useState} from 'react';
import {BehaviorSubject} from 'rxjs';

const useSubject = () => {
  const [subj] = useState(new BehaviorSubject(''));
  return subj;
};

export default useSubject;
