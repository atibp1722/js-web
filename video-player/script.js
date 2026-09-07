// selecting the video elements using id and class
let videoContainer = document.querySelector(".video-container");
let container = document.querySelector(".container");
let myVideo = document.getElementById("my-video");
let rotateContainer = document.querySelector(".rotate-container");
let videoControls = document.querySelector(".controls");
let playButton = document.getElementById("play-btn");
let pauseButton = document.getElementById("pauseButton");
let volume = document.getElementById("volume");
let volumeRange = document.getElementById("volume-range");
let volumeNum = document.getElementById("volume-num");
let high = document.getElementById("high");
let low = document.getElementById("low");
let mute = document.getElementById("mute");
let sizeScreen = document.getElementById("size-screen");
let screenCompress = document.getElementById("screen-compress");
let screenExpand = document.getElementById("screen-expand");
let currentProgress = document.getElementById("current-progreess");
let currentTimeRef = document.getElementById("current-time");
let maxDuration = document.getElementById("max-duration");
let progressBar = document.getElementById("progress-bar");
let playbackSpeedButton = document.getElementById("playback-speed-btn");
let playBackContainer = document.querySelector(".playback");
let playBackSpedOptions = document.querySelector(".playback-options");

// function for volume percentage
// remaining volume slider color based on draggin action
function slider(){
    valPercent = (volumeRange.value / volumeRange.max)*100;
    volumeRange.style.background = `linear-gradient(to right, #2887e3 ${valPercent}%, #000000 ${valPercent}%)`;
}

// store different click event types
let events = {
    mouse: {
        click: "click",
    },
    touch: {
        click: "touchstart",
    },
};

let deviceType = "";

// check whether touch works or not
const isTouchDevice = () => {
    // create touch event if it works
    try{
        document.createEvent("TouchEvent");
        deviceType = "touch";
        return true;
    }catch(e){
        // if fails it is mouse 
        deviceType = "mouse";
        return false;
    }
};

// when play button pressed, show pause button and hide play button
playButton.addEventListener("click", () => {
    myVideo.play();
    pauseButton.classList.remove("hide");
    playButton.classList.add("hide");
});

// when pause button pressed, show play button and hide pause button
pauseButton.addEventListener(
    "click",
    (pauseVideo = () => {
        myVideo.pause();
        pauseButton.classList.add("hide");
        pauseButton.classList.remove("hide");
    })
);

// when playback container clicked, show playback speed options
playBackContainer.addEventListener("click", () => {
    playBackSpedOptions.classList.remove("hide");
})
