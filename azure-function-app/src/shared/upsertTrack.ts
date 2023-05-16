import {TracksBlobContainerClient} from "../lib/blob";
import {TracksContainer} from "../lib/cosmos";
import {v4 as uuidv4} from 'uuid';

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
    const blockBlobClient = TracksBlobContainerClient.getBlockBlobClient(track.file.filename);
    await blockBlobClient.uploadData(track.file.data);
    await TracksContainer.items.upsert({
        artist: track.artist || '',
        danceType: track.danceType || '',
        tags: track.tags || [],
        title: track.title || '',
        url: blockBlobClient.url,
        id: track.id || uuidv4()
    });
}

