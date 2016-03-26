
var recorder;
var file;

function record() {
    var context = new AudioContext();
    var promise = navigator.mediaDevices.getUserMedia({audio: true, video: false});
    promise.then(function (stream) {
                 recorder = new Recorder(context.createMediaStreamSource(stream));
                 recorder.record();
                 })
    
    promise.catch(function (error) { console.log("smth wnt wrng wit get mic") }); //Mozeela
}

function stop() {
    recorder.stop();
    recorder.exportWAV(this.config.callback(), WAV)
    recorder.encodeAfterRecorder();
    recorder.forceDownload(blob, output)
}

function upload(event) {
    var input = event.target;

    file = input.files[0];
    console.log(file.lastModifiedDate);
}
function click(){}


function soundcloud() {}




