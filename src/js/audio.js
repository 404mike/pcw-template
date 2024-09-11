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
    if(track.cues.length === 0) {
        console.log('No cues found');
        setTimeout(() => {
            console.log('Trying again...');
            initializeCues(track);
        }
        , 500);
    }

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

    document.addEventListener('DOMContentLoaded', () => {
        const initializeIfReady = () => {
            const track = document.querySelector('track[kind="captions"]');
            if (audioPlayer.readyState >= 1) { // readyState 1: HAVE_METADATA
                if (track.track) {
                    initializeCues(track.track);
                } else {
                    track.addEventListener('load', () => initializeCues(track.track));
                }
            } else {
                audioPlayer.addEventListener('loadedmetadata', () => {
                    if (track.track) {
                        initializeCues(track.track);
                    } else {
                        track.addEventListener('load', () => initializeCues(track.track));
                    }
                });
            }
        };
        
        initializeIfReady();
        audioPlayer.addEventListener('error', (e) => {
            console.error('Error loading audio:', e);
        });
    });
};

export { initAudioPlayer };
