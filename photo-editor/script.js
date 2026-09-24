// reference to html elements
const canvas = document.getElementById("canvas");
// canvas for image
const context = canvas.getContext("2d");
// reference to image actions
const upload = document.getElementById("upload");
const brightness = document.getElementById("brightness");
const contrast = document.getElementById("contrast");
const saturation = document.getElementById("saturation");
const blur = document.getElementById("blur");
const greyscale = document.getElementById("greyscale");
const sepia = document.getElementById("sepia");
// object for new image
let img = new Image();
// image transformation variables
let rotation = 0;
let flipX = 1;
let flipY = 1;

// trigger when file uploaded
upload.addEventListener("change", function(){
    // get first file from list
    const file = this.files[0];
    if (!file) return;
    // read image as data url
    const reader = new FileReader();
    // ready image to the handler
    reader.onload = function(event){
        img.onload = function(){
            // reset slider values
            resetEditor();
        };
        // assign data url to mimage
        img.src = event.target.result;
    };
    // read as data url
    reader.readAsDataURL(file);
});

// function for render image on canvas
function draw(){
    if (!img.src) return;
    // rotation degree to radian for canvas
    const angle = rotation * Math.PI / 180;
    // image rorated by 90 or 270 degree
    const rotated = rotation % 180 !== 0;
    // swap height and width to prevent clipping
    canvas.width = rotated ? img.height : img.width;
    canvas.height = rotated ? img.width : img.height;
    // clear canvas 
    context.clearRect(0, 0, canvas.width, canvas.height);
    // save current canvas before transformation
    context.save();
    // move to center for easy rotation
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate(angle);
    // horizontal and vertical transformation
    context.scale(flipX, flipY);
    // apply filter
    context.filter = `
                    brightness(${brightness.value}%)
                    contrast(${contrast.value}%)
                    saturate(${saturation.value}%)
                    blur(${blur.value}px)
                    grayscale(${greyscale.value}%)
                    sepia(${sepia.value}%)`;
    // draw image around (0, 0) coordinates
    context.drawImage(img, -img.width / 2, -img.height / 2);
    // canvas restore to state before
    context.restore();
}

// iterate all elements
[
    brightness, contrast, saturation, blur, greyscale, sepia
].forEach(control => {
    // listen as long as user grags slider
    control.addEventListener("input", draw);
});

// event button to rotate image left
document.getElementById("rotateLeft").onclick = () => {
    // decrease angle 90 degree to rate anti-clockwise
    rotation -= 90;
    draw();
}
// event button to rotate image right
document.getElementById("rotateRight").onclick = () => {
    // increase angle 90 degree to rate lockwise
    rotation += 90;
    draw();
}
// event button to flip image horizontally
document.getElementById("flipX").onclick = () => {
    // scaling factor from [1, -1 and -1, 1]
    flipX *= -1;
    draw();
}
// event button to flip image vertically
document.getElementById("flipY").onclick = () => {
    // scaling factor from [1, -1 and -1, 1]
    flipY *= -1;
    draw();
}