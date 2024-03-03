// Import statements for state manager dependencies
import ComponentStateManager from "./components/componentState";
import GlobalStateManager from "./components/globalState";
import StateMachine from "./components/stateMachine";
import ProxyStateManager from "./components/proxyState";

export {
  ComponentStateManager,
  GlobalStateManager,
  StateMachine,
  ProxyStateManager,
};

/**
 * A utility type for defining actions that can set the state in a `useState` hook.
 * This can either be a direct value of type `T`, or a function that provides the
 * previous state of type `T` and returns a new state of type `T`.
 *
 * @template T - The type of the state value the action can set.
 */
export type SetStateAction<T> = T | ((prevState: T) => T);

/**
 * Represents the return type of the `useState` hook, providing tools for state management
 * within a functional component.
 *
 * @template T - The type of the state value managed by this hook.
 * @returns A tuple containing the current state, a function to update the state, and
 *          a function to subscribe to state changes.
 */
export type useStateReturn<T> = [
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
export type Listener = () => void;

/**
 * Represents a listener function that accepts a value of type T.
 *
 * @template T - The type of the value being passed to the listener.
 */
export type ListenerG<T> = (value: T) => void;

/**
 * Describes the shape of a state object within a state machine. Each state is
 * identified by a unique name and can optionally have `onEnter` and `onExit` callbacks
 * defined, which execute when the state is entered or exited, respectively.
 */
export type machineState = {
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

export type StateManagerTypes =
  | "global"
  | "proxy"
  | "component"
  | "stateMachine";

/**
 * The ATSManager class provides a centralized and flexible way to manage different types of state
 * managers within an application. Unlike a singleton-based approach, this class is designed to be
 * instantiated multiple times as needed, allowing for diverse and independent state management strategies
 * across different parts of the application.
 *
 * This class supports adding and retrieving various state managers, such as global, component-specific,
 * proxy-based, and state machine management. By encapsulating the initialization and retrieval logic
 * within this class, it promotes a clean and organized architecture for state management.
 */
export default class ATSManager {
  private stateManagers: Map<StateManagerTypes, any>;

  /**
   * Initializes a new instance of the ATSManager class.
   * {StateManagerTypes} The type of the state manager to retrieve.
   */
  public constructor() {
    this.stateManagers = new Map<StateManagerTypes, any>();
  }

  /**
   * Initializes and adds a StateMachine to the manager with the specified states.
   * @param {machineState[]} states The states to initialize the StateMachine with.
   * @returns {ATSManager} The instance of this ATSManager to allow for method chaining.
   */
  private initializeStateMachine(states: machineState[]): void {
    if (this.stateManagers.has("stateMachine")) {
      throw new Error("StateMachine has already been initialized.");
    }
    if (!states || states.length === 0) {
      throw new Error(
        "StateMachine must be initialized with at least one state."
      );
    }
    this.stateManagers.set("stateMachine", new StateMachine(states));
  }

  /**
   * Initializes and adds a ProxyStateManager to the manager with the specified initial state.
   * @param {T} initialState The initial state for the ProxyStateManager.
   * @returns {ATSManager} The instance of this ATSManager to allow for method chaining.
   */
  private initializeProxyState<T>(initialState: T): void {
    if (this.stateManagers.has("proxy")) {
      throw new Error("ProxyStateManager has already been initialized.");
    }
    if (typeof initialState !== "object" || initialState === null) {
      throw new Error(
        "ProxyStateManager can only manage state of type 'object'."
      );
    }
    this.stateManagers.set("proxy", new ProxyStateManager(initialState));
  }

  /**
   * Initializes and adds a GlobalStateManager to the manager, optionally with an initial state.
   * @param {T} initialState The initial state for the GlobalStateManager, if any.
   * @returns {ATSManager} The instance of this ATSManager to allow for method chaining.
   */
  private initializeGlobalState<T>(initialState?: T): void {
    if (this.stateManagers.has("global")) {
      throw new Error("GlobalStateManager has already been initialized.");
    }
    this.stateManagers.set(
      "global",
      GlobalStateManager.getInstance(initialState)
    );
  }

  /**
   * Initializes and adds a ComponentStateManager to the manager with the specified initial state.
   * @param {T} initialState The initial state for the ComponentStateManager.
   * @returns {ATSManager} The instance of this ATSManager to allow for method chaining.
   */
  private initializeComponentState<T>(initialState?: T): void {
    if (this.stateManagers.has("component")) {
      throw new Error("ComponentStateManager has already been initialized.");
    }
    this.stateManagers.set(
      "component",
      new ComponentStateManager(initialState)
    );
  }

  // Public methods to add various state managers. These methods call the corresponding
  // private initialization methods and return the instance for method chaining.

  public addStateMachine(states: machineState[]): ATSManager {
    this.initializeStateMachine(states);
    return this;
  }

  public addProxyState<T>(initialState: T): ATSManager {
    this.initializeProxyState(initialState);
    return this;
  }

  public addGlobalState<T>(initialState?: T): ATSManager {
    this.initializeGlobalState(initialState);
    return this;
  }

  public addComponentState<T>(initialState?: T): ATSManager {
    this.initializeComponentState(initialState);
    return this;
  }

  /**
   * Retrieves an instance of the specified state manager type.
   * @template T The expected type of the state manager, enhancing type safety.
   * @param {StateManagerTypes} managerType The type of the state manager to retrieve.
   * @returns {T} The instance of the requested state manager cast to the type T.
   * @throws {Error} Throws an error if the specified state manager has not been initialized.
   */
  public getStateManager<T>(managerType: StateManagerTypes): T {
    if (!this.stateManagers.has(managerType)) {
      throw new Error(`State manager of type '${managerType}' does not exist.`);
    }
    return this.stateManagers.get(managerType) as T;
  }
}
