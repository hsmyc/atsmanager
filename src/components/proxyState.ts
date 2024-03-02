/**
 * Manages application state with Proxy, allowing for reactive updates and efficient state change notifications.
 * Utilizes batch updates to optimize notification processes during rapid state changes, ensuring performance and reactivity.
 *
 * @template T The type of the state being managed, supporting both simple and complex nested objects.
 */
export default class ProxyStateManager<T> {
  private state: T;
  private listeners: Set<ListenerG<T>> = new Set();
  private isBatchingUpdates: boolean = false;
  private pendingNotifications: Set<ListenerG<T>> = new Set();
  private hasStateChanged: boolean = false; // Tracks if the state has changed during batch updates.

  /**
   * Initializes the state manager with an initial state. The state is proxied to automatically handle change detection and notifications.
   * @param initialState The initial state, must be an object.
   */
  constructor(initialState: T) {
    if (typeof initialState !== "object" || initialState === null) {
      throw new Error(
        "ProxyStateManager can only manage state of type 'object'."
      );
    }
    this.state = this.createProxy(initialState);
  }

  /**
   * Wraps the state object with a Proxy to intercept set operations and automate change detection and listener notification.
   * @param state The state object to proxy.
   * @returns The proxied state object.
   */
  private createProxy(state: T): T {
    const handler = {
      set: (obj: any, prop: string, value: any) => {
        let oldValue = obj[prop];
        obj[prop] = value;
        // Checks if the value actually changed to minimize unnecessary updates.
        if (JSON.stringify(oldValue) !== JSON.stringify(value)) {
          this.hasStateChanged = true; // Indicates that the state has changed.
          if (!this.isBatchingUpdates) {
            this.notifyListeners();
          } else {
            // Adds listeners to the pending notifications set if batching is active.
            this.listeners.forEach((listener) =>
              this.pendingNotifications.add(listener)
            );
          }
        }
        return true;
      },
    };
    return new Proxy(state, handler);
  }

  /**
   * Checks if the provided value is a function, aiding in distinguishing between direct state updates and functional updates.
   * @param value The value to check.
   * @returns True if the value is a function, otherwise false.
   */
  private isFunction(value: any): value is (prevState: T) => T {
    return typeof value === "function";
  }

  /**
   * Retrieves the current state.
   * @returns The current state object.
   */
  public getState(): T {
    return this.state;
  }

  /**
   * Updates the state with a new value or a function that produces a new state based on the previous state. Notifies subscribed listeners of the change.
   * @param action The new state value or a function returning the new state.
   */
  public setState(action: SetStateAction<T>): void {
    const newState = this.isFunction(action) ? action(this.state) : action;
    if (JSON.stringify(this.state) !== JSON.stringify(newState)) {
      this.state = this.createProxy(newState);
      if (!this.isBatchingUpdates) {
        this.notifyListeners();
      } else {
        // Adds listeners to the pendingNotifications if batching is active
        this.listeners.forEach((listener) =>
          this.pendingNotifications.add(listener)
        );
      }
    }
  }

  /**
   * Subscribes a listener to state changes.
   * @param listener The listener function to be notified on state changes.
   * @returns A function to unsubscribe the listener.
   */
  public subscribe(listener: ListenerG<T>): () => void {
    this.listeners.add(listener);
    return () => this.unsubscribe(listener);
  }

  /**
   * Unsubscribes a listener from state change notifications.
   * @param listener The listener to unsubscribe.
   */
  private unsubscribe(listener: ListenerG<T>): void {
    this.listeners.delete(listener);
  }

  /**
   * Notifies all subscribed listeners of the current state. If batching is active, waits until batch updates are finished.
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }

  /**
   * Begins a session for batch updating, during which state changes do not immediately trigger notifications.
   */
  public beginBatchUpdates(): void {
    this.isBatchingUpdates = true;
  }

  /**
   * Ends the batch update session, triggering notifications for any state changes that occurred during the session.
   */
  public endBatchUpdates(): void {
    if (this.pendingNotifications.size > 0) {
      this.pendingNotifications.forEach((listener) => listener(this.state));
      this.pendingNotifications.clear();
    }
    this.isBatchingUpdates = false; // Ensure this is set after notifications are sent
  }
}
