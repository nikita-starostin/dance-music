import {useEffect, useRef, useState} from "react";

export interface IAppState<TState extends object> {
    get(): TState;

    set(newState: TState): void;
}

export type UseStateObject<TState extends object> = { [key in keyof TState]: [TState[keyof TState], (newValue: TState[keyof TState]) => void] };

export function useAppState<TState extends object>(state: IAppState<TState>): UseStateObject<TState> {
    const initialStateObject = useRef(state.get());
    const result = useRef({} as UseStateObject<TState>);
    const stateKeys = Object.keys(initialStateObject.current) as (keyof TState)[];

    stateKeys
        .forEach(key => {
            const typedKey = key as keyof TState;
            result.current[typedKey] = useState(initialStateObject.current[typedKey]);
        });

    useEffect(() => () => {
        const newState = {} as TState;
        stateKeys.forEach(key => {
            newState[key] = result.current[key][0];
        })
        state.set(newState);
    }, []);

    return result.current;
}
