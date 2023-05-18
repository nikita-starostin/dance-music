import {TracksContainer} from "../lib/cosmos";
import {v4 as uuidv4} from 'uuid';
import {uploadFileToDropbox} from "../lib/dropbox";

export interface IUpsertTrackModel {
    id?: string;
    file?: {
        filename: string;
        type: string;
        data: Buffer;
    };
    title?: string;
    danceType?: string;
    tags?: string[]
    artist?: string;
    url?: string;
}

export async function upsertTrack(track: IUpsertTrackModel) {
    const url = await uploadFileToDropbox({
        filename: track.file.filename,
        data: track.file.data,
        danceType: track.danceType || 'uknown'
    });

    await TracksContainer.items.upsert({
        artist: track.artist || '',
        danceType: track.danceType || '',
        tags: track.tags || [],
        title: track.title || '',
        url,
        id: track.id || uuidv4(),
        contentType: track.file.type
    });
}

