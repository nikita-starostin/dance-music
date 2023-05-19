import {Env} from "./env";
import {BlobServiceClient, StorageSharedKeyCredential} from "@azure/storage-blob";

const storageAccountName = Env.TracksStorageAccountName;
export const storageAccountKey = Env.TracksStorageAccountKey;
export const tracksBlobContainerName = Env.TracksContainerName;
export const tracksUploadSas = Env.TracksUploadSas;

const sharedKeyCredential = new StorageSharedKeyCredential(storageAccountName, storageAccountKey);
const blobServiceClient = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net`,
    sharedKeyCredential
);
export const TracksBlobContainerClient = blobServiceClient.getContainerClient(tracksBlobContainerName);
