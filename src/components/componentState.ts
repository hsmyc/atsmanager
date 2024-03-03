import { Listener, SetStateAction } from "../index";

/**
 * The `ComponentState` class provides a structured way to manage state within components or any other part of your application
 * in an object-oriented manner. It encapsulates the state management logic, allowing for state initialization, updates,
 * and subscriptions to state changes. This class is designed to be flexible and can be used in various contexts where
 * state management is required.
 *
 * @template T The type of the state being managed. This allows for state of any type, from simple to complex data structures.
 */
export default class ComponentStateManager<T> {
  private currentState: T;
  private listeners: Set<Listener> = new Set();

  /**
   * Constructs a new instance of `ComponentState` with an initial state.
   * This is where you set the initial value of the state managed by the instance.
   *
   * @param initialState The initial state of the component of type `T`. This value is used to initialize the state managed by this instance.
   */
  constructor(initialState: T) {
    this.currentState = initialState;
  }

  /**
   * A type guard method to check if a given value is a function. This method is used internally by `setState` to determine
   * if the state update action is a direct value or a function that needs to be executed to derive the new state.
   *
   * @param value The value to check.
   * @returns True if the value is a function, otherwise false.
   */
  private isFunction(value: any): value is (prevState: T) => T {
    return typeof value === "function";
  }

  /**
   * Retrieves the current state managed by the instance. This method allows for accessing the state at any point,
   * providing the latest value of the state.
   *
   * @returns The current state of type `T`.
   */
  getState = (): T => {
    return this.currentState;
  };

  /**
   * Updates the state managed by the instance. This method accepts either a direct new state value of type `T`
   * or a function that takes the previous state and returns the new state. After updating the state, this method
   * notifies all listeners subscribed to state changes.
   *
   * @param action The new state value or a function that returns the new state based on the previous state.
   *               If a function is provided, it is called with the current state, and its return value is used as the new state.
   */
  setState = (action: SetStateAction<T>): void => {
    this.currentState = this.isFunction(action)
      ? action(this.currentState)
      : action;
    this.listeners.forEach((listener) => listener());
  };

  /**
   * Subscribes to changes in the state managed by the instance. This method allows external consumers to be notified of state changes,
   * enabling reactive updates or other side effects. The subscription mechanism is central for implementing observer patterns,
   * where components or services can react to state updates.
   *
   * @param callback A callback function that is invoked whenever the state changes.
   * @returns A function that, when called, will unsubscribe the provided callback from further state change notifications.
   *          This allows for cleanup and preventing memory leaks in applications.
   */
  subscribe = (callback: Listener): (() => void) => {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  };
}
