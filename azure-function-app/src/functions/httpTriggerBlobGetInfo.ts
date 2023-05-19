import {createFunction} from "../lib/http";
import {tracksBlobContainerName, tracksUploadSas} from "../lib/blob";

createFunction('httpTriggerBlobGetInfo', {
    methods: ['GET'],
    route: 'blobInfo',
    authLevel: 'anonymous',
    handler: async (context, request) => {
        return {
            body: {
                storageName: tracksBlobContainerName,
                sas: tracksUploadSas
            }
        }
    }
});
