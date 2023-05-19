import {HttpRequest, HttpResponse, InvocationContext} from "@azure/functions";
import {createFunction, parseMultipartDataArray} from "../lib/http";
import {IUpsertTrackModel, upsertTrack} from "../shared/upsertTrack";

createFunction('httpTriggerTracksWithFilesUpsert', {
    methods: ['PUT'],
    route: 'tracksWithFiles',
    authLevel: 'anonymous',
    handler: async (context: InvocationContext, request: HttpRequest): Promise<HttpResponse> => {
        const tracks = await parseMultipartDataArray(request) as IUpsertTrackModel[];
        for (const track of tracks) {
            if (!!track.file) {
                await upsertTrack(track);
            }
        }

        return {
            body: {
                result: 'files are uploaded'
            }
        };
    }
});
