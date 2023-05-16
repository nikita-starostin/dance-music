export enum DanceType {
  Waltz = 'Waltz',
  Tango = 'Tango',
  VienneseWaltz = 'VienneseWaltz',
  Foxtrot = 'Foxtrot',
  Quickstep = 'Quickstep'
}

export interface ITrack {
  id: string;
  title: string;
  danceType: DanceType;
  src: string;
  tags: string[];
  artist: string;
}
