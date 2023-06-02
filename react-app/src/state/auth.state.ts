import {atomWithStorage} from "jotai/utils";
import {LocalStorageKeys} from "../constants";
import {useAtom} from "jotai";

const isAuthorizedAtom = atomWithStorage(LocalStorageKeys.Auth, false)

export function useIsAuth() {
    const [isAuth, setIsAuth] = useAtom(isAuthorizedAtom);

    return {
        isAuth,
        logout: () => setIsAuth(false),
        login: () => setIsAuth(true),
    }
}
