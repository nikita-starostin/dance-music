import {DragEventHandler, useCallback, useEffect, useRef, useState} from "react";
import {ITrack} from "../models";
import TracksEdit from "../shared/components/TracksEdit";
import {useRemote} from "../api/useRemote";
import {FakeTracks} from "../constants";
import {filterState} from "../state/filter.state";
import {Urls} from "../api/urls";

export default function Edit() {
    const [canRender, setCanRender] = useState(true);
    // useEffect(() => {
    //     const allowed = prompt('Password?') === 'joi';
    //     setCanRender(allowed);
    // }, []);
    const [tracks, setTracks] = useState<any[]>([]);

    const filter = useRef(filterState.get());

    const uploadTracks = useCallback(async () => {
        const formData = new FormData();
        for (let i = 0; i < tracks.length; i++) {
            const track = tracks[i];
            formData.append(`file[${i}]`, track.file);
            formData.append(`title[${i}]`, track.title);
            formData.append(`danceType[${i}]`, track.danceType);
            formData.append(`tags[${i}]`, track.tags);
            formData.append(`artist[${i}]`, track.artist);
        }
        await fetch(Urls.UploadTracks, {
            body: formData,
            method: 'PUT',
        });
    }, [tracks]);

    const onFilesDrop: DragEventHandler = (e) => {
        e.preventDefault();
        if (!e.dataTransfer) {
            return;
        }

        const files = e.dataTransfer.files
            ? [...e.dataTransfer.files].filter(p => p != null)
            : [...e.dataTransfer.items]
                .filter(p => p.kind === 'file')
                .map(p => p.getAsFile() as File)

        setTracks([...tracks,
            ...files.map(p => ({
                file: p,
                title: p.name,
                danceType: filter.current.danceType,
                tags: filter.current.tags,
                artist: filter.current.artist,
            }))]);
    };

    if (!canRender) {
        return <></>;
    }

    return (
        <div className="p-5">
            <button onClick={uploadTracks}>Upload</button>
            <div className="border-dashed border-2 p-5" onDrop={onFilesDrop} onDragOver={e => {
                e.preventDefault();
                console.log('drag over');
            }}>
                Drop area
            </div>
            <TracksEdit tracks={tracks || []}/>
        </div>
    );
}
