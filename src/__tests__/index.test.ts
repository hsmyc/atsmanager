import ATSManager from "../index";
import StateMachine from "../components/stateMachine";
import ProxyStateManager from "../components/proxyState";
import GlobalStateManager from "../components/globalState";
import ComponentStateManager from "../components/componentState";

describe("ATSManager", () => {
  let atsManager: ATSManager;

  beforeEach(() => {
    atsManager = new ATSManager();
  });

  it("should add a StateMachine to the manager", () => {
    const states = ["state1", "state2", "state3"];
    atsManager.addStateMachine(states.map((state) => ({ name: state })));

    const stateMachine =
      atsManager.getStateManager<StateMachine>("stateMachine");
    expect(stateMachine).toBeInstanceOf(StateMachine);
  });

  it("should add a ProxyStateManager to the manager", () => {
    const initialState = { count: 0 };
    atsManager.addProxyState(initialState);

    const proxyStateManager =
      atsManager.getStateManager<ProxyStateManager<typeof initialState>>(
        "proxy"
      );
    expect(proxyStateManager).toBeInstanceOf(ProxyStateManager);
  });

  it("should add a GlobalStateManager to the manager", () => {
    const initialState = { theme: "light" };
    atsManager.addGlobalState(initialState);

    const globalStateManager =
      atsManager.getStateManager<GlobalStateManager<typeof initialState>>(
        "global"
      );
    expect(globalStateManager).toBeInstanceOf(GlobalStateManager);
  });

  it("should add a ComponentStateManager to the manager", () => {
    const initialState = 0;
    atsManager.addComponentState(initialState);

    const componentStateManager =
      atsManager.getStateManager<ComponentStateManager<number>>("component");
    expect(componentStateManager).toBeInstanceOf(ComponentStateManager);
  });

  it("should throw an error when retrieving an uninitialized state manager", () => {
    expect(() =>
      atsManager.getStateManager<StateMachine>("stateMachine")
    ).toThrowError("State manager of type 'stateMachine' does not exist.");
  });
});
