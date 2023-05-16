export function getUrlWithQueryParams(url: string, queryParams: { [key: string]: string | number | boolean }): string {
    const queryString = Object.keys(queryParams)
        .map(key => `${key}=${queryParams[key]}`)
        .join('&');
    return `${url}?${queryString}`;
}
