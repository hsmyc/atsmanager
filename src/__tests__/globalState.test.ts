import GlobalStateManager from "../components/globalState";

describe("GlobalStateManager", () => {
  let globalStateManager: GlobalStateManager<any>;

  beforeEach(() => {
    // Reset the singleton instance before each test
    GlobalStateManager.resetInstance({ count: 0 });
    globalStateManager = GlobalStateManager.getInstance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return the same instance when calling getInstance multiple times", () => {
    const instance1 = GlobalStateManager.getInstance();
    const instance2 = GlobalStateManager.getInstance();

    expect(instance1).toBe(instance2);
  });

  it("should return the correct initial state", () => {
    const initialState = { count: 0 };
    const globalStateManager = GlobalStateManager.getInstance(initialState);
    const currentState = globalStateManager.getState();

    expect(currentState).toEqual(initialState);
  });

  it("should update the state with a new value", () => {
    const newState = { count: 1 };
    globalStateManager.setState(newState);
    const currentState = globalStateManager.getState();

    expect(currentState).toEqual(newState);
  });

  it("should update the state with a function that returns a new state", () => {
    const incrementCount = (prevState: { count: number }) => ({
      count: prevState.count + 1,
    });
    globalStateManager.setState(incrementCount);
    const currentState = globalStateManager.getState();

    expect(currentState).toEqual({ count: 1 });
  });

  it("should notify subscribers when the state changes", () => {
    const callback = jest.fn();
    globalStateManager.subscribe(callback);
    globalStateManager.setState({ count: 2 });

    expect(callback).toHaveBeenCalledWith({ count: 2 });
  });

  it("should unsubscribe a callback from state change notifications", () => {
    const callback = jest.fn();
    const unsubscribe = globalStateManager.subscribe(callback);
    unsubscribe();
    globalStateManager.setState({ count: 3 });

    expect(callback).not.toHaveBeenCalled();
  });
});
