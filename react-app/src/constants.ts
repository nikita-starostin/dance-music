import {DancePattern, DanceType, ListenedBefore, Tier, TrackDanceType} from "./models";
import {ILocaleStrings} from "./shared/localization/ILocaleStrings";

export const LocalStorageKeys = {
    Auth: 'auth',
    Profile: 'profile',
    Profiles: 'profiles',
    Filter: 'filter',
    Patterns: 'patterns'
}

export const TrackDanceTypesByDanceType: Record<DanceType, TrackDanceType[]> = {
    [DanceType.BallroomSt]: [
        TrackDanceType.Waltz,
        TrackDanceType.Tango,
        TrackDanceType.VienneseWaltz,
        TrackDanceType.Foxtrot,
        TrackDanceType.Quickstep,
    ],
    [DanceType.BallroomLa]: [],
}

const ballroomPatterns = [
    DancePattern.SingleDance,
    DancePattern.Final,
]

export const DancePatternByDanceType: Record<DanceType, DancePattern[]> = {
    [DanceType.BallroomSt]: ballroomPatterns,
    [DanceType.BallroomLa]: ballroomPatterns,
}

export const DanceTypes = [
    DanceType.BallroomSt,
    DanceType.BallroomLa,
];

export const DancePatternTranslations: Record<DancePattern, keyof ILocaleStrings> = {
    [DancePattern.SingleDance]: 'SingleDance',
    [DancePattern.Final]: 'Final',
}

export const DanceTypesTranslations: Record<DanceType, keyof ILocaleStrings> = {
    [DanceType.BallroomSt]: 'BallroomSt',
    [DanceType.BallroomLa]: 'BallroomLa',
}

export const TrackDanceTypeTranslations: Record<TrackDanceType, keyof ILocaleStrings> = {
    [TrackDanceType.Foxtrot]: 'Foxtrot',
    [TrackDanceType.Waltz]: 'Waltz',
    [TrackDanceType.Tango]: 'Tango',
    [TrackDanceType.VienneseWaltz]: 'VienneseWaltz',
    [TrackDanceType.Quickstep]: 'Quickstep',
};

export const TiersTranslations: Record<Tier, keyof ILocaleStrings> = {
    [Tier.Free]: 'Free',
    [Tier.Premium]: 'Premium',
}

export const ListenedBeforeTranslations: Record<ListenedBefore, keyof ILocaleStrings> = {
    [ListenedBefore.Yes]: 'Yes',
    [ListenedBefore.No]: 'No',
    [ListenedBefore.LastWeek]: 'ListenedLastWeek',
}
