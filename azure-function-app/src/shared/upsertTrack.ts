import {TracksContainer} from "../lib/cosmos";
import {v4 as uuidv4} from 'uuid';
import {TracksBlobContainerClient} from "../lib/blob";

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
}

export interface ITrackDbModel {
    id: string;
    title: string;
    artist: string;
    blobContainerUrl: string;
    danceType: string;
    tags: string[]
}

export async function upsertTrack(track: IUpsertTrackModel) {
    const blockBlobClient = TracksBlobContainerClient.getBlockBlobClient(track.file.filename);
    await blockBlobClient.uploadData(track.file.data, {
        blobHTTPHeaders: {
            blobContentType: track.file.type
        }
    });

    await TracksContainer.items.upsert({
        artist: track.artist || '',
        danceType: track.danceType || '',
        tags: track.tags || [],
        title: track.title || '',
        blobContainerUrl: blockBlobClient.url,
        id: track.id || uuidv4(),
        contentType: track.file.type
    });
}

