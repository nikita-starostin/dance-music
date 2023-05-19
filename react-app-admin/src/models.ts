import {ILocaleStrings} from "./shared/localization/ILocaleStrings";

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

export const DanceTypeTranslations: Record<DanceType, keyof ILocaleStrings> = {
  [DanceType.Foxtrot]: 'Foxtrot',
  [DanceType.Waltz]: 'Waltz',
  [DanceType.Tango]: 'Tango',
  [DanceType.VienneseWaltz]: 'VienneseWaltz',
  [DanceType.Quickstep]: 'Quickstep',
};

export interface ITrack {
  id: string;
  title: string;
  danceType: DanceType;
  url: string;
  tags: string[];
  artist: string;
}
