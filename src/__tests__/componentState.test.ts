import ComponentStateManager from "../components/componentState";

describe("ComponentStateManager", () => {
  let componentStateManager: ComponentStateManager<number>;

  beforeEach(() => {
    componentStateManager = new ComponentStateManager(0);
  });

  it("should initialize with the provided initial state", () => {
    expect(componentStateManager.getState()).toBe(0);
  });

  it("should update the state with a new value", () => {
    componentStateManager.setState(42);
    expect(componentStateManager.getState()).toBe(42);
  });

  it("should update the state with a function that derives the new state", () => {
    componentStateManager.setState((prevState) => prevState + 1);
    expect(componentStateManager.getState()).toBe(1);
  });

  it("should notify listeners when the state changes", () => {
    const listener1 = jest.fn();
    const listener2 = jest.fn();

    componentStateManager.subscribe(listener1);
    componentStateManager.subscribe(listener2);

    componentStateManager.setState(10);

    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(1);
  });

  it("should unsubscribe listeners from further state change notifications", () => {
    const listener = jest.fn();

    const unsubscribe = componentStateManager.subscribe(listener);
    componentStateManager.setState(20);

    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    componentStateManager.setState(30);

    expect(listener).toHaveBeenCalledTimes(1);
  });
});
