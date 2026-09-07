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
        playButton.classList.remove("hide");
    })
);

// when playback container clicked, show playback speed options
playBackContainer.addEventListener("click", () => {
    playBackSpedOptions.classList.remove("hide");
})

// user click anywhere else
window.addEventListener("click", (e) => {
    // if inside the container
    if(playBackContainer.contains(e.target)){
        // hide speed options
        playBackSpedOptions.classList.add("hide");
        // check if cliked in playback speed
    }else if (playBackSpedOptions.contains(e.target)){
        // hide speed options
        playBackSpedOptions.classList.add("hide");
    }
})

// change video playback speed
const setPlayback = (value) => {
    playbackSpeedButton.innerText = value + "x";
    // change playback speed
    myVideo.playbackRate = value;
};

// mute the video
const muter = () => {
    // show mute icon
    mute.classList.remove("hide");
    // hide other sound based icons
    high.classList.add("hide");
    low.classList.add("hide");
    // update volume to 0
    myVideo.volume = 0;
    volumeNum.innerHTML = 0;
    volumeRange.value = 0;
    // update slider color
    slider();
};

// high and low volume button clicked
high.addEventListener("click", muter);
low.addEventListener("click", muter);

// volume value from slider
volumeRange.addEventListener("input", () => {
    let volumeValue = volumeRange.value / 100;
    // set actual volume
    myVideo.volume = volumeValue;
    volumeNum.innerHTML = volumeRange.value;
    // condition to change volume icon based on volume value
    // low condition
    if (volumeRange.value < 50){
        low.classList.remove("hide");
        high.classList.add("hide");
        mute.classList.add("hide");
        // high condition
    }else if (volumeRange.value < 50){
        low.classList.remove("hide");
        high.classList.add("hide");
        mute.classList.add("hide");
    }
});

// full screen button action
screenExpand.addEventListener("click", () => {
    // show/hide appropiate icons
    screenCompress.classList.remove("hide");
    screenExpand.classList.add("hide");
    // request full screen mode
    videoContainer
        .requestFullscreen()
        .catch((err) => alert("Sorry, full scree not supported"));
    if (isTouchDevice()){
        // fallback options if browser option fail
        let screenOrientation = 
            screen.orientation || screen.mozOrientation || screen.msOrientation;
            // check if in portait mode
        if (screenOrientation.type == "portrait-primary"){
            pauseVideo();
            // show rotate device
            rotateContainer.classList.remove("hide");
            // hide message after 3 seconds
            const timeOut = setTimeout(() => {
                rotateContainer.classList.add("hide");
            }, 3000);
        }
    }
});

// exit event handlers for full screen 
document.addEventListener("fullscreenchange", exitHandler);
document.addEventListener("webkitfullscreenchange", exitHandler);
document.addEventListener("mozfullscreenchange", exitHandler);
document.addEventListener("MSFullscreenchange", exitHandler);

function exitHandler(){
    // check whether browser full screen or not
    if(
        !document.fullscreenElement &&
        !document.webKitIsFullScreen &&
        !document.mozFullScreen &&
        !document.mozFullScreenElement
    )    {
        //return to normal size screen
        normalScreen();
    }

    // exiting the full screen
    screenCompress.addEventListener("click", (normalScreen = () => {
        screenCompress.classList.add("hide");
        screenExpand.classList.remove("hide");
        // exit full screen using various methods
        if (document.fullscreenElement){
            if (document.exitFullscreen){
                document.exitFullscreen();
            }else if(document.mozCancelFullScreen){
                document.mozCancelFullScreen();
            }else if(document.webKitExitFullScreen){
                document.webKitExitFullScreen();
            }
        }
    })
    );

    // convert video time into a format
    const timeFormatter = (timeInput) => {
        // convert seconds to minutes
        let minute = Math.floor(timeInput/60);
        // add 0 before a single digit number
        minute = minute < 10 ? "0" + minute : minute;
        // get the remaining seconds
        let second = Math.floor(timeInput%60);
        second = second < 10 ? "0" + second : second;
        return `${minute}:${second}`;
    };

    // set intreval to refresh every second
    setInterval (() => {
        myVideo.currentTime;
        // convert and dispaly time in the format on screen
        currentTimeRef.innerHTML = timeFormatter(myVideo.currentTime);
        // calculate width of video already played
        currentProgress.style.width = (myVideo.currentTime / myVideo.duration.toFixed(3)) * 100 + "%";
    }, 1000);

    myVideo.addEventListener("timeupdate", () => {
        // get and write time on screen in format
        currentTimeRef.innerText = timeFormatter(myVideo.currentTime);
    });

    isTouchDevice();
    progressBar.addEventListener(events[deviceType].click, (event) => {

    })
}