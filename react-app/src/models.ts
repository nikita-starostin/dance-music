export enum DanceType {
    BallroomSt = 'BallroomSt',
    BallroomLa = 'BallroomLa',
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

export enum Tier {
    Free = 'free',
    Premium = 'premium'
}

export enum Tags {
    Ru = 'ru',
    En = 'en',
}

export enum ListenedBefore {
    Yes = 'yes',
    No = 'no',
    LastWeek = 'lastWeek',
}

export enum Artist {
    DjMaksy = "DjMaksy"
}
