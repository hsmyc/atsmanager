import StateMachine from "../components/stateMachine";

describe("StateMachine", () => {
  let stateMachine: StateMachine;
  let states: machineState[];

  beforeEach(() => {
    states = [
      { name: "State1", onEnter: jest.fn(), onExit: jest.fn() },
      { name: "State2", onEnter: jest.fn(), onExit: jest.fn() },
      { name: "State3", onEnter: jest.fn(), onExit: jest.fn() },
    ];
    stateMachine = new StateMachine(states);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with the first state and call its onEnter callback", () => {
    expect(stateMachine.getCurrentState()).toBe(states[0]);
    expect(states[0].onEnter).toHaveBeenCalled();
  });

  it("should transition to a new state and call the onExit and onEnter callbacks", () => {
    const newState = states[1];
    stateMachine.transitionTo(newState);

    expect(stateMachine.getCurrentState()).toBe(newState);
    expect(states[0].onExit).toHaveBeenCalled();
    expect(newState.onEnter).toHaveBeenCalled();
  });

  it("should throw an error when transitioning to an invalid state", () => {
    const invalidState = {
      name: "InvalidState",
      onEnter: jest.fn(),
      onExit: jest.fn(),
    };

    expect(() => stateMachine.transitionTo(invalidState)).toThrowError(
      `Invalid state: ${invalidState.name}`
    );
  });
});
