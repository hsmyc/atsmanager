import useState from "../index";

test("Test initial state", () => {
  const [getState] = useState(0);
  expect(getState()).toBe(0);
});
// Test case 2: Test updating state with a new value
test("Test updating state with a new value", () => {
  const [getState, setState] = useState(0);
  setState(10);
  expect(getState()).toBe(10);
});

// Test case 3: Test updating state with a function
test("Test updating state with a function", () => {
  const [getState, setState] = useState(0);
  setState((prevState) => prevState + 1);
  expect(getState()).toBe(1);
});

// Test case 4: Test subscribing to state changes
test("Test subscribing to state changes", () => {
  const [state, setState, subscribe] = useState(0);
  let callbackCount = 0;
  const unsubscribe = subscribe(() => {
    callbackCount++;
  });
  setState(10);
  setState(20);
  expect(callbackCount).toBe(2);
  unsubscribe();
  setState(30);
  expect(callbackCount).toBe(2); // Should not increase after unsubscribing
});
