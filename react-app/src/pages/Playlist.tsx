import {useRemote} from "../api/useRemote";
import {ITrack} from "../models";
import {Urls} from "../api/urls";
import {useState} from "react";
import {getUrlWithQueryParams} from "../api/getUrlWithQueryParams";
import {FaPause, FaPlay, FaStepBackward, FaStepForward} from "react-icons/fa";
import {playingState} from "../state/playing.state";
import {useAtomValue} from "jotai";
import {filterAtom} from "../state/filter.state";

function formatAudioTime(duration: number) {
    const seconds = Math.floor(duration % 60);
    const minutes = Math.floor(duration / 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

class AudioPlayer {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private setPlayingTrack: (track: ITrack) => void = () => {
    };
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private setCurrentTrackTime: (time: number) => void = () => {
    };
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private setDuration: (duration: number) => void = () => {
    };
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private setPlaying: (playing: boolean) => void = () => {
    };
    private tracks?: { items: ITrack[]};
    private playingTrack: ITrack | null = null;

    updateStates = (
        setPlayingTrack: (track: ITrack) => void,
        setCurrentTrackTime: (time: number) => void,
        setDuration: (duration: number) => void,
        setPlaying: (playing: boolean) => void,
        tracks: {items: ITrack[]} | undefined,
        playingTrack: ITrack | null
    ) => {
        this.setPlayingTrack = setPlayingTrack;
        this.setCurrentTrackTime = setCurrentTrackTime;
        this.setDuration = setDuration;
        this.setPlaying = setPlaying;
        this.tracks = tracks;
        this.playingTrack = playingTrack;
    }

    playTrack = async (track: ITrack) => {
        this.setPlayingTrack(track);
        try {
            this.setPlaying(true);
            await playingState.playTrack(track.url, {
                onTimeUpdate: (time, duration) => {
                    this.setCurrentTrackTime(Number(time.toFixed(0)));
                    this.setDuration(Number(duration.toFixed(0)));
                },
                onEnd: () => {
                    this.playNextOrFirst();
                }
            });
        } catch {
            this.setPlaying(false);
            this.playNextOrFirst();
        }
    }

    pause = () => {
        playingState.pause();
        this.setPlaying(false);
    }

    playNextOrFirst = () => {
        if (!this.tracks) {
            return;
        }

        const track = this.playingTrack;
        const index = track
            ? this.tracks.items.findIndex(t => t.id === track.id)
            : 0;
        if (index === this.tracks.items.length - 1) {
            this.playTrack(this.tracks.items[0]);
        } else {
            this.playTrack(this.tracks.items[index + 1]);
        }
    }

    playPreviousOrLast = () => {
        if (!this.tracks) {
            return;
        }

        const track = this.playingTrack;
        const index = track
            ? this.tracks.items.findIndex(t => t.id === track.id)
            : 0;
        if (index === 0) {
            this.playTrack(this.tracks.items[this.tracks.items.length - 1]);
        } else {
            this.playTrack(this.tracks.items[index - 1]);
        }
    }

    resumeOrPlayFirst = () => {
        if (!this.tracks) {
            return;
        }

        if (this.playingTrack) {
            playingState.resume();
            this.setPlaying(true);
        } else {
            this.playTrack(this.tracks.items[0]);
        }
    }

}

const audioPlayer = new AudioPlayer();

export default function Playlist() {
    const filter = useAtomValue(filterAtom);
    const trackUrl = getUrlWithQueryParams(Urls.Tracks, {
        danceType: filter.danceType,
        tags: filter.tags.join(',')
    })
    const {data: tracks} = useRemote<{ items: ITrack[] }>(trackUrl);
    const [playingTrack, setPlayingTrack] = useState<ITrack | null>(null);
    const [playing, setPlaying] = useState(false);
    const [currentTrackTime, setCurrentTrackTime] = useState(0);
    const [duration, setDuration] = useState(0);
    audioPlayer.updateStates(setPlayingTrack, setCurrentTrackTime, setDuration, setPlaying, tracks, playingTrack);
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
                            <div className="h-[40px] flex items-center relative cursor-pointer" onClick={(event) => {
                                // set the current time of the track
                                const rect = event.currentTarget.getBoundingClientRect();
                                const x = event.clientX - rect.left;
                                const percentage = x / rect.width;
                                const time = percentage * duration;
                                playingState.setCurrentTime(time);
                                setCurrentTrackTime(Number(time.toFixed(0)));
                            }}>
                                <div className="h-[13px] w-[13px] absolute top-[34%] bg-gray rounded-2xl"
                                     style={{
                                         left: `${(currentTrackTime / duration) * 100}%`
                                     }}/>
                                <div className="absolute top-[-12%] right-0 rounded-2xl">
                                    {formatAudioTime(currentTrackTime)} / {formatAudioTime(duration)}
                                </div>
                                <div className="h-[1px] w-full bg-gray"/>
                            </div>
                            <div className="h-[40px] flex justify-center gap-4">
                                <FaStepBackward onClick={audioPlayer.playPreviousOrLast} className="cursor-pointer"/>
                                {!playing
                                    ? <FaPlay className="cursor-pointer" onClick={audioPlayer.resumeOrPlayFirst}/>
                                    : <FaPause className="cursor-pointer" onClick={audioPlayer.pause}/>}
                                <FaStepForward onClick={audioPlayer.playNextOrFirst} className="cursor-pointer"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="app-attract rounded-2xl">
                    {tracks && tracks.items.map(p => {
                        return <div key={p.id}
                                    onClick={() => {
                                        audioPlayer.playTrack(p);
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
