import {ITrack} from "../models";
import {httpPut, HttpSuccess, Urls} from "../lib/http";

export function upsertTrack(track: ITrack) {
    return httpPut(Urls.Tracks, track);
}

export function uploadFile(file: File,
                           onProgress: (loaded: number, total: number) => void): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
            onProgress(e.loaded, e.total);
        }
    });

    return new Promise<string>((resolve, reject) => {
        xhr.open('POST', '/api/tracks');
        xhr.onload = () => {
            if (xhr.status === HttpSuccess) {
                resolve(xhr.responseText);
            } else {
                reject(xhr.statusText);
            }
        };
    });
}
