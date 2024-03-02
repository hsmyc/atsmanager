# ATsManager

**ATsManager** (Assistant to State Manager) is a versatile and lightweight library for state management in JavaScript applications. Tailored for developers seeking an efficient and straightforward approach to handle application states, ATsManager excels in simplicity and flexibility, offering a minimalistic yet powerful toolset for projects of any scale.

## Features

- **Ease of Use**: A clean, simple API that is easy to learn and integrate into your projects.
- **TypeScript Ready**: Full TypeScript support for type-safe coding.
- **No Dependencies**: Designed to be lean, ensuring quick load times without the bloat of external dependencies.
- **Versatile**: Perfect for small to medium projects, yet robust enough for complex state management needs.

## Installation

You can install ATsManager using npm:

```bash
npm install atsmanager

```

## Usage

### Quick Start

To get started with ATsManager, first import the library:

```javascript
import ATSManager from "atsmanager";
```

### Managing Global State

Create a global state manager and interact with it:

```javascript
const atsManager = new ATSManager();
atsManager.addGlobalState({ counter: 0 });

const globalState = atsManager.getStateManager("global");
globalState.setState({ counter: globalState.getState().counter + 1 });

console.log(globalState.getState()); // { counter: 1 }
```

### Using Proxy State for Reactive Updates

Initialize and use a proxy state manager for reactive state updates:

```javascript
const atsManager = new ATSManager();
atsManager.addProxyState({ user: { name: "John Doe", age: 30 } });

const proxyState = atsManager.getStateManager("proxy");
proxyState.subscribe((state) => console.log("State updated:", state));

proxyState.setState((state) => ({
  ...state,
  user: { ...state.user, age: 31 },
}));
```

### Using State Machines

Define states for a state machine and manage transitions:

```javascript
const atsManager = new ATSManager();
const states = [
  { name: "idle", onEnter: () => console.log("Entering idle state") },
  { name: "running", onEnter: () => console.log("Entering running state") },
];

atsManager.addStateMachine(states);
const stateMachine = atsManager.getStateManager("stateMachine");
stateMachine.transitionTo(states[1]); // Switch to 'running' state
```

### Using component-specific state manager

Manage state scoped to specific components:

```javascript
const atsManager = new ATSManager();
atsManager.addComponentState({ isVisible: true });

const componentState = atsManager.getStateManager("component");
componentState.setState({ isVisible: false });

console.log(componentState.getState()); // { isVisible: false }
```

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
