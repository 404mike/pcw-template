const audioPlayer = document.getElementById('pcwAudioPlayer');

// Function to convert seconds to HH:MM:SS format
const secondsToHHMMSS = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

// Function to initialize cues once track data is loaded
const initializeCues = (track) => {
    const captionBox = document.getElementById('captionBox');
    const cues = track.cues;

    for (let i = 0; i < cues.length; i++) {
        const cue = cues[i];
        const text = cue.text;
        const startTime = secondsToHHMMSS(cue.startTime);
        const cueDiv = document.createElement('div');
        cueDiv.innerHTML = `<span class="audio-transcript-time">${startTime}</span> ${text}`;
        cueDiv.id = `cue${i}`;
        cueDiv.classList.add('audio-cue');
        captionBox.appendChild(cueDiv);

        cue.onenter = function () {
            document.querySelector('.caption-box-active')?.classList.remove('caption-box-active');
            cueDiv.classList.add('caption-box-active');
            // Scroll within the captionBox only
            captionBox.scrollTop = cueDiv.offsetTop - captionBox.offsetTop;
        };

        cue.onexit = function () {
            cueDiv.classList.remove('caption-box-active');
        };
    }
};

// Initialize the audio player and setup event listeners
const initAudioPlayer = () => {
    if (!audioPlayer) return;

    console.log('Initializing audio player');

    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM loaded');
        audioPlayer.addEventListener('loadedmetadata', () => {
            console.log('Audio metadata loaded');
            const checkTrackReady = setInterval(() => {
                const track = document.querySelector('track[kind="captions"]');
                console.log("checkTrackReady", track);
                if (track && track.track && track.track.cues) {
                    clearInterval(checkTrackReady);
                    initializeCues(track.track);
                }
            }, 100); // Check every 100ms

            audioPlayer.addEventListener('error', (e) => {
                clearInterval(checkTrackReady);
                console.error('Error loading audio:', e);
            });
        });
    });
};
export { initAudioPlayer };
