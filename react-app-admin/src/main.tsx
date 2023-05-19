import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {Urls} from "./lib/http";
import {BlobServiceClient} from "@azure/storage-blob";

const root = document.getElementById('root');

if (!root) {
    throw 'Root element not found';
}

export const response = await fetch(Urls.BlobInfo);
const {storageName, sas} = await response.json();
if(!storageName || !sas) {
    throw 'Storage name or SAS token not found';
}

const blobServiceClient = new BlobServiceClient(`https://${storageName}.blob.core.windows.net${sas}`);

ReactDOM.createRoot(root).render(
    <React.StrictMode>
        <App blobServiceClient={blobServiceClient}/>
    </React.StrictMode>,
)
