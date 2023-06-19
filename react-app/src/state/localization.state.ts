import {ILocaleStrings} from "../shared/localization/ILocaleStrings";
import {getRu} from "../shared/localization/ru";
import {atom, useAtom} from "jotai";

interface ILocalization {
    locale: string;
    strings: ILocaleStrings;
}

function getRuLocalization(): ILocalization {
    return {
        locale: 'ru',
        strings: getRu()
    }
}

function getEnLocalization(): ILocalization {
    return {
        locale: 'en',
        strings: getRu()
    }
}

type AvailableLocalesType = 'ru' | 'en';

function getLocalization(locale: AvailableLocalesType) {
    switch (locale) {
        case 'ru':
            return getRuLocalization();
        case 'en':
            return getEnLocalization();
        default:
            return getRuLocalization();
    }
}

const localizationAtom = atom(getLocalization('ru'))

export function useLocalization(): {
    l: (key: keyof ILocaleStrings) => string,
    lOrKey: (key: string) => string,
    setLocale: (locale: AvailableLocalesType) => void
} {
    const [localization, setLocalization] = useAtom(localizationAtom);
    return {
        l: (key: keyof ILocaleStrings) => localization.strings[key] || '',
        lOrKey: (key: string) => {
            const keyOrString = key as keyof ILocaleStrings;
            return localization.strings[keyOrString] || keyOrString;
        },
        setLocale: (locale: AvailableLocalesType) => {
            setLocalization(getLocalization(locale));
        }
    }
}
