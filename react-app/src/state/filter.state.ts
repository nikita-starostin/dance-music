import {DanceType} from "../models";
import {atom, PrimitiveAtom} from "jotai";

export interface IFilter {
    danceType: DanceType;
    tags: string[];
}

const initialValue: IFilter = {
    danceType: DanceType.Waltz,
    tags: [],
}

export const filterAtom: PrimitiveAtom<IFilter> = atom(initialValue);

