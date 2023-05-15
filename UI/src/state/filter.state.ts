import {DanceType} from "../models";
import {IAppState} from "./useAppState";

export interface IFilter {
    danceType: DanceType;
    tags: string[];
    artist: string;
}

export class FilterState implements IAppState<IFilter> {
    filter: IFilter = {
        danceType: DanceType.Waltz,
        tags: [],
        artist: ''
    }

    get() {
        return this.filter;
    }

    set(filter: IFilter) {
        this.filter = filter;
    }
}

export const filterState = new FilterState();
