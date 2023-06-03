import {DancePattern, DanceType, TrackDanceType} from "../models";
import {atom, PrimitiveAtom} from "jotai";

export interface IFilter {
    danceType: DanceType;
    dancePattern: DancePattern;
    trackDanceType: TrackDanceType;
    tags: string[];
}

const initialValue: IFilter = {
    danceType: DanceType.BallroomSt,
    dancePattern: DancePattern.SingleDance,
    trackDanceType: TrackDanceType.Waltz,
    tags: [],
}

export const IgnoredFieldsByDancePattern: Record<DancePattern, Array<keyof IFilter>> = {
    [DancePattern.Final]: ['trackDanceType'],
    [DancePattern.SingleDance]: [],
}

export const filterAtom: PrimitiveAtom<IFilter> = atom(initialValue);

