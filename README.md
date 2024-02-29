# ATsManager

ATsManager (Assistant to State Manager) is a lightweight and simple state management library designed for JavaScript applications. It provides an easy-to-use API for managing state with minimal boilerplate, making it ideal for small to medium-sized projects or for those just getting started with state management in their applications.

## Features

- **Simple API**: Offers a straightforward API for state management, making it easy to learn and use.
- **TypeScript Support**: Fully supports TypeScript for type-safe state management.
- **Minimalistic**: Designed to be lightweight with no external dependencies, ensuring fast load times.
- **Customizable**: Easy to integrate and extend within any JavaScript project.

## Installation

You can install ATsManager using npm:

```bash
npm install atsmanager

```

## Usage

Here's a quick example to get you started:

```javascript
import useState from "atsmanager";

const [getState, setState, subscribe] = useState(0);

// Subscribe to state changes
subscribe(() => console.log(`State updated: ${getState()}`));

// Update the state
setState(1); // Console: State updated: 1
setState((currentState) => currentState + 1); // Console: State updated: 2
```

## API

useState(initialState)
initialState: The initial state of your application.
Returns an array of [getState, setState, subscribe] where:
getState: A function to get the current state.
setState: A function to update the state, accepts either a new value or a function for stateful updates.
subscribe: A function to subscribe to state changes, returns a function to unsubscribe.

## Building

To build the project, run the following command:

```bash
npm run build

```

## Testing

To run the test suite, run the following command:

```bash
npm test
```

## License

ATsManager is ISC licensed.

## Author

hsmyc
