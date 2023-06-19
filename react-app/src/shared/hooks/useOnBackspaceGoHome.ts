import {useEffect} from "react";
import {goToHome} from "../../appRouting";

export function useOnBackspaceGoHome() {
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Backspace' && e.target === document.body) {
                goToHome();
            }
        }
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        }
    });
}
