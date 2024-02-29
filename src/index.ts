export default function useState<T>(
  initialState: T
): [
  () => T,
  (newValue: T | ((prevState: T) => T)) => void,
  (callback: () => void) => () => void
] {
  let currentState = initialState;
  const listeners = new Set<() => void>();

  const getState = () => currentState;

  const setState = (newValue: T | ((prevState: T) => T)) => {
    currentState =
      typeof newValue === "function"
        ? (newValue as (prevState: T) => T)(currentState)
        : newValue;
    listeners.forEach((listener) => listener());
  };

  const subscribe = (callback: () => void) => {
    listeners.add(callback);
    return () => {
      listeners.delete(callback);
    };
  };

  return [getState, setState, subscribe];
}
