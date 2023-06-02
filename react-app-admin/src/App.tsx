import './App.css';
import {BlobServiceClient} from "@azure/storage-blob";
import useSWR from "swr";
import {DanceType, ITrack} from "./models";
import {httpGetJson, Urls} from "./lib/http";
import EditTrackRow from "./components/EditTracksRow";
import {DragEventHandler, useState} from 'react';

export default function App({blobServiceClient}: { blobServiceClient: BlobServiceClient }) {
    const {data: tracks, mutate: updateTracks} = useSWR<{ items: ITrack[] }>(Urls.Tracks, httpGetJson);
    const [danceType] = useState<DanceType>(DanceType.Waltz);
    const onFilesDrop: DragEventHandler = (e) => {
        console.log('on files drop');
        e.preventDefault();
        console.log(e);
        const files = e.dataTransfer.files
            ? [...e.dataTransfer.files].filter(p => p != null)
            : [...e.dataTransfer.items]
                .filter(p => p.kind === 'file')
                .map(p => p.getAsFile() as File);

        const newTracks: ITrack[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const track: ITrack = {
                id: '',
                title: file.name,
                artist: '',
                tags: [],
                danceType,
                url: ''
            };
            newTracks.push(track);
        }
        const oldTracks = tracks?.items || [];
        updateTracks({items: [...newTracks, ...oldTracks]}, {
            revalidate: false
        })
    }

    return (
        <>
            <div onDrop={onFilesDrop}
                 onDragOver={e => {
                     e.preventDefault();
                     console.log('drag over');
                 }}
                 className="h-[50px] border-2 border-dashed border-black text-center leading-[40px]">
                Drop area
            </div>
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
        </>
    );
}
