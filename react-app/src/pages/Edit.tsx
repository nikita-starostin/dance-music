import {DragEventHandler, useCallback, useState} from "react";
import TracksEdit from "../shared/components/TracksEdit";
import {filterAtom} from "../state/filter.state";
import {Urls} from "../api/urls";
import {useAtomValue} from "jotai";

export default function Edit() {
    const [canRender, setCanRender] = useState(true);
    // useEffect(() => {
    //     const allowed = prompt('Password?') === 'joi';
    //     setCanRender(allowed);
    // }, []);
    const [tracks, setTracks] = useState<any[]>([]);

    const filter = useAtomValue(filterAtom);

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
        await fetch(Urls.Tracks, {
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
                danceType: filter.danceType,
                tags: filter.tags,
            }))]);
    };

    const download = () => {
        const blob = new Blob([tracks[0].file]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = tracks[0].title;
        a.click();
    }

    if (!canRender) {
        return <></>;
    }

    return (
        <div className="p-5">
            <button onClick={uploadTracks}>Upload</button>
            <button onClick={download}>Download</button>
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
