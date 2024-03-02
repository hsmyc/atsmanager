import ProxyStateManager from "../components/proxyState";

describe("ProxyStateManager", () => {
  // Adjusted to use an object as initial state to match class design
  let proxyStateManager: ProxyStateManager<{ count: number }>;

  beforeEach(() => {
    // Initialize with an object state
    proxyStateManager = new ProxyStateManager({ count: 0 });
  });
  it("should throw an error if initialized with a non-object state", () => {
    expect(() => new ProxyStateManager(0)).toThrowError(
      "ProxyStateManager can only manage state of type 'object'."
    );
  });
  it("should initialize with the provided initial state", () => {
    expect(proxyStateManager.getState()).toEqual({ count: 0 });
  });

  it("should update the state with a new value", () => {
    proxyStateManager.setState({ count: 42 });
    expect(proxyStateManager.getState()).toEqual({ count: 42 });
  });

  it("should update the state with a function that derives the new state", () => {
    proxyStateManager.setState((prevState) => ({ count: prevState.count + 1 }));
    expect(proxyStateManager.getState()).toEqual({ count: 1 });
  });

  it("should notify listeners when the state changes", () => {
    const listener1 = jest.fn();
    const listener2 = jest.fn();

    proxyStateManager.subscribe(listener1);
    proxyStateManager.subscribe(listener2);

    proxyStateManager.setState({ count: 10 });

    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener1).toHaveBeenCalledWith({ count: 10 });
    expect(listener2).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledWith({ count: 10 });
  });

  it("should unsubscribe listeners from further state change notifications", () => {
    const listener = jest.fn();

    const unsubscribe = proxyStateManager.subscribe(listener);
    proxyStateManager.setState({ count: 20 });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({ count: 20 });

    unsubscribe();
    proxyStateManager.setState({ count: 30 });

    expect(listener).toHaveBeenCalledTimes(1); // Listener should not be notified after unsubscribe
  });

  it("should batch update state changes and notify listeners once at the end", () => {
    const listener = jest.fn();

    proxyStateManager.subscribe(listener);

    proxyStateManager.beginBatchUpdates();
    proxyStateManager.setState({ count: 40 });
    proxyStateManager.setState({ count: 50 }); // Only this final state should trigger notification
    proxyStateManager.endBatchUpdates();

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({ count: 50 });
  });
});
