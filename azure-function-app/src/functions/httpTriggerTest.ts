import {HttpRequest, HttpResponse, InvocationContext} from "@azure/functions";
import {createFunction} from "../lib/http";

createFunction('httpTriggerTest', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (context: InvocationContext, request: HttpRequest): Promise<HttpResponse> => {
        context.log(`Http function processed request for url "${request.url}"`);

        const name = request.query.get('name') || await request.text() || 'world';

        return {
            body: {
                message: `Hello ${name}!`
            }
        };
    }
});
