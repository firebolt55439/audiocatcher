var recorder;
var context;

function dgid(id) {
    return document.getElementById(id);
}

function ga(a, b) {
    return a.getAttribute(b);
}

function dga(a, b) {
    return ga(dgid(a), b);
}

function sa(a, b, c) {
    a.setAttribute(b, c);
}

function dsa(a, b, c) {
    sa(dgid(a), b, c);
}

var file;

function record() {
    dsa("record", "class", "hide");
    dsa("stop", "class", "show");
    context = new AudioContext();
    var promise = navigator.mediaDevices.getUserMedia({audio: true, video: false});
    promise.then(function (stream) {
                 recorder = new Recorder(context.createMediaStreamSource(stream));
                 recorder.record();
                 })
    
    promise.catch(function (error) { console.log("record() failed") }); //Mozeela
}

function stop() {
    dsa("stop", "class", "hide");
    dsa("downlink", "class", "show");
    recorder.stop();
    recorder.exportWAV(deal);
}

function deal(blob) {
    file = blob;
    var url = URL.createObjectURL(blob);
    var link = dgid("downlink")
    sa(link, "href", url);
}

function showFile() {
    dsa("downlink", "class", "hide");
    dsa("record", "class", "show");
}

function upload(event) {
    var input = event.target;

    file = input.files[0];
    console.log(file.lastModifiedDate);
}
function click(){}


function soundcloud() {}




