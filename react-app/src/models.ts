export enum DanceType {
    BallroomSt = 'BallroomSt',
    BallroomLa = 'BallroomLa'
}

export enum DancePattern {
    SingleDance = 'SingleDance',
    Final = 'Final',
}

export enum TrackDanceType {
    Waltz = 'Waltz',
    Tango = 'Tango',
    VienneseWaltz = 'VienneseWaltz',
    Foxtrot = 'Foxtrot',
    Quickstep = 'Quickstep'
}

export interface ITrack {
    id: string;
    title: string;
    danceType: TrackDanceType;
    url: string;
    tags: string[];
    artist: string;
}
