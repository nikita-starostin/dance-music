import {DragEventHandler, useCallback, useEffect, useRef, useState} from "react";
import {ITrack} from "../models";
import TracksEdit from "../shared/components/TracksEdit";
import {useRemote} from "../api/useRemote";
import {FakeTracks} from "../constants";
import {filterState} from "../state/filter.state";

export default function Edit() {
    const [canRender, setCanRender] = useState(false);
    useEffect(() => {
        const allowed = prompt('Password?') === 'joi';
        setCanRender(allowed);
    }, []);
    const [tracks, setTracks] = useState<ITrack[]>([]);

    const filter = useRef(filterState.get());

    const uploadTracks = useCallback(async () => {

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

        files.forEach((file, i) => {
            console.log(`… file[${i}].name = ${file.name}`);
        });

        setTracks([...tracks,
            ...files.map(p => ({
                id: p.name,
                title: p.name,
                src: p.name,
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
