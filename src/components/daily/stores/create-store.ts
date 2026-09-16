import { useSyncExternalStore } from 'react';

type SetStateInternal<T> = (
  partial: Partial<T> | ((state: T) => Partial<T>),
  replace?: boolean
) => void;

type GetStateInternal<T> = () => T;

export type StoreApi<T> = {
  getState: () => T;
  setState: (nextStateOrUpdater: Partial<T> | ((state: T) => Partial<T>)) => void;
  subscribe: (listener: () => void) => () => void;
};

export type UseBoundStore<T> = {
  (): T;
  <U>(selector: (state: T) => U): U;
  getState: () => T;
  setState: (nextStateOrUpdater: Partial<T> | ((state: T) => Partial<T>)) => void;
  subscribe: (listener: () => void) => () => void;
};

export function createStore<T extends object>(
  initializer: (set: SetStateInternal<T>, get: GetStateInternal<T>) => T
): UseBoundStore<T> {
  let state: T;
  const listeners = new Set<() => void>();

  const getState = () => state;

  const setState: StoreApi<T>['setState'] = (nextStateOrUpdater) => {
    const nextState =
      typeof nextStateOrUpdater === 'function'
        ? (nextStateOrUpdater as (s: T) => Partial<T>)(state)
        : nextStateOrUpdater;

    if (nextState !== state) {
      state = Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener());
    }
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  state = initializer(setState, getState);

  const useStore = ((selector?: (s: T) => any) => {
    const slice = useSyncExternalStore(
      subscribe,
      () => (selector ? selector(state) : state),
      () => (selector ? selector(state) : state)
    );
    return slice;
  }) as UseBoundStore<T>;

  useStore.getState = getState;
  useStore.setState = setState;
  useStore.subscribe = subscribe;

  return useStore;
}
