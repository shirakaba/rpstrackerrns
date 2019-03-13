/*
   import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { State, INITIAL_STATE } from './app-state';

class Store {

    private subj = new BehaviorSubject<State>(INITIAL_STATE);

    public select<K extends keyof State>(name: K): Observable<State[K]> {
        return this.subj.pluck<State, State[K]>(name).distinctUntilChanged<State[K]>();
    }

    get value() {
        return this.subj.value;
    }

    public set<K extends keyof State>(name: K, state: State[K]) {
        this.subj.next({
            ...this.value, [name]: state
        });
    }
}


export const appStore = new Store();
*/
