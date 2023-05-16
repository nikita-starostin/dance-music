import {getRu} from "./ru";
import {getEn} from "./en";
import {ILocaleStrings} from "./ILocaleStrings";


export function getLocaleStrings(locale: string): ILocaleStrings {
    switch (locale) {
        case 'ru':
            return getRu();
        default:
            return getEn();
    }
}
