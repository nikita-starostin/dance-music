import {IFilter} from "./filter.state";
import {DanceType, TrackDanceType} from "../models";
import {atomWithStorage} from "jotai/utils";
import {LocalStorageKeys} from "../constants";
import {atom, useAtom} from "jotai";

interface IPhase {
    trackDanceTypes: TrackDanceType[];
    tracksCount?: number;
    averageTrackDurationS?: number;
}

export interface IPattern {
    id: string;
    title: string;
    canBeDeleted?: boolean;
    phases: Array<{title: string, value: IPhase}>;
    danceTypes: DanceType[];
    ignoreFields: Array<keyof IFilter>;
}

const InitialPatterns: IPattern[] = [
    {
        id: '1',
        title: 'SingleDance',
        canBeDeleted: false,
        phases: [
            {
                title: 'SingleDance',
                value: { 
                    trackDanceTypes: [TrackDanceType.Foxtrot, TrackDanceType.Waltz, TrackDanceType.VienneseWaltz, TrackDanceType.Quickstep, TrackDanceType.Tango],
                },
            }
        ],
        danceTypes: [DanceType.BallroomSt, DanceType.BallroomLa],
        ignoreFields: []
    },
    {
        id: '2',
        title: 'Final standard',
        canBeDeleted: false,
        phases: [
            {
                title: 'SlowWaltz',
                value: {
                    trackDanceTypes: [TrackDanceType.Waltz],
                    tracksCount: 1,
                }
            },
            {
                title: 'Tango',
                value: {
                    trackDanceTypes: [TrackDanceType.Tango],
                    tracksCount: 1,
                },
            },
            {
                title: 'VienneseWaltz',
                value: {
                    trackDanceTypes: [TrackDanceType.VienneseWaltz],
                    tracksCount: 1,
                },
            },
            {
                title: 'Foxtrot',
                value: {
                    trackDanceTypes: [TrackDanceType.Foxtrot],
                }
            },
            {
                title: 'Quickstep',
                value: {
                    trackDanceTypes: [TrackDanceType.Quickstep],
                }
            }
        ],
        danceTypes: [DanceType.BallroomSt],
        ignoreFields: ['trackDanceType']
    }
]

export const patternsAtom = atomWithStorage(LocalStorageKeys.Patterns, InitialPatterns)

export const patternTitlesAtom = atom((get) => get(patternsAtom).map(p => ({
    title: p.title,
    danceTypes: p.danceTypes,
})));

export function usePatternActions() {
    const [patterns, setPatterns] = useAtom(patternsAtom);
    return {
        addPattern: (pattern: IPattern) => {
            setPatterns([...patterns, pattern])
        },
        removePattern: (id: string) => {
            setPatterns(patterns.filter(p => p.id !== id))
        },
        updatePattern: (pattern: IPattern) => {
            setPatterns(patterns.map(p => p.id === pattern.id ? pattern : p))
        },
        patterns
    }
}