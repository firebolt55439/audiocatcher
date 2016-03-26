var stoprec;

function record() {
    var context = window.audioContext || window.webkitAudioContext;
    var promise = navigator.mediaDevices.getUserMedia({audio: true, video: false});
    var source;
    promise.then(function (stream) {
                 var recorder = new Recorder(stream, this.config);
                 var media = navigator.mediaDevices.getUserMedia();
                 recorder.record();
//                 stoprec = function(){
//                 console.log("HELLOWORLD!")
//                 recorda.stop();
//                 recorda.exportWAV(this.config.callback(), WAV)
//                 recorda.encodeAfterRecorder();
//                 recorda.forceDownload(blob, output)
//                 }
                 })
    
    promise.catch(function (error) { console.log("smth wnt wrng wit get mic") }); //Mozeela
}

function stop() {
    console.log("HELLO!");
    stoprec();
}

function upload() {}

function soundcloud() {}




