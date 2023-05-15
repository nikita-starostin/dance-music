import {app, HttpRequest, HttpResponse, InvocationContext} from "@azure/functions";
import {StorageSharedKeyCredential, BlobServiceClient} from "@azure/storage-blob";

app.http('uploadTracks', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    handler: async (context: InvocationContext, request: HttpRequest): Promise<HttpResponse> => {
        const formData = await request.formData();
        const files = formData.getAll('tracks') as unknown as File[];

        const storageAccountName = process.env.TracksStorageAccountName;
        const storageAccountKey = process.env.TracksStorageAccountKey;
        const containerName = process.env.TracksContainerName;
        const sharedKeyCredential = new StorageSharedKeyCredential(storageAccountName, storageAccountKey);
        const blobServiceClient = new BlobServiceClient(
            `https://${storageAccountName}.blob.core.windows.net`,
            sharedKeyCredential
        );
        const containerClient = blobServiceClient.getContainerClient(containerName);

        for (const file of files) {
            const blockBlobClient = containerClient.getBlockBlobClient(file.name);
            await blockBlobClient.uploadData(await file.arrayBuffer())
        }

        return {
            body: {
                result: 'files are uploaded'
            }
        };
    }
});
