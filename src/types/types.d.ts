type SetStateAction<T> = T | ((prevState: T) => T);
/**
 * Represents the return type of the `useState` hook.
 *
 * @template T - The type of the state value.
 */

type useStateReturn<T> = [
  /**
   * Gets the current state value.
   */
  getState: T,
  /**
   * Updates the state value with the provided action.
   *
   * @param action - The action to update the state value.
   */
  (action: SetStateAction<T>) => void,
  /**
   * Subscribes to changes in the state value.
   *
   * @param callback - The callback function to be called when the state value changes.
   */
  subscribe: (callback: (value: T) => void) => void
];

/**
 * Represents a listener function that accepts a state of type T.
 *
 * @template T - The type of the state.
 */
type Listener<T> = (state: T) => void;
