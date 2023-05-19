import './App.css';
import {BlobServiceClient} from "@azure/storage-blob";
import useSWR from "swr";
import {ITrack} from "./models";
import {httpGetJson, Urls} from "./lib/http";
import EditTrackRow from "./components/EditTracksRow";

export default function App({blobServiceClient}: { blobServiceClient: BlobServiceClient }) {
    const {data: tracks} = useSWR<{ items: ITrack[] }>(Urls.Tracks, httpGetJson);


    return (
        <div className="font-rubik flex flex-col">
            <div className="flex">
                <div className="flex-1">
                    Title
                </div>
                <div className="flex-1">
                    Dance Type
                </div>
                <div className="flex-1">
                    Tags
                </div>
                <div className="flex-1">
                    Artist
                </div>
                <div className="flex-1">
                    Actions
                </div>
            </div>
            {
                tracks?.items.map(track => <EditTrackRow track={track} key={track.id}/>)
            }
        </div>
    );
}
