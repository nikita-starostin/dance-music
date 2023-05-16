import {useRemote} from "../api/useRemote";
import {ITrack} from "../models";
import {Urls} from "../api/urls";
import {useRef} from "react";
import {filterState} from "../state/filter.state";
import {getUrlWithQueryParams} from "../api/getUrlWithQueryParams";

export default function View() {
    const filter = useRef(filterState.get());
    const trackUrl = getUrlWithQueryParams(Urls.Tracks, {
        danceType: filter.current.danceType,
    })
    const {data: tracks} = useRemote<{ items: ITrack[] }>(trackUrl);

    return (
        <div className="p-5">
            {tracks && tracks.items.map(p => {
                return <div key={p.id}
                            className="flex items-center">
                    {p.title}
                </div>;
            })}
        </div>
    );
}
