import {useRemote} from "../api/useRemote";
import {ITrack} from "../models";
import {Urls} from "../api/urls";
import {useState} from "react";
import {getUrlWithQueryParams} from "../api/getUrlWithQueryParams";
import {FaPause, FaPlay, FaStepBackward, FaStepForward} from "react-icons/fa";
import {playingState} from "../state/playing.state";
import {useAtomValue} from "jotai";
import {filterAtom} from "../state/filter.state";

export default function View() {
    const filter = useAtomValue(filterAtom);
    const trackUrl = getUrlWithQueryParams(Urls.Tracks, {
        danceType: filter.danceType,
        tags: filter.tags.join(',')
    })
    const {data: tracks} = useRemote<{ items: ITrack[] }>(trackUrl);
    const [playingTrack, setPlayingTrack] = useState<ITrack | null>(null);
    const [playing, setPlaying] = useState(false);
    const playTrack = (track: ITrack) => {
        setPlayingTrack(track);
        playingState.playTrack(track.url);
        setPlaying(true);
    }

    const pause = () => {
        playingState.pause();
        setPlaying(false);
    }

    const playNextOrFirst = () => {
        if (!tracks) {
            return;
        }

        const index = tracks.items.findIndex(t => t.id === playingTrack!.id);
        if (index === tracks.items.length - 1) {
            playTrack(tracks.items[0]);
        } else {
            playTrack(tracks.items[index + 1]);
        }
    }

    const playPreviousOrLast = () => {
        if (!tracks) {
            return;
        }

        const index = tracks.items.findIndex(t => t.id === playingTrack!.id);
        if (index === 0) {
            playTrack(tracks.items[tracks.items.length - 1]);
        } else {
            playTrack(tracks.items[index - 1]);
        }
    }

    const resumeOrPlayFirst = () => {
        if (!tracks) {
            return;
        }

        if (playingTrack) {
            playingState.resume();
            setPlaying(true);
        } else {
            playTrack(tracks.items[0]);
        }
    }

    return (
        <div className="overflow-auto flex flex-col flex-grow max-h-screen">
            <div className="flex flex-grow gap-4">
                <div
                    className="flex-grow flex flex-col rounded-2xl px-5 pt-5 bg-[url('https://img.freepik.com/premium-vector/space-background-with-stars-vector-illustration_97886-319.jpg')]">
                    <div className="flex flex-col h-full items-center">
                        <div className="flex flex-col flex-grow h-full">
                            <img className="h-96 w-full" src="https://thumbs.dreamstime.com/b/waltz-dance-514176.jpg"
                                 alt="logo"/>
                        </div>
                        <div className="h-[120px] w-full">
                            <div className="h-[30px] text-lg">
                                {playingTrack?.title}
                            </div>
                            <div className="h-[40px] flex items-center relative">
                                <div className="h-[13px] w-[13px] absolute top-[34%] bg-gray rounded-2xl"/>
                                <div className="h-[1px] w-full bg-gray"/>
                            </div>
                            <div className="h-[40px] flex justify-center gap-4">
                                <FaStepBackward onClick={playPreviousOrLast} className="cursor-pointer"/>
                                {!playing
                                    ? <FaPlay className="cursor-pointer" onClick={resumeOrPlayFirst}/>
                                    : <FaPause className="cursor-pointer" onClick={pause}/>}
                                <FaStepForward onClick={playNextOrFirst} className="cursor-pointer"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="app-attract rounded-2xl">
                    {tracks && tracks.items.map(p => {
                        return <div key={p.id}
                                    onClick={() => {
                                        playTrack(p);
                                        console.log(p.url);
                                    }}
                                    data-playing={playingTrack?.id === p.id}
                                    className="data-[playing=true]:bg-opacity-40 data-[playing=true]:bg-gray first:rounded-tr-2xl first:rounded-tl-2xl p-2 flex justify-between items-center hover:bg-gray hover:cursor-pointer hover:bg-opacity-40">
                            <div className="mr-2 truncate max-w-[168px] select-none">{p.title}</div>
                            <div className="cursor-pointer">
                                <FaPlay/>
                            </div>
                        </div>
                    })}
                </div>
            </div>
        </div>
    );
}
