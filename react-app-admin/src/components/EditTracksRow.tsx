import {DanceTypes, ITrack} from "../models";
import {useForm} from "react-hook-form";
import {upsertTrack} from "../api/api";

export default function EditTrackRow({track}: { track: ITrack }) {
    const {register, handleSubmit} = useForm({
        defaultValues: track
    });

    const updateTrack = async (form: ITrack) => {
        track.title = form.title;
        track.danceType = form.danceType;
        track.tags = form.tags;
        track.artist = form.artist;
        await upsertTrack(track);
    }

    return <form onSubmit={handleSubmit(updateTrack)} key={track.id} className="flex">
        <div className="flex-1">
            <input type="text" {...register('title')}/>
        </div>
        <div className="flex-1">
            <select {...register('danceType')}>
                {DanceTypes.map(p => {
                    return <option key={p} value={p}>{p}</option>;
                })}
            </select>
        </div>
        <div className="flex-1">
            <input type="text" {...register('tags', {
                onChange: (e) => {
                    const valueWithoutSpaces = e.target.value.replace(/\s/g, '');
                    return valueWithoutSpaces.split(',');
                }
            })}/>
        </div>
        <div className="flex-1">
            <input type="text" {...register('artist')}/>
        </div>
        <div className="flex-1">
            <button type="submit">Save</button>
        </div>
    </form>
}
