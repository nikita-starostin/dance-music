import {Env} from "./env";
import {BlobServiceClient, StorageSharedKeyCredential} from "@azure/storage-blob";

const storageAccountName = Env.TracksStorageAccountName;
const storageAccountKey = Env.TracksStorageAccountKey;
const containerName = Env.TracksContainerName;
const sharedKeyCredential = new StorageSharedKeyCredential(storageAccountName, storageAccountKey);
const blobServiceClient = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net`,
    sharedKeyCredential
);
export const TracksBlobContainerClient = blobServiceClient.getContainerClient(containerName);
