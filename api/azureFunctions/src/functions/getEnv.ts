import {app, HttpResponse} from "@azure/functions";

app.http('getEnv', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (): Promise<HttpResponse> => {
        return {
            body: {
                containerName: process.env.BlobContainerName
            }
        };
    }
});
