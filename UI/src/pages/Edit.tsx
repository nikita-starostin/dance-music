import {DragEventHandler, useEffect, useState} from "react";
import {ITrack} from "../models";
import TracksEdit from "../shared/components/TracksEdit";
import {useRemote} from "../shared/useRemote";
import {FakeTracks} from "../constants";
import {useFilterStateReadonly} from "../state/filter.state";

export default function Edit() {
    console.log('render');
    const [canRender, setCanRender] = useState(false);
    useEffect(() => {
        const allowed = prompt('Password?') === 'joi';
        setCanRender(allowed);
    }, []);
    const {data} = useRemote<ITrack[]>('', FakeTracks);
    const [tracks, setTracks] = useState<ITrack[]>([]);
    useEffect(() => {
        setTracks(data || []);
    }, [data]);

    const filter = useFilterStateReadonly();

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
                danceType: filter.danceType,
                tags: filter.tags,
                artist: filter.artist,
            }))]);
    };

    if (!canRender) {
        return <></>;
    }

    return (
        <div className="p-5">
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
