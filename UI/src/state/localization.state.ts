import {ILocaleStrings} from "../shared/localization/ILocaleStrings";
import {IAppState} from "./useAppState";
import {getEn} from "../shared/localization/en";
import {getRu} from "../shared/localization/ru";

interface ILocalizationState {
    localeStrings: ILocaleStrings;
}

export class LocalizationState implements IAppState<ILocaleStrings> {
    localeStrings: ILocaleStrings;

    constructor(lang: 'ru' | 'en') {
        switch (lang) {
            case 'ru':
                this.localeStrings = getRu();
                break;
            case 'en':
                this.localeStrings = getEn();
        }
    }

    get(): ILocaleStrings {
        return this.localeStrings;
    }

    set(newState: ILocaleStrings): void {
        this.localeStrings = newState;
    }
}

const localizationState = new LocalizationState('ru');

export function useLocalization(): ILocaleStrings {
    return localizationState.get();
}
