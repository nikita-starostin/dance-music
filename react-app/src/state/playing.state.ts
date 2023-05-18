
class PlayingState {
    private audio = new Audio();

    // when doing add event listener need to store reference to listener, to call later remove event listener
    private eventListenersMap = {
        timeupdate: [] as ((event: Event) => void)[],
        ended: [] as ((event: Event) => void)[],
        pause: [] as ((event: Event) => void)[],
        play: [] as ((event: Event) => void)[],
    }

    async playTrack(url: string, options?: {
        onEnd?: () => void,
        onPause?: () => void,
        onPlay?: () => void,
        onTimeUpdate?: (currentTime: number, duration: number) => void
    }) {
        this.audio.pause();
        this.eventListenersMap.timeupdate.forEach(listener => this.audio.removeEventListener('timeupdate', listener));
        this.eventListenersMap.ended.forEach(listener => this.audio.removeEventListener('ended', listener));
        this.eventListenersMap.pause.forEach(listener => this.audio.removeEventListener('pause', listener));
        this.eventListenersMap.play.forEach(listener => this.audio.removeEventListener('play', listener));

        this.eventListenersMap.timeupdate = [];
        this.eventListenersMap.ended = [];
        this.eventListenersMap.pause = [];
        this.eventListenersMap.play = [];

        if(options?.onTimeUpdate) {
            this.eventListenersMap.timeupdate.push(() => {
                if(options?.onTimeUpdate) {
                    options.onTimeUpdate(this.audio.currentTime, this.audio.duration);
                }
            });
        }
        this.eventListenersMap.timeupdate.push(this.reduceSoundIfEndIsClose.bind(this));
        if (options?.onEnd) {
            this.eventListenersMap.ended.push(options?.onEnd);
        }
        if (options?.onPause) {
            this.eventListenersMap.pause.push(options?.onPause);
        }
        if (options?.onPlay) {
            this.eventListenersMap.play.push(options?.onPlay);
        }

        this.audio = new Audio(url);
        this.eventListenersMap.timeupdate.forEach(listener => this.audio.addEventListener('timeupdate', listener));
        this.eventListenersMap.ended.forEach(listener => this.audio.addEventListener('ended', listener));
        this.eventListenersMap.pause.forEach(listener => this.audio.addEventListener('pause', listener));
        this.eventListenersMap.play.forEach(listener => this.audio.addEventListener('play', listener));
        await this.audio.play();
    }

    setCurrentTime(time: number) {
        if (!this.audio.paused) {
            this.audio.currentTime = time;
        }
    }

    resume() {
        this.audio.play();
    }

    pause() {
        this.audio.pause();
    }

    private reduceSoundIfEndIsClose() {
        const timeLeft = this.audio.duration - this.audio.currentTime;
        if (timeLeft < 5) {
            const newVolume = timeLeft / 5;
            this.audio.volume = newVolume > 0 ? newVolume : 0;
        } else {
            this.audio.volume = 1;
        }
    }
}

export const playingState = new PlayingState();
