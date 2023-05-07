import { app, HttpRequest, HttpResponse, InvocationContext } from "@azure/functions";

export async function test(context: InvocationContext, request: HttpRequest): Promise<HttpResponse> {
    context.log(`Http function processed request for url "${request.url}"`);

    const name = request.query.get('name') || await request.text() || 'world';

    return { body: `Test Hello, ${name}!` };
};

app.http('test', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: test
});
