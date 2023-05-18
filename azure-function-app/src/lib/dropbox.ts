import {Dropbox} from "dropbox";
import {Env} from "./env";

// alternative variant if any issues with blobs for playing music
export async function uploadFileToDropbox(file: {filename: string, data: Buffer, danceType: string}) {
    try {
        const dbx = new Dropbox({ accessToken: Env.DropboxAccessToken });
        const response = await dbx.filesUpload({path: `/dance-music/${file.danceType}/${file.filename}`, contents: file.data});
        const link = await dbx.sharingCreateSharedLinkWithSettings({
            path: response.result.path_lower,
            settings: {
                access: {
                    '.tag': 'viewer'
                },
                requested_visibility: {
                    '.tag': 'public'
                }
            }
        });
        const mediaLink = link.result.url
            .replace('www.dropbox.com', 'dl.dropboxusercontent.com')
            .replace('?dl=0', '');

        console.log(mediaLink);
        return mediaLink;
    } catch (error) {
        console.error(error);
    }
}
