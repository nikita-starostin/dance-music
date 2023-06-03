import {Artist, DancePattern, DanceType, ListenedBefore, Tags, Tier, TrackDanceType} from "../models";
import {PrimitiveAtom} from "jotai";
import {atomWithStorage} from "jotai/utils";
import {LocalStorageKeys} from "../constants";

export enum FilterKindType {
    Basic = "basic", // filter only by basic fields
    Advanced = "advanced", // when advanced filter by all except history fields
    History = "history" // filter only by history fields
}

export interface IFilter {
    kind: FilterKindType; // see enum declaration for details

    // basic fields
    danceType: DanceType;
    dancePattern: DancePattern;
    trackDanceType: TrackDanceType;

    // advanced fields (advanced fields = basic and advanced fields)
    tagsEnabled: boolean;
    tags: Tags[];
    artistsEnabled: boolean;
    artists: Artist[];
    tiersEnabled: boolean;
    tiers: Tier[];
    listenedBeforeEnabled: boolean;
    listenedBefore: ListenedBefore;
    collectionsEnabled: boolean;
    collections: string[];
    tracksCount: number;
    averageTrackDurationEnabled: boolean;
    averageTrackDurationS: number;
    totalPlayListDurationEnabled: boolean;
    totalPlayListDurationS: number;
    ratingEnabled: boolean;
    rating: number;

    // history fields
    historyId: number;
}

const initialValue: IFilter = {
    kind: FilterKindType.Basic,
    danceType: DanceType.BallroomSt,
    dancePattern: DancePattern.SingleDance,
    trackDanceType: TrackDanceType.Waltz,
    tagsEnabled: false,
    tags: [],
    artistsEnabled: false,
    artists: [],
    tiersEnabled: false,
    tiers: [],
    listenedBeforeEnabled: false,
    listenedBefore: ListenedBefore.No,
    collectionsEnabled: false,
    collections: [],
    tracksCount: 20,
    averageTrackDurationEnabled: false,
    averageTrackDurationS: 120,
    totalPlayListDurationEnabled: false,
    totalPlayListDurationS: 120,
    ratingEnabled: false,
    rating: 0,
    historyId: 0,
}

export const IgnoredFieldsByDancePattern: Record<DancePattern, Array<keyof IFilter>> = {
    [DancePattern.Final]: ['trackDanceType'],
    [DancePattern.SingleDance]: [],
}

export const filterAtom: PrimitiveAtom<IFilter> = atomWithStorage(LocalStorageKeys.Filter, initialValue);
