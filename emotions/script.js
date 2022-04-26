'use strict'
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const avatarImgs = document.querySelectorAll('.img-avatar');

let expression = '';
let angry = '';
let neutral = '';
let happy = '';
let surprised = '';
let disgusted = '';
let fearful = '';
let sad = '';

window.onload = () => {

    Promise.all([

        faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
        faceapi.nets.faceExpressionNet.loadFromUri('./models')

    ]).then(startVideo());

    $('#video').addEventListener('play', drawBorders);

}

function getUserMediaSupported() {

    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

}


function startVideo() {

    if (getUserMediaSupported()) {

        // getUsermedia parameters to force video but not audio.

        const constraints = {

            video: true

        };

        // Activate the webcam stream.
        navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {

            $('#video').srcObject = stream;

        });


    } else {

        console.warn('getUserMedia() is not supported by your browser');

    }

}

// 004 - Define the array with emoji
let statusIcons = {
    default: '😎',
    neutral: '🙂',
    happy: '😀',
    sad: '😥',
    angry: '😠',
    fearful: '😨',
    disgusted: '🤢',
    surprised: '😳'
  }


function drawBorders() {

    const canvas = faceapi.createCanvasFromMedia($('#video'));
    
    const displaySize = {width: $('#video').width, height: $('#video').height};
    $('#face').append(canvas);

    faceapi.matchDimensions(canvas, displaySize);

    
    setInterval(async () => {

        const detections = await faceapi.detectAllFaces($('#video'), new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();


        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

        if (detections.length > 0) {
            // 009 - walk through all faces detected
            detections.forEach(element => {
         
                //status is the expression name
              let status = "";
              let valueStatus = 0.0;
              for (const [key, value] of Object.entries(element.expressions)) {
                if (value > valueStatus) {
                  status = key
                  valueStatus = value;
                }
              }
              
                $('#current_emotion').src = `./images2/${status}.png`;

                if(status === "happy") $('#test').style.display = 'block';
                else $('#test').style.display = 'none';
                //getAvatar(status);
            });
          } else {
            console.log("No Faces")
            //face.innerHTML = statusIcons.default;
          }

    }, 800)
    
}