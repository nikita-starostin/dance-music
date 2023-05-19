import {PatchOperation} from "@azure/cosmos";
import {HttpRequest, HttpResponse, InvocationContext} from "@azure/functions";
import {ITrackDbModel} from "../shared/upsertTrack";
import {getNewId, TracksContainer} from "../lib/cosmos";
import {createFunction, OkResult} from "../lib/http";

createFunction('httpTriggerUpdateTrack', {
    methods: ['PUT'],
    route: 'tracks',
    authLevel: 'anonymous',
    handler: async (context: InvocationContext, request: HttpRequest): Promise<HttpResponse> => {
        const track = await request.json() as ITrackDbModel;
        const isNewTrack = !track.id;
        if(isNewTrack) {
            track.id = getNewId();
            await TracksContainer.items.create(track);
        } else {
            const fieldsToUpdate: Array<keyof ITrackDbModel> = ['title', 'artist', 'danceType', 'tags'];
            const patchOperations: PatchOperation[] = fieldsToUpdate
                .map(field => ({
                    op: 'replace',
                    path: `/${field}`,
                    value: track[field]
                }));
            await TracksContainer
                .item(track.id, track.id)
                .patch({operations: patchOperations})
        }

        return OkResult;
    }
});
