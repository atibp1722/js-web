// song node
class Node{
    constructor(song){
        this.song = song;
        this.prev = null;
        this.next = null;
    }
}

// doubly linked list representation of music player
class DoublyLinkedList{
    constructor(){
        // pointer to first song
        this.head = null;
        // pointer to last song
        this.tail = null;
        // currently active song
        this.current = null;
    }
    // add song at the end
    add(song){
        let newNode = new Node(song);
        // check playlist empty
        if (this.head === null){
            // first node becomes head, tail and active 
            this.head = newNode;
            this.tail = newNode;
            this.current = newNode;
        } else{
            // put song after current tail and update pointer to new tail
            newNode.prev = this.tail;
            this.tail.next = newNode;
            this.tail = newNode;
        }
    }
    // move forward to circle back to first song if current song is at end
    next(){
        if (this.current.next !== null){
            // move to the next node
            this.current = this.current.next;
        } else{
            // circle back to first as the previous was the last
            this.current = this.head;
        }
        // currently active song
        return this.current.song;
    }
    // move backwards to circle back to last song if at first song
    previous(){
        if (this.current.prev !== null){
            // move to next node
            this.current = this.current.prev;
        } else{
            // circle back to last as the previous was the first
            this.current = this.tail;
        }
        // currently active song
        return this.current.song;
    }
}

// new playlist instance create
let playlist = new DoublyLinkedList();
// add tracks to the playlist
playlist.add({
    title: "Testtify",
    artist: "Rage Against The Machine",
    src: "song/music.mp3"
});
playlist.add({
    title: "Up The Mountain",
    artist: "Vince Di Cola",
    src: "song/music.mp3"
});
playlist.add({
    title: "Gimme Sheler",
    artist: "The Rolling Stones",
    src: "song/music.mp3"
});
playlist.add({
    title: "Marathon",
    artist: "Rush",
    src: "song/music.mp3"
});
playlist.add({
    title: "Sabotage",
    artist: "Beastie Boys",
    src: "song/music.mp3"
});

// get refrence to the html elements
let audio = document.getElementById("audio");
let title = document.getElementById("title");
let artist = document.getElementById("artist");
let playBtn = document.getElementById("playBtn");
let progress = document.getElementById("progress");
let time = document.getElementById("time");
let songList = document.getElementById("songs");

// currently active song data to webpage
function loadSong(){
    let song = playlist.current.song;
    title.innerText = song.title;
    artist.innerText = song.artist;
    audio.src = song.src;
    showPlaylist();
}

// change status and show by changing icons
function playPause(){
    if (audio.paused){
        audio.play();
        playBtn.innerText = "⏸️";
    } else{
        audio.pause();
        playBtn.innerText = "▶️";
    }
}

// move pointer forward to next song
function nextSong(){
    playlist.next();
    loadSong();
    audio.play();
    playBtn.innerText = "⏸️";
}
// move pointer backward to previous song
function prevSong(){
    playlist.previous();
    loadSong();
    audio.play();
    playBtn.innerText = "⏸️";
}
// trigger next song function as soon as music finish 
audio.addEventListener("ended", nextSong);

// sync progress bar with music time
audio.addEventListener("timeupdate", function(){
    if (audio.duration){
        // percent of song completed
        let percent = (audio.currentTime / audio.duration) * 100;
        progress.value = percent;
        // update time label
        time.innerText = formatTime(audio.currentTime) + "/" + formatTime(audio.duration);
    }
});

// seek feature in progress bar
progress.addEventListener("input", function(){
    if (audio.duration){
        // jump to current time based on progress bar 
        audio.currentTime = (progress.value / 100) * audio.duration;
    }
});

// function for time format
function formatTime(secs){
    let mins = Math.floor(secs / 60);
    let secsLeft = Math.floor(secs % 60);
    return mins + ":" + secsLeft.toString().padStart(2, "0");
}

// function for render playlist on webpage
function showPlaylist(){
    songList.innerHTML = "";
    // begin from playlist head
    let node = playlist.head;
    while (node !== null){
        // create new element
        let li = document.createElement("li");
        // add song info
        li.innerText = node.song.title + " - " + node.song.artist;
        // check node is currently active song
        if (node === playlist.current){
            // css highlight
            li.classList.add("active");
        }
        // add it to webpage container
        songList.appendChild(li);
        // move to next nsong in list
        node = node.next;
    }
}

loadSong();