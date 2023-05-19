export enum DanceType {
    Waltz = 'Waltz',
    Tango = 'Tango',
    VienneseWaltz = 'VienneseWaltz',
    Foxtrot = 'Foxtrot',
    Quickstep = 'Quickstep'
}

export const DanceTypes = [
    DanceType.Foxtrot,
    DanceType.Waltz,
    DanceType.Tango,
    DanceType.VienneseWaltz,
    DanceType.Quickstep,
];

export interface ITrack {
    id: string;
    title: string;
    danceType: DanceType;
    url: string;
    tags: string[];
    artist: string;
}
