export const Urls = {
    Tracks: "/api/tracks",
    BlobInfo: "/api/blobInfo",
}

export const HttpSuccess = 200;

export function httpPut(url: string, body: any): Promise<any> {
    return fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
}

export function httpGetJson<TModel>(url: string): Promise<TModel> {
    return fetch(url).then((res) => res.json());
}
