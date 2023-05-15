import {app, HttpRequest, HttpResponse, InvocationContext} from "@azure/functions";
import {BlobServiceClient, StorageSharedKeyCredential} from "@azure/storage-blob";
import {parse} from "parse-multipart-data";

interface ITrackCreateModel {
    file?: {
        filename: string;
        type: string;
        data: Buffer;
    };
    title: string;
    danceType: string;
    tags: string[]
    artist: string;
}

async function extractTracks(request: HttpRequest) {
    const body = Buffer.from(await request.text());
    const boundary = request.headers.get('content-type').split('boundary=')[1];
    const parts = parse(body, boundary);
    const tracks: Array<Partial<ITrackCreateModel>> = [];
    for (let i = 0; i < parts.length; ++i) {
        const index = parts[i].name.split('[')[1].split(']')[0];

        if (!tracks[index]) {
            tracks[index] = {}
        }

        if (parts[i].filename) {
            tracks[index].file = {
                filename: parts[i].filename,
                type: parts[i].type,
                data: parts[i].data
            }
        } else {
            tracks[index][parts[i].name.split('[')[0]] = parts[i].data.toString();
        }
    }
    return tracks;
}

app.http('uploadTracks', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    handler: async (context: InvocationContext, request: HttpRequest): Promise<HttpResponse> => {
        const tracks = await extractTracks(request);

        const storageAccountName = process.env.TracksStorageAccountName;
        const storageAccountKey = process.env.TracksStorageAccountKey;
        const containerName = process.env.TracksContainerName;
        const sharedKeyCredential = new StorageSharedKeyCredential(storageAccountName, storageAccountKey);
        const blobServiceClient = new BlobServiceClient(
            `https://${storageAccountName}.blob.core.windows.net`,
            sharedKeyCredential
        );
        const containerClient = blobServiceClient.getContainerClient(containerName);

        for (const file of tracks) {
            if(!!file.file) {
                const blockBlobClient = containerClient.getBlockBlobClient(file.file.filename);
                await blockBlobClient.uploadData(file.file.data);
            }
        }

        return {
            body: {
                result: 'files are uploaded'
            }
        };
    }
});
