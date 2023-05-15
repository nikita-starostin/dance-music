import {useRemote} from "../api/useRemote";
import {ITrack} from "../models";
import {FakeTracks} from "../constants";

export default function View() {
    const {data: tracks} = useRemote<ITrack[]>('', FakeTracks);

    return (
        <div className="p-5">
            {tracks && tracks
                .map(p => {
                return <div key={p.id}
                            className="flex items-center">
                    {p.title}
                </div>;
            })}
        </div>
    );
}
