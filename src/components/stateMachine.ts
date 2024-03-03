import { machineState } from "../index";

/**
 * The `StateMachine` class manages transitions between a finite number of states in an
 * object-oriented manner. Each state is represented by a `State` object, which can have optional
 * `onEnter` and `onExit` callbacks to perform actions during state transitions. This class is
 * useful for managing complex stateful logic in a clear and maintainable way, such as in
 * UI components, game development, or any scenario where an entity can be in one of many
 * different states with clear transitions between them.
 */
export default class StateMachine {
  private states: machineState[];
  private currentState: machineState;

  /**
   * Initializes a new instance of the `StateMachine` with a predefined list of states.
   * Automatically transitions to the first state in the list upon initialization, invoking its
   * `onEnter` callback, if defined.
   *
   * @param {machineState} states An array of `machineState` objects representing the possible states of the machine.
   *               Must contain at least one state.
   * @throws Will throw an Error if the `states` array is empty, as the state machine requires
   *         at least one state to function properly.
   */
  constructor(states: machineState[]) {
    if (states.length === 0) {
      throw new Error(
        "StateMachine must be initialized with at least one machine state."
      );
    }
    this.states = states;
    this.currentState = states[0];
    this.currentState.onEnter?.();
  }

  /**
   * Transitions the state machine to a new state. If the transition is valid (i.e., the new state
   * exists in the list of possible states), it will call the `onExit` callback of the current state
   * (if defined), update the current state to the new state, and then call the `onEnter` callback
   * of the new state (if defined).
   *
   * @param newState The `State` object to transition to.
   * @throws Will throw an Error if the `newState` is not in the list of possible states, indicating
   *         an attempt to transition to an undefined or invalid state.
   */
  transitionTo(newState: machineState): void {
    if (this.states.includes(newState)) {
      this.currentState.onExit?.();
      this.currentState = newState;
      this.currentState.onEnter?.();
    } else {
      throw new Error(`Invalid state: ${newState.name}`);
    }
  }

  /**
   * Retrieves the current state of the state machine.
   *
   * @returns The current `State` object.
   */
  getCurrentState(): machineState {
    return this.currentState;
  }
}
