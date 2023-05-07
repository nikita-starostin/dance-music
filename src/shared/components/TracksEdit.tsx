import {FaPlay} from 'react-icons/fa';
import {ITrack} from '../../models';
import {useState} from "react";


function TrackEdit({track}: { track: ITrack }) {
    const [title, setTitle] = useState(track.title);
    const changeTitle = (e: any) => {
        setTitle(e.target.value);
        track.title = title;
    }
    return <div>
        <input type="text"
               value={track.title}
               onChange={changeTitle}/>
    </div>;
}

export default function TracksEdit({tracks}: { tracks: ITrack[] }) {
    return <>
        {tracks && tracks.map(p => {
        return <div key={p.id}
                    className="flex items-center">
            <TrackEdit track={p}/>
        </div>;
    })}</>;
}
