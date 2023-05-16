import {app, HttpRequest, HttpResponse, InvocationContext} from "@azure/functions";
import {TracksContainer} from "../lib/cosmos";

app.http('httpTriggerTracksList', {
    methods: ['GET'],
    route: 'tracks',
    authLevel: 'anonymous',
    handler: async (context: InvocationContext, request: HttpRequest): Promise<HttpResponse> => {
        const danceType = request.query.get('danceType');
        const query = `SELECT TOP 10 * FROM c WHERE c.danceType = '${danceType}'`;
        const tracksQueryIterator = await TracksContainer.items.query({ query });

        const tracksFeedResponse = await tracksQueryIterator.fetchAll();

        const tracks = tracksFeedResponse.resources.map(p => ({
                id: p.id,
                title: p.title,
                artist: p.artist,
                url: p.url,
                danceType: p.danceType,
                tags: p.tags
            }));

        return {
            body: {
                items: tracks
            }
        };
    }
});
