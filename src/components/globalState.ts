import { ListenerG, SetStateAction } from "../index";

/**
 * The `GlobalStateManager` class provides a structured way to manage global state across your application
 * in an object-oriented manner. It encapsulates global state management logic, allowing for state initialization, updates,
 * and subscriptions to state changes. This singleton class ensures that the global state is accessible and modifiable
 * from anywhere in the application, maintaining consistency and facilitating communication between different parts of the app.
 *
 * @template T The type of the global state being managed. This allows for state of any type, from simple to complex data structures.
 */
export default class GlobalStateManager<T> {
  private static instance: GlobalStateManager<any>;
  private currentState: T;
  private listeners: Set<ListenerG<T>> = new Set();

  /**
   * The constructor is private to prevent instantiation from outside the class.
   * This ensures the Singleton pattern is followed, with only one instance of the state manager.
   *
   * @param initialState The initial global state of the application of type `T`.
   */
  private constructor(initialState: T) {
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
   * Provides access to the singleton instance of the `GlobalStateManager`. If no instance exists,
   * it creates one with the provided initial state. This method ensures that the same instance is used
   * throughout the application, maintaining a single source of truth for the global state.
   *
   * @param initialState The initial global state of the application of type `T`. Only used during the first call to initialize the state.
   * @returns The singleton instance of the GlobalStateManager.
   */
  public static getInstance<S>(initialState?: S): GlobalStateManager<S> {
    if (!GlobalStateManager.instance) {
      GlobalStateManager.instance = new GlobalStateManager(initialState || {});
    }
    return GlobalStateManager.instance;
  }

  /**
   * Retrieves the current global state managed by the singleton instance. This method allows for accessing the state at any point,
   * providing the latest value of the global state.
   *
   * @returns The current global state of type `T`.
   */
  public getState = (): T => {
    return this.currentState;
  };

  /**
   * Updates the global state managed by the singleton instance. This method accepts either a direct new state value of type `T`
   * or a function that takes the previous state and returns the new state. After updating the state, this method
   * notifies all listeners subscribed to state changes.
   *
   * @param action The new state value or a function that returns the new state based on the previous state.
   */
  public setState = (action: SetStateAction<T>): void => {
    this.currentState = this.isFunction(action)
      ? action(this.currentState)
      : action;
    // Notify all listeners about the state change.
    this.listeners.forEach((listener) => listener(this.currentState));
  };

  /**
   * Subscribes to changes in the global state managed by the singleton instance. This method allows external consumers to be notified of state changes,
   * enabling reactive updates or other side effects across the application. The subscription mechanism is central for implementing observer patterns,
   * where components or services can react to global state updates.
   *
   * @param callback A callback function that is invoked whenever the state changes, receiving the new state as its parameter.
   * @returns A function that, when called, will unsubscribe the provided callback from further state change notifications.
   */
  public subscribe = (callback: ListenerG<T>): (() => void) => {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  };

  /**
   * Resets the singleton instance of the `GlobalStateManager` to its initial state. This method is useful for resetting the global state
   * during testing or when the application needs to clear all global state data and start fresh. It is important to note that this method
   * does not remove the instance of the `GlobalStateManager` but rather resets the state to the initial value provided during the first instantiation.
   *
   * @param initialState The initial global state of the application of type any. If provided, it resets the state to this value; otherwise, it resets to the original initial state.
   */
  public static resetInstance(initialState: any): void {
    GlobalStateManager.instance = new GlobalStateManager(initialState || {});
  }
}
