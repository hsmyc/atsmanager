/**
 * A utility type for defining actions that can set the state in a `useState` hook.
 * This can either be a direct value of type `T`, or a function that provides the
 * previous state of type `T` and returns a new state of type `T`.
 *
 * @template T - The type of the state value the action can set.
 */
type SetStateAction<T> = T | ((prevState: T) => T);

/**
 * Represents the return type of the `useState` hook, providing tools for state management
 * within a functional component.
 *
 * @template T - The type of the state value managed by this hook.
 * @returns A tuple containing the current state, a function to update the state, and
 *          a function to subscribe to state changes.
 */
type useStateReturn<T> = [
  /**
   * The current state value.
   */
  getState: T,

  /**
   * A function to update the state. It accepts an action which can either be a new state
   * value of type `T`, or a function that takes the previous state and returns a new state.
   *
   * @param action - The action to update the state, either a new state value or a function that returns a new state.
   */
  (action: SetStateAction<T>) => void,

  /**
   * A function to subscribe to changes in the state. This allows external consumers to listen
   * for state updates and react accordingly.
   *
   * @param callback - A function that is called whenever the state changes. Receives the new state value as its parameter.
   */
  subscribe: (callback: (value: T) => void) => void
];

/**
 * Defines a listener function type that is intended to react to changes in the state.
 * This is used in the context of subscribing to state updates within `ComponentState`.
 */
type Listener = () => void;

/**
 * Represents a listener function that accepts a value of type T.
 *
 * @template T - The type of the value being passed to the listener.
 */
type ListenerG<T> = (value: T) => void;

/**
 * Describes the shape of a state object within a state machine. Each state is
 * identified by a unique name and can optionally have `onEnter` and `onExit` callbacks
 * defined, which execute when the state is entered or exited, respectively.
 */
type machineState = {
  /**
   * The unique name identifying the state.
   */
  name: string;

  /**
   * An optional callback function that is executed when the state machine transitions into this state.
   */
  onEnter?: () => void;

  /**
   * An optional callback function that is executed when the state machine transitions out of this state.
   */
  onExit?: () => void;
};

type StateManagerTypes = "global" | "proxy" | "component" | "stateMachine";
