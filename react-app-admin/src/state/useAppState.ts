export interface IAppState<TState extends object> {
    get(): TState;

    set(newState: TState): void;
}
